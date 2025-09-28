from flask import jsonify

def handler(request):
    """Main handler function for Vercel"""
    try:
        # Handle CORS preflight
        if request.method == 'OPTIONS':
            return jsonify({'status': 'ok'}), 200
        
        if request.method != 'GET':
            return jsonify({'error': 'Method not allowed'}), 405
        
        response = jsonify({"status": "API is running"})
        
        # Add CORS headers
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        
        return response, 200

    except Exception as e:
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

# For Vercel runtime
def main(request):
    return handler(request)

# For local testing
if __name__ == "__main__":
    from flask import Flask, request
    app = Flask(__name__)
    
    @app.route("/api/health", methods=["GET", "OPTIONS"])
    def health():
        return handler(request)
    
    app.run(debug=True, port=5003)
