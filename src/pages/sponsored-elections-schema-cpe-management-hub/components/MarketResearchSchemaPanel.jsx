import React from 'react';
import { Target, Users, BarChart3, FileText } from 'lucide-react';

const MarketResearchSchemaPanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Market Research Election Schema
        </h2>
        <p className="text-gray-600 mb-6">
          Survey-style elections that transform users into focus groups for real-time consumer insights
        </p>

        {/* Demographic Targeting */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Demographic Targeting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-medium text-gray-900 mb-2">Age Groups</div>
              <div className="space-y-2">
                {['18-24', '25-34', '35-44', '45-54', '55+']?.map((age) => (
                  <label key={age} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded text-purple-600" />
                    <span className="text-gray-700">{age} years</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-gray-900 mb-2">Interests</div>
              <div className="space-y-2">
                {['Technology', 'Fashion', 'Sports', 'Entertainment', 'Finance']?.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question Branching Logic */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Question Branching Logic
          </h3>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-green-300">
                <div className="font-medium text-gray-900">Q1: Which product do you prefer?</div>
                <div className="text-sm text-gray-600 mt-1">Options: Product A, Product B</div>
                <div className="text-xs text-green-600 mt-2">
                  → If "Product A" selected, show Q2a: "What feature do you like most?"
                </div>
                <div className="text-xs text-green-600">
                  → If "Product B" selected, show Q2b: "What improvements would you suggest?"
                </div>
              </div>
              <div className="p-3 bg-white rounded border border-green-300">
                <div className="font-medium text-gray-900">Q2a: What feature do you like most?</div>
                <div className="text-sm text-gray-600 mt-1">Options: Design, Price, Quality, Brand</div>
              </div>
              <div className="p-3 bg-white rounded border border-green-300">
                <div className="font-medium text-gray-900">Q2b: What improvements would you suggest?</div>
                <div className="text-sm text-gray-600 mt-1">Type: Open-ended text response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Collection Parameters */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Data Collection Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="font-medium text-gray-900 mb-2">Completion Incentives</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base XP Reward:</span>
                  <span className="font-medium text-orange-600">100 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus Multiplier:</span>
                  <span className="font-medium text-orange-600">2.5x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reward:</span>
                  <span className="font-medium text-orange-600">250 XP</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-gray-900 mb-2">Quality Scoring</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Response time tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Consistency checks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Attention validation</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-medium text-gray-900 mb-2">Data Export Format</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">CSV with demographics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">JSON with metadata</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Real-time API access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Use Case */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">💡 Example Use Case</h3>
          <p className="text-blue-100 mb-4">
            A fashion brand wants to test two sneaker colorways before production:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Create election: "Which colorway should we release: Neon Green or Cyber Black?"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Target: Ages 18-34, interested in Fashion & Streetwear</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Branching: Ask follow-up about price sensitivity based on choice</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Result: 10,000 votes in 24 hours with detailed demographic breakdown</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketResearchSchemaPanel;