"""Record the current public files, retaining known source attribution."""
import hashlib
import json
from portfolio_checks import PUBLIC, ROOT, public_files

manifest = PUBLIC / "asset-manifest.json"
previous = {entry["local"]: entry for entry in json.loads(manifest.read_text("utf-8"))} if manifest.exists() else {}
entries = []
for path in public_files():
    local = path.relative_to(ROOT).as_posix()
    data = path.read_bytes()
    entry = {"local": local, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
    if previous.get(local, {}).get("source"):
        entry["source"] = previous[local]["source"]
    entries.append(entry)
manifest.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")
print(f"Updated {manifest.relative_to(ROOT)}: {len(entries)} current files")
