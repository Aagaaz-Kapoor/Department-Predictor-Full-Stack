# Department Predictor Full-Stack Application

A full-stack application that uses machine learning to predict the most suitable department for work descriptions.

## 🚀 Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Python serverless functions (Vercel Functions)
- **ML Model**: Scikit-learn pipeline with text vectorization
- **Deployment**: Vercel

## 📁 Project Structure

```
Department-Predictor-Full-Stack/
├── api/                          # Vercel serverless functions
│   ├── predict.py               # Main prediction endpoint
│   ├── categories.py            # Categories endpoint  
│   ├── health.py                # Health check endpoint
│   └── requirements.txt         # Python dependencies
├── models/                       # ML model files
│   ├── Meetings11.pkl           # Trained model (large file)
│   └── data.json                # Supporting data
├── src/                         # React source code
│   ├── App.js                   # Main App component
│   ├── page.jsx                 # Department Predictor component
│   └── ...                      # Other React files
├── public/                      # Static assets
├── package.json                 # Frontend dependencies
├── tailwind.config.js           # Tailwind configuration
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **For local API testing** (optional):
   ```bash
   python api/predict.py
   python api/categories.py
   python api/health.py
   ```

## 🚀 Deployment on Vercel

### Prerequisites
- Vercel account
- Node.js and npm installed
- Git repository

### Step-by-Step Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the application**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N` (for new deployment)
   - What's your project's name? `department-predictor`
   - In which directory is your code located? `./`

### Important Notes

#### Model File Size Issue
The ML model file (`Meetings11.pkl` - 228MB) exceeds Vercel's 50MB limit for serverless functions. Consider these solutions:

1. **Model Compression**:
   ```python
   # Reduce model size by using joblib compression
   import joblib
   joblib.dump(model, 'model_compressed.pkl', compress=3)
   ```

2. **External Storage**:
   - Upload model to AWS S3, Google Cloud Storage, or similar
   - Load model from external URL in the serverless function

3. **Model Optimization**:
   - Reduce vocabulary size in vectorizer
   - Use lighter algorithms (if accuracy permits)

### Environment Variables (Optional)

Set these in Vercel dashboard under Project Settings > Environment Variables:

- `NODE_ENV`: `production`
- `PYTHONPATH`: `/var/task/api:/var/task/models`

## 📡 API Endpoints

After deployment, your API will be available at:

- **Health Check**: `GET /api/health`
- **Categories**: `GET /api/categories`
- **Prediction**: `POST /api/predict`
  ```json
  {
    "description": "Bug fix in user authentication system",
    "type": "single" // or "top3"
  }
  ```

## 🔧 Configuration Files

- `vercel.json`: Deployment and routing configuration
- `package.json`: Frontend dependencies and build scripts
- `.env.production`: Production environment variables
- `tailwind.config.js`: Tailwind CSS configuration

## 🐛 Troubleshooting

1. **Build Failures**: Check that all dependencies are listed in `package.json`
2. **Function Timeouts**: Increase `maxDuration` in `vercel.json`
3. **CORS Issues**: Verify CORS headers in API functions
4. **Model Loading**: Ensure model path is correct in production

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
