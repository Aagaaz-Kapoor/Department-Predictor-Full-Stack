from flask import Flask, request, jsonify
import pickle
import numpy as np
import os
import sys

# Add the models directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'models'))

def load_model():
    """Load the pickled model"""
    try:
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'Meetings11.pkl')
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None

# Load model once when the function is initialized
model = load_model()

# Define categories
categories = [
    'Training', 'Planning', 'Marketing & Sales', 'Finance', 'HR', 'IT',
    'Operations', 'Logistics', 'Miscellaneous', 'Other'
]

def predict_top_3(description):
    """Predict top 3 categories with probabilities"""
    if model is None:
        raise Exception("Model not loaded")
    
    # Vectorize the description
    X_new = model.named_steps['vect'].transform([description])
    
    # Predict probabilities
    probas = model.named_steps['clf'].predict_proba(X_new)[0]
    
    # Get top 3 indices
    top_3_indices = probas.argsort()[-3:][::-1]
    
    # Get categories and probabilities
    predictions = []
    for idx in top_3_indices:
        predictions.append({
            'category': categories[idx],
            'probability': float(probas[idx])
        })
    
    return predictions

def handler(request):
    """Main handler function for Vercel"""
    try:
        # Handle CORS preflight
        if request.method == 'OPTIONS':
            return jsonify({'status': 'ok'}), 200
        
        if request.method != 'POST':
            return jsonify({'error': 'Method not allowed'}), 405
        
        # Get the JSON data from the request
        data = request.get_json(force=True)
        if not data or "description" not in data:
            return jsonify({"error": "Missing 'description' in request data"}), 400

        description = data.get("description")
        if not isinstance(description, str) or description.strip() == "":
            return jsonify({"error": "'description' must be a non-empty string"}), 400

        prediction_type = data.get("type", "single")

        if prediction_type == "top3":
            predictions = predict_top_3(description)
            response = jsonify({
                "type": "top3",
                "predictions": predictions
            })
        else:
            # Single prediction
            if model is None:
                return jsonify({"error": "Model not loaded"}), 500
            
            prediction = model.predict([description])
            predicted_category = prediction[0]
            response = jsonify({
                "type": "single",
                "prediction": predicted_category
            })
        
        # Add CORS headers
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        
        return response

    except Exception as e:
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

# For Vercel runtime
def main(request):
    return handler(request)

# For local testing
if __name__ == "__main__":
    from flask import Flask
    app = Flask(__name__)
    
    @app.route("/api/predict", methods=["POST", "OPTIONS"])
    def predict():
        return handler(request)
    
    app.run(debug=True, port=5001)
