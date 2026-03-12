import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { feedbackService } from '../../../services/feedbackService';

const SubmitRequestPanel = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'elections', label: 'Elections & Voting', icon: 'Vote' },
    { value: 'analytics', label: 'Analytics & Reporting', icon: 'BarChart' },
    { value: 'payments', label: 'Payments & Financial', icon: 'DollarSign' },
    { value: 'security', label: 'Security & Compliance', icon: 'Shield' },
    { value: 'ai', label: 'AI & Intelligence', icon: 'Cpu' },
    { value: 'communication', label: 'Communication', icon: 'MessageSquare' },
    { value: 'gamification', label: 'Gamification', icon: 'Trophy' },
    { value: 'other', label: 'Other', icon: 'Package' }
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.title?.trim() || !formData?.description?.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await feedbackService?.createFeatureRequest(formData);
      
      if (error) throw error;

      setSuccess(true);
      setFormData({ title: '', description: '', category: 'other' });
      
      setTimeout(() => {
        setSuccess(false);
        onSubmitSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feature request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="Plus" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Submit Feature Request</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Have an idea to improve Vottery? Share your feature request with the community and help shape the platform's future.
        </p>
      </div>
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Icon name="CheckCircle" size={24} className="text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Feature request submitted successfully!</p>
              <p className="text-sm text-green-700 dark:text-green-300">The community can now vote on your idea.</p>
            </div>
          </div>
        </div>
      )}
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feature Title *
            </label>
            <input
              type="text"
              value={formData?.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e?.target?.value }))}
              placeholder="e.g., Add real-time collaboration for election creation"
              required
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData?.title?.length}/200 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories?.map((cat) => (
                <button
                  key={cat?.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat?.value }))}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    formData?.category === cat?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon name={cat?.icon} size={18} />
                  <span className="text-sm font-medium">{cat?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
              placeholder="Describe your feature request in detail. Include:
• What problem does it solve?
• How would it work?
• Who would benefit from it?
• Any examples or references?"
              required
              rows={8}
              maxLength={2000}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData?.description?.length}/2000 characters
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-2">Submission Guidelines:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Be specific and clear about what you're requesting</li>
                  <li>Search existing requests to avoid duplicates</li>
                  <li>Focus on the problem, not just the solution</li>
                  <li>Be respectful and constructive</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your request will be visible to the community immediately
            </p>
            <Button
              type="submit"
              disabled={submitting || !formData?.title?.trim() || !formData?.description?.trim()}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Icon name="Loader" size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} />
                  Submit Feature Request
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmitRequestPanel;