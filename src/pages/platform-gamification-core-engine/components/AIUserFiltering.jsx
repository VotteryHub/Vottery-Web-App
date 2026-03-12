import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function AIUserFiltering() {
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    definition: '',
    confidence: 0.8
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const addCustomCategory = async () => {
    if (!newCategory?.name || !newCategory?.definition) return;

    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const category = {
      id: Date.now(),
      ...newCategory,
      matchedUsers: Math.floor(Math.random() * 10000),
      createdAt: new Date()?.toISOString()
    };

    setCustomCategories(prev => [...prev, category]);
    setNewCategory({ name: '', definition: '', confidence: 0.8 });
    setIsProcessing(false);
  };

  const deleteCategory = (id) => {
    setCustomCategories(prev => prev?.filter(c => c?.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Filtering Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Brain" className="w-8 h-8" />
          <h2 className="text-xl font-bold">AI-Powered User Filtering</h2>
        </div>
        <p className="text-purple-100">
          Leverage machine learning algorithms for custom category creation, behavioral pattern recognition,
          and dynamic segment generation with confidence scoring and automated refinement capabilities.
        </p>
      </div>

      {/* Create Custom Category */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Create Custom User Category
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={newCategory?.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e?.target?.value }))}
              placeholder="e.g., High-Value Engaged Users"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Natural Language Definition
            </label>
            <textarea
              value={newCategory?.definition}
              onChange={(e) => setNewCategory(prev => ({ ...prev, definition: e?.target?.value }))}
              placeholder="Describe the user segment in natural language. Example: 'Users who have voted in at least 10 elections in the last 30 days, have a streak of 7+ days, and have earned at least 3 badges'..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confidence Threshold: {(newCategory?.confidence * 100)?.toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={newCategory?.confidence}
              onChange={(e) => setNewCategory(prev => ({ ...prev, confidence: parseFloat(e?.target?.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Higher confidence means stricter matching criteria
            </p>
          </div>

          <button
            onClick={addCustomCategory}
            disabled={isProcessing || !newCategory?.name || !newCategory?.definition}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Icon name="Loader" className="w-5 h-5 animate-spin" />
                Processing with AI...
              </>
            ) : (
              <>
                <Icon name="Plus" className="w-5 h-5" />
                Create Category
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Custom Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Active Custom Categories ({customCategories?.length})
        </h3>
        {customCategories?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Users" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No custom categories created yet. Use AI to define your first segment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {customCategories?.map(category => (
              <div
                key={category?.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {category?.name}
                      </h4>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        {(category?.confidence * 100)?.toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {category?.definition}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <Icon name="Users" className="w-4 h-4" />
                        <span>{category?.matchedUsers?.toLocaleString()} users matched</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Created {new Date(category?.createdAt)?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCategory(category?.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Icon name="Trash2" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Behavioral Pattern Recognition */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Behavioral Pattern Recognition
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900 dark:text-white">High Engagement</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Users with consistent daily activity and high interaction rates
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">2,847 users</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Award" className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900 dark:text-white">Achievement Hunters</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Users actively pursuing badges and level progression
            </p>
            <p className="text-2xl font-bold text-green-600 mt-2">1,523 users</p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900 dark:text-white">Power Voters</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Users who participate in multiple elections daily
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-2">4,192 users</p>
          </div>
        </div>
      </div>
    </div>
  );
}