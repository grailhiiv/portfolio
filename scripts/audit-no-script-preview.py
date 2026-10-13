"""Local-only audit fixture: proxy the app with scripts blocked by CSP.

Run during the audit, visit localhost:3001, and stop when finished. This verifies
readable HTML and a native cursor when hydration cannot run, not gallery behavior.
"""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import requests


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        response = requests.get("http://127.0.0.1:3000" + self.path, timeout=30)
        self.send_response(response.status_code)
        self.send_header("Content-Type", response.headers.get("Content-Type", "application/octet-stream"))
        self.send_header("Content-Security-Policy", "script-src 'none'; object-src 'none'")
        self.send_header("Content-Length", str(len(response.content)))
        self.end_headers()
        self.wfile.write(response.content)

    def log_message(self, *_):
        pass


print("Script-blocked audit preview: http://127.0.0.1:3001", flush=True)
ThreadingHTTPServer(("127.0.0.1", 3001), Handler).serve_forever()
