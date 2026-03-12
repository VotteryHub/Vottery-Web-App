import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import { intelligentOptimizationService } from '../services/intelligentOptimizationService';
import { useAuth } from '../contexts/AuthContext';

const OptimizationSuggestionOverlay = ({ screenName, screenData, performanceMetrics }) => {
  const { userProfile } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [visible, setVisible] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ bottom: 20, right: 20 });

  useEffect(() => {
    if (visible && !minimized) {
      loadSuggestions();
    }
  }, [screenName, visible]);

  useEffect(() => {
    if (suggestions?.length > 0 && !currentSuggestion) {
      setCurrentSuggestion(suggestions?.[0]);
    }
  }, [suggestions]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const screenContext = {
        screenName,
        userRole: userProfile?.role || 'admin',
        currentData: screenData || {},
        recentActivity: {
          lastAction: 'Screen viewed',
          timestamp: new Date()?.toISOString()
        },
        performanceMetrics: performanceMetrics || {
          loadTime: 0,
          apiLatency: 0
        }
      };

      const { data, error } = await intelligentOptimizationService?.generateOptimizationSuggestions(screenContext);
      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Load suggestions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!currentSuggestion) return;
    
    setApproving(true);
    try {
      const { data, error } = await intelligentOptimizationService?.executeOneClickApproval(
        currentSuggestion,
        userProfile?.id
      );
      
      if (error) throw error;
      
      // Show success and move to next suggestion
      const remainingSuggestions = suggestions?.filter(s => s?.id !== currentSuggestion?.id);
      setSuggestions(remainingSuggestions);
      setCurrentSuggestion(remainingSuggestions?.[0] || null);
    } catch (error) {
      console.error('Approval error:', error);
    } finally {
      setApproving(false);
    }
  };

  const handleDismiss = async () => {
    if (!currentSuggestion) return;
    
    try {
      await intelligentOptimizationService?.dismissSuggestion(
        currentSuggestion?.id,
        userProfile?.id,
        'User dismissed'
      );
      
      const remainingSuggestions = suggestions?.filter(s => s?.id !== currentSuggestion?.id);
      setSuggestions(remainingSuggestions);
      setCurrentSuggestion(remainingSuggestions?.[0] || null);
    } catch (error) {
      console.error('Dismiss error:', error);
    }
  };

  const handleNext = () => {
    const currentIndex = suggestions?.findIndex(s => s?.id === currentSuggestion?.id);
    if (currentIndex < suggestions?.length - 1) {
      setCurrentSuggestion(suggestions?.[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = suggestions?.findIndex(s => s?.id === currentSuggestion?.id);
    if (currentIndex > 0) {
      setCurrentSuggestion(suggestions?.[currentIndex - 1]);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      performance: 'Zap',
      revenue: 'DollarSign',
      engagement: 'Users',
      security: 'Shield',
      efficiency: 'TrendingUp'
    };
    return icons?.[category] || 'Lightbulb';
  };

  if (!visible || !currentSuggestion) return null;

  if (minimized) {
    return (
      <div
        className="fixed z-50 cursor-pointer"
        style={{ bottom: `${position?.bottom}px`, right: `${position?.right}px` }}
        onClick={() => setMinimized(false)}
      >
        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center animate-pulse">
          <Icon name="Sparkles" size={24} className="text-white" />
          {suggestions?.length > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {suggestions?.length}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-purple-500 w-96 max-h-[600px] overflow-hidden"
      style={{ bottom: `${position?.bottom}px`, right: `${position?.right}px` }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">AI Optimization</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimized(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Icon name="Minimize2" size={16} />
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-white/90 text-xs">
          <span>{suggestions?.length} suggestion{suggestions?.length !== 1 ? 's' : ''} available</span>
          <button
            onClick={loadSuggestions}
            disabled={loading}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Icon name="RefreshCw" size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : (
          <>
            {/* Priority Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(currentSuggestion?.priority)}`} />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                {currentSuggestion?.priority} Priority
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">•</span>
              <div className="flex items-center gap-1">
                <Icon name={getCategoryIcon(currentSuggestion?.category)} size={12} className="text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {currentSuggestion?.category}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
              {currentSuggestion?.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {currentSuggestion?.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon name="TrendingUp" size={14} className="text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs font-bold text-green-600 dark:text-green-400">
                  +{currentSuggestion?.expectedImpact}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Impact</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon name="Target" size={14} className="text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {currentSuggestion?.confidenceScore}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Confidence</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon name="Clock" size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {currentSuggestion?.estimatedTime}m
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
              </div>
            </div>

            {/* Implementation Steps */}
            {currentSuggestion?.implementationSteps?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1">
                  <Icon name="List" size={12} />
                  Steps
                </h4>
                <ol className="space-y-1">
                  {currentSuggestion?.implementationSteps?.slice(0, 3)?.map((step, index) => (
                    <li key={index} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                  {currentSuggestion?.implementationSteps?.length > 3 && (
                    <li className="text-xs text-gray-500 dark:text-gray-400 italic">
                      +{currentSuggestion?.implementationSteps?.length - 3} more steps...
                    </li>
                  )}
                </ol>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 mb-3">
          <Button
            onClick={handleApprove}
            disabled={approving || loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm py-2"
          >
            {approving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Executing...
              </>
            ) : (
              <>
                <Icon name="Zap" size={14} />
                1-Click Approve
              </>
            )}
          </Button>
          <button
            onClick={handleDismiss}
            disabled={approving || loading}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon name="X" size={14} />
          </button>
        </div>
        
        {/* Navigation */}
        {suggestions?.length > 1 && (
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <button
              onClick={handlePrevious}
              disabled={suggestions?.findIndex(s => s?.id === currentSuggestion?.id) === 0}
              className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronLeft" size={12} />
              Previous
            </button>
            <span>
              {suggestions?.findIndex(s => s?.id === currentSuggestion?.id) + 1} / {suggestions?.length}
            </span>
            <button
              onClick={handleNext}
              disabled={suggestions?.findIndex(s => s?.id === currentSuggestion?.id) === suggestions?.length - 1}
              className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <Icon name="ChevronRight" size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizationSuggestionOverlay;