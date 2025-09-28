import json
from http.server import BaseHTTPRequestHandler

# Define categories
categories = [
    'Training', 'Planning', 'Marketing & Sales', 'Finance', 'HR', 'IT',
    'Operations', 'Logistics', 'Miscellaneous', 'Other'
]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            response_data = {"categories": categories}
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.end_headers()
            
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            self.send_error(500, str(e))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()
