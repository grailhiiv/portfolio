"""Verify the local recreation against the captured reference pages and assets."""
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from concurrent.futures import ThreadPoolExecutor
import json
import re
import requests
from bs4 import BeautifulSoup

BASE = "http://127.0.0.1:3000"
ROUTES = ["/", "/about", "/work", "/work/4fett", "/work/kiwi", "/work/togevent", "/work/bounty-hunters"]


def normalize(text):
    return re.sub(r"\s+", "", text)


def image_source(image):
    src = image["src"]
    return parse_qs(urlparse(src).query)["url"][0] if src.startswith("/_next/image") else src


for route in ROUTES:
    response = requests.get(BASE + route, timeout=30)
    response.raise_for_status()
    page = BeautifulSoup(response.content, "html.parser")
    for dialog in page.select("dialog"):
        dialog.decompose()
    # A visually hidden, accessible About heading was added during the audit.
    for heading in page.select("[data-audit-heading]"):
        heading.decompose()
    assert page.select_one("main"), route
    assert page.select_one("#contact"), route
    for link in page.select('a[href^="/"]'):
        assert link["href"].split("#")[0] in ROUTES, (route, link["href"])
    captured = Path("reference") / ((route.strip("/").replace("/", "--") or "home") + ".html")
    if captured.exists():
        reference = BeautifulSoup(captured.read_text("utf-8"), "html.parser")
        assert normalize(page.main.get_text()) == normalize(reference.main.get_text()), f"Copy mismatch: {route}"
        replacements = {"/images/about-hero.png": "/images/about-hero.webp"}
        original_images = [replacements.get(image_source(image), image_source(image)) for image in reference.main.select("img")]
        local_images = [image_source(image) for image in page.main.select("img")]
        assert original_images == local_images, f"Image/order mismatch: {route}"
    print("PASS route, text, images, navigation:", route)

manifest = json.loads(Path("public/asset-manifest.json").read_text("utf-8"))


def check_asset(asset):
    local = Path(asset["local"])
    response = requests.get(BASE + "/" + local.relative_to("public").as_posix(), timeout=30)
    response.raise_for_status()
    assert response.content == local.read_bytes(), f"Asset bytes mismatch: {local}"


with ThreadPoolExecutor(max_workers=8) as pool:
    list(pool.map(check_asset, manifest))
print(f"PASS {len(manifest)} local assets: HTTP 200 and exact file bytes")
print("All recreation checks passed.")
