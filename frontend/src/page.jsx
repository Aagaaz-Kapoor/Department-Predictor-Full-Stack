import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, Brain, BarChart3 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000';

const DepartmentPredictor = () => {
  const [description, setDescription] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictionType, setPredictionType] = useState('single');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handlePredict = async () => {
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          type: predictionType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Training': 'bg-blue-100 text-blue-800 border-blue-200',
      'Planning': 'bg-purple-100 text-purple-800 border-purple-200',
      'Marketing & Sales': 'bg-green-100 text-green-800 border-green-200',
      'Finance': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'HR': 'bg-pink-100 text-pink-800 border-pink-200',
      'IT': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Operations': 'bg-red-100 text-red-800 border-red-200',
      'Logistics': 'bg-orange-100 text-orange-800 border-orange-200',
      'Miscellaneous': 'bg-gray-100 text-gray-800 border-gray-200',
      'Other': 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const sampleDescriptions = [
    "Bug fix in user authentication system",
    "Training session for new employees",
    "Marketing campaign for product launch",
    "Quarterly budget planning meeting",
    "Salary review and performance evaluation",
    "Server maintenance and backup",
    "Customer support ticket resolution",
    "Inventory management and stock update"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Brain className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Department Predictor</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter a work description and let AI predict the most suitable department
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              {/* Input Section */}
              <div className="mb-8">
                <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-4">
                  Work Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Bug fix in the payment processing system, Employee training session, Marketing campaign analysis..."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors duration-200 resize-none"
                    rows="4"
                    disabled={loading}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                    {description.length} characters
                  </div>
                </div>
              </div>

              {/* Prediction Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Prediction Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="single"
                      checked={predictionType === 'single'}
                      onChange={(e) => setPredictionType(e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      disabled={loading}
                    />
                    <span className="ml-2 text-gray-700">Best Match</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="top3"
                      checked={predictionType === 'top3'}
                      onChange={(e) => setPredictionType(e.target.value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      disabled={loading}
                    />
                    <span className="ml-2 text-gray-700">Top 3 Matches</span>
                  </label>
                </div>
              </div>

              {/* Predict Button */}
              <button
                onClick={handlePredict}
                disabled={loading || !description.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Predict Department</span>
                  </>
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Results Display */}
              {prediction && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Prediction Results</h3>
                  </div>

                  {prediction.type === 'single' ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-3">Best Department Match:</p>
                      <span className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold border-2 ${getCategoryColor(prediction.prediction)}`}>
                        {prediction.prediction}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-4">Top 3 Department Matches:</p>
                      <div className="space-y-3">
                        {prediction.predictions.map((pred, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </span>
                              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getCategoryColor(pred.category)}`}>
                                {pred.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">
                                {(pred.probability * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sample Descriptions */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Try These Sample Descriptions
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {sampleDescriptions.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setDescription(sample)}
                  className="p-4 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                  disabled={loading}
                >
                  <p className="text-gray-700 text-sm leading-relaxed">{sample}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Available Categories */}
          {categories.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Available Departments
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <span
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentPredictor;