import json
import pickle
import os
from http.server import BaseHTTPRequestHandler

# Load model once when the function is initialized
def load_model():
    try:
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'Meetings11.pkl')
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None

model = load_model()

# Define categories
categories = [
    'Training', 'Planning', 'Marketing & Sales', 'Finance', 'HR', 'IT',
    'Operations', 'Logistics', 'Miscellaneous', 'Other'
]

def predict_top_3(description):
    if model is None:
        raise Exception("Model not loaded")
    
    X_new = model.named_steps['vect'].transform([description])
    probas = model.named_steps['clf'].predict_proba(X_new)[0]
    top_3_indices = probas.argsort()[-3:][::-1]
    
    predictions = []
    for idx in top_3_indices:
        predictions.append({
            'category': categories[idx],
            'probability': float(probas[idx])
        })
    
    return predictions

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            if not data or "description" not in data:
                self.send_error(400, "Missing 'description' in request data")
                return

            description = data.get("description")
            if not isinstance(description, str) or description.strip() == "":
                self.send_error(400, "'description' must be a non-empty string")
                return

            prediction_type = data.get("type", "single")

            if prediction_type == "top3":
                predictions = predict_top_3(description)
                response_data = {
                    "type": "top3",
                    "predictions": predictions
                }
            else:
                if model is None:
                    self.send_error(500, "Model not loaded")
                    return
                
                prediction = model.predict([description])
                predicted_category = prediction[0]
                response_data = {
                    "type": "single",
                    "prediction": predicted_category
                }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.end_headers()
            
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            self.send_error(500, str(e))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.end_headers()
