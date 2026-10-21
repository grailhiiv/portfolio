"""Verify current routes, internal links, rendered assets, and public-file integrity.

Run against a running local development or production server. This checks the
current portfolio, without comparing its content with an external snapshot.
"""
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import sys
from urllib.parse import parse_qs, unquote, urljoin, urlsplit
import requests
from bs4 import BeautifulSoup
from portfolio_checks import PUBLIC, ROOT, discover_routes, public_files

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000").rstrip("/")
ORIGIN = urlsplit(BASE).netloc


def fetch(path):
    response = requests.get(BASE + path, timeout=30, allow_redirects=False)
    if response.status_code != 200:
        raise ValueError(f"{path}: expected HTTP 200, got {response.status_code}")
    return response


def main():
    routes = discover_routes()
    pages = {route: BeautifulSoup(fetch(route).content, "html.parser") for route in routes}
    assets = set()
    for route, page in pages.items():
        if not page.select_one("main") or not page.select_one("#contact"):
            raise ValueError(f"{route}: missing main content or contact destination")
        for link in page.select("a[href]"):
            target = urlsplit(urljoin(BASE + route, link["href"]))
            if target.netloc != ORIGIN or target.scheme not in {"http", "https"}:
                continue
            path = unquote(target.path).rstrip("/") or "/"
            if path in pages:
                fragment = unquote(target.fragment)
                if fragment and not pages[path].find(id=fragment):
                    raise ValueError(f"{route}: missing link target {link['href']}")
            else:
                local = (PUBLIC / path.lstrip("/")).resolve()
                if not local.is_relative_to(PUBLIC) or not local.is_file():
                    raise ValueError(f"{route}: invalid internal link {link['href']}")
                assets.add(target.path)
        for video in page.select("video"):
            if not video.get("width") or not video.get("height") or not video.get("poster"):
                raise ValueError(f"{route}: video missing dimensions or poster")
            for src in [video.get("src"), video.get("poster")]:
                if src:
                    target = urlsplit(urljoin(BASE + route, src))
                    if target.netloc == ORIGIN:
                        assets.add(target.path)
        for element in page.select("img[src], video source[src], script[src], link[rel=stylesheet]"):
            src = element.get("src") or element.get("href")
            target = urlsplit(urljoin(BASE + route, src))
            if target.netloc == ORIGIN:
                assets.add(target.path + ("?" + target.query if target.query else ""))
            if element.name == "img":
                has_dimensions = bool(element.get("width") and element.get("height"))
                if not element.has_attr("alt") or not (has_dimensions or element.get("data-nimg") == "fill"):
                    raise ValueError(f"{route}: image missing alt, dimensions, or Next.js fill layout: {src}")
                if target.path == "/_next/image":
                    source = parse_qs(target.query).get("url", [""])[0]
                    if source.startswith("/_next/static/"):
                        assets.add(source)
                    elif source.startswith("/") and not source.startswith("//"):
                        local = (PUBLIC / source.lstrip("/")).resolve()
                        if not local.is_relative_to(PUBLIC) or not local.is_file():
                            raise ValueError(f"{route}: image source is missing: {source}")
        print("PASS route, internal links, image markup:", route)

    manifest = json.loads((PUBLIC / "asset-manifest.json").read_text("utf-8"))
    actual = {path.relative_to(ROOT).as_posix() for path in public_files()}
    listed = [entry["local"] for entry in manifest]
    if len(listed) != len(set(listed)) or set(listed) != actual:
        raise ValueError(f"Asset inventory changed (unlisted={sorted(actual - set(listed))}, "
                         f"missing={sorted(set(listed) - actual)}). Run python scripts/update-asset-manifest.py")

    def check_asset(entry):
        local = ROOT / entry["local"]
        data = local.read_bytes()
        if len(data) != entry["bytes"] or hashlib.sha256(data).hexdigest() != entry["sha256"]:
            raise ValueError(f"{entry['local']}: content changed; run python scripts/update-asset-manifest.py")
        if fetch("/" + local.relative_to(PUBLIC).as_posix()).content != data:
            raise ValueError(f"{entry['local']}: served bytes differ from local file")

    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(check_asset, manifest))
        list(pool.map(fetch, sorted(assets)))
    print(f"PASS {len(manifest)} public files: inventory, SHA-256, and served bytes")
    print(f"PASS {len(assets)} rendered media, script, stylesheet, and linked asset URLs")
    print("All current-site checks passed.")


if __name__ == "__main__":
    main()
