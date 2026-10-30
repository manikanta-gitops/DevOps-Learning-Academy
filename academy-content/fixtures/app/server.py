import json
import logging
import os
import time
from contextlib import nullcontext
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


def response_for(path: str, mode: str) -> tuple[int, dict[str, str]]:
    if path == "/health":
        return 200, {"status": "alive"}
    if path == "/ready":
        return (503, {"status": "not ready"}) if mode == "unready" else (200, {"status": "ready"})
    if path == "/error":
        return 500, {"error": "training failure", "code": "DEMO_ERROR"}
    if path in ("/", "/slow"):
        return 200, {"message": "academy", "version": os.environ.get("APP_VERSION", "1")}
    return 404, {"error": "not found"}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        path = urlsplit(self.path).path
        started = time.monotonic()
        tracing = os.environ.get("ENABLE_DDTRACE") == "1"
        if tracing:
            from ddtrace import tracer

            request_span = tracer.trace("academy.request", service="academy", resource=path)
        else:
            request_span = nullcontext()
        with request_span as span:
            if path == "/slow":
                time.sleep(2)
            status_code, body = response_for(path, os.environ.get("APP_MODE", "normal"))
            if span is not None:
                span.set_tag("http.status_code", status_code)
                span.error = int(status_code >= 500)
            payload = json.dumps(body).encode("utf-8")
            self.send_response(status_code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            try:
                self.wfile.write(payload)
            except (BrokenPipeError, ConnectionResetError):
                pass
            logging.info(json.dumps({
                "service": "academy", "env": "lab", "version": os.environ.get("APP_VERSION", "1"),
                "path": path, "status": status_code,
                "duration_ms": round((time.monotonic() - started) * 1000),
                "dd.trace_id": str(span.trace_id) if span is not None else "0",
                "dd.span_id": str(span.span_id) if span is not None else "0",
            }))

    def log_message(self, format: str, *args: object) -> None:
        return


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    host = os.environ.get("APP_HOST", "127.0.0.1")
    port = int(os.environ.get("APP_PORT", "8080"))
    ThreadingHTTPServer((host, port), Handler).serve_forever()