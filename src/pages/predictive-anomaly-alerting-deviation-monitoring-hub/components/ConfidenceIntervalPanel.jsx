import React from 'react';
import { Activity, TrendingUp, Target, BarChart3 } from 'lucide-react';

const ConfidenceIntervalPanel = () => {
  const confidenceData = [
    {
      id: 1,
      metric: 'Revenue Forecast',
      predicted: 42000,
      lowerBound: 37800,
      upperBound: 46200,
      actual: 45230,
      confidenceLevel: 95,
      withinInterval: true
    },
    {
      id: 2,
      metric: 'User Engagement',
      predicted: 10450,
      lowerBound: 9405,
      upperBound: 11495,
      actual: 8920,
      confidenceLevel: 95,
      withinInterval: false
    },
    {
      id: 3,
      metric: 'Campaign CTR',
      predicted: 10.5,
      lowerBound: 9.45,
      upperBound: 11.55,
      actual: 12.3,
      confidenceLevel: 95,
      withinInterval: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-600" />
          Confidence Interval Monitoring
        </h2>
        <p className="text-gray-600 mb-6">Statistical boundaries, prediction accuracy tracking, and model performance analytics with continuous learning optimization</p>

        <div className="space-y-6">
          {confidenceData?.map((item) => (
            <div key={item?.id} className="border-2 border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item?.metric}</h3>
                  <p className="text-sm text-gray-600">Confidence Level: {item?.confidenceLevel}%</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item?.withinInterval ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item?.withinInterval ? 'Within Interval' : 'Outside Interval'}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Lower Bound: {item?.lowerBound?.toLocaleString()}</span>
                  <span>Predicted: {item?.predicted?.toLocaleString()}</span>
                  <span>Upper Bound: {item?.upperBound?.toLocaleString()}</span>
                </div>
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-300"
                    style={{
                      left: '0%',
                      width: '100%'
                    }}
                  ></div>
                  <div
                    className="absolute h-full w-1 bg-blue-600"
                    style={{
                      left: '50%'
                    }}
                  ></div>
                  <div
                    className={`absolute h-full w-2 ${
                      item?.withinInterval ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{
                      left: `${((item?.actual - item?.lowerBound) / (item?.upperBound - item?.lowerBound)) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex items-center justify-center mt-2">
                  <span className={`text-sm font-semibold ${
                    item?.withinInterval ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Actual: {item?.actual?.toLocaleString()}
                  </span>
                </div>
              </div>

              {!item?.withinInterval && (
                <div className="bg-red-50 border-l-4 border-red-600 p-3">
                  <p className="text-sm text-red-800 font-semibold">
                    ⚠️ Actual value falls outside {item?.confidenceLevel}% confidence interval - Alert triggered
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Prediction Accuracy</h3>
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">91.8%</p>
          <p className="text-sm text-gray-600">Within confidence intervals</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Model Performance</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">94.3%</p>
          <p className="text-sm text-gray-600">Overall accuracy rate</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Continuous Learning</h3>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">Daily</p>
          <p className="text-sm text-gray-600">Model optimization</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Boundaries Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Default confidence level</span>
              <span className="text-blue-600 font-semibold">95%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Standard deviation multiplier</span>
              <span className="text-blue-600 font-semibold">1.96</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Interval calculation method</span>
              <span className="text-blue-600 font-semibold">Parametric</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Predictions within bounds</span>
              <span className="text-green-600 font-semibold">1,145</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-900">Predictions outside bounds</span>
              <span className="text-red-600 font-semibold">102</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">Total predictions analyzed</span>
              <span className="text-gray-900 font-semibold">1,247</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceIntervalPanel;