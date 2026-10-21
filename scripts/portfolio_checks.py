"""Shared paths and static App Router discovery for local verification."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def discover_routes():
    routes = set()
    for page in (ROOT / "src/app").rglob("page.*"):
        if page.suffix not in {".tsx", ".ts", ".jsx", ".js"}:
            continue
        parts = page.parent.relative_to(ROOT / "src/app").parts
        if any(part.startswith(("_", "@")) for part in parts):
            continue
        if any("[" in part for part in parts):
            raise ValueError(f"Add concrete verification URLs for dynamic route: {page}")
        parts = [part for part in parts if not part.startswith("(")]
        routes.add("/" + "/".join(parts))
    if not routes:
        raise ValueError("No app routes found")
    return sorted(routes)


def public_files():
    return sorted(path for path in PUBLIC.rglob("*")
                  if path.is_file() and path != PUBLIC / "asset-manifest.json")
