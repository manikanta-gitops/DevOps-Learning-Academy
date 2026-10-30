import json
import threading
import unittest
from http.server import ThreadingHTTPServer
from urllib.error import HTTPError
from urllib.request import urlopen

from server import Handler, response_for


class ResponseTests(unittest.TestCase):
    def test_health_is_not_readiness(self):
        self.assertEqual(response_for("/health", "unready")[0], 200)
        self.assertEqual(response_for("/ready", "unready")[0], 503)

    def test_ready_and_training_errors(self):
        self.assertEqual(response_for("/ready", "normal")[0], 200)
        self.assertEqual(response_for("/error", "normal")[0], 500)
        self.assertEqual(response_for("/missing", "normal")[0], 404)

    def test_real_http(self):
        server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        worker = threading.Thread(target=server.serve_forever)
        worker.start()
        try:
            base_url = f"http://127.0.0.1:{server.server_port}"
            with urlopen(base_url + "/health", timeout=3) as response:
                self.assertEqual(response.status, 200)
                self.assertEqual(json.load(response), {"status": "alive"})
            with self.assertRaises(HTTPError) as failure:
                urlopen(base_url + "/error", timeout=3)
            self.assertEqual(failure.exception.code, 500)
            failure.exception.close()
        finally:
            server.shutdown()
            server.server_close()
            worker.join(timeout=3)


if __name__ == "__main__":
    unittest.main()