"""HTTP regressions for progressive rendering, semantics, and image delivery."""
import re
import sys
import requests
from bs4 import BeautifulSoup

base = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3000"
routes = ["/", "/about", "/work", "/work/4fett", "/work/kiwi", "/work/togevent", "/work/bounty-hunters"]
failures = []

for route in routes:
    response = requests.get(base + route, timeout=30)
    response.raise_for_status()
    page = BeautifulSoup(response.content, "html.parser")
    main = page.select_one("main")
    if len(main.select("h1")) != 1:
        failures.append(f"{route}: expected one main heading")
    hidden = [el for el in main.select("[style]") if re.search(r"opacity:\s*0(?:;|$)", el["style"])]
    if hidden:
        failures.append(f"{route}: {len(hidden)} content elements hidden before JavaScript")
    if not page.select_one('header nav a[aria-current]'):
        failures.append(f"{route}: navigation has no current-page indication")
    if route == "/":
        portrait = main.select_one('img[alt="Portrait"]')
        if "512px" in portrait.get("sizes", "") or portrait.get("sizes", "").endswith("50vw"):
            failures.append("/: portrait sizes understate full-width mobile / wide desktop layout")
    if route == "/work":
        cards = [img for img in main.select("img") if "case-" in img.get("src", "")]
        if any(img.get("sizes") == "100vw" for img in cards):
            failures.append("/work: four-column cards request full-viewport images")

for failure in failures:
    print("FAIL", failure)
if failures:
    raise SystemExit(1)
print(f"PASS: {len(routes)} routes render readable HTML, one main heading, current navigation, and corrected image hints")
