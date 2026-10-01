import http.server
import socketserver
import webbrowser
import os
import sys

DEFAULT_PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def find_available_port(start_port):
    import socket
    port = start_port
    while port < start_port + 50:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('localhost', port)) != 0:
                return port
        port += 1
    return start_port

def run():
    port = find_available_port(DEFAULT_PORT)
    url = f"http://localhost:{port}"
    print(f"\n=======================================================")
    print(f"🚀 Mav Web Application is running at:")
    print(f"👉 {url}")
    print(f"=======================================================\n")
    print("Press Ctrl+C to stop the server.\n")

    webbrowser.open(url)

    with socketserver.TCPServer(("", port), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer shutting down...")
            httpd.server_close()
            sys.exit(0)

if __name__ == "__main__":
    run()