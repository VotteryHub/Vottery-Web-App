import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FeedCompositionPanel = ({ feedRankings, onGenerate, generating }) => {
  const [contentMix, setContentMix] = useState({
    elections: 6,
    posts: 2,
    ads: 2
  });

  const totalItems = contentMix?.elections + contentMix?.posts + contentMix?.ads;

  const handleGenerate = () => {
    onGenerate?.(contentMix);
  };

  const handleMixChange = (type, value) => {
    setContentMix((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(20, parseInt(value) || 0))
    }));
  };

  const contentTypes = [
    { key: 'elections', label: 'Elections', icon: 'Vote', color: 'bg-blue-500' },
    { key: 'posts', label: 'Posts', icon: 'FileText', color: 'bg-green-500' },
    { key: 'ads', label: 'Ads', icon: 'Megaphone', color: 'bg-orange-500' }
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <Icon name="Layers" size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-foreground">Feed Composition</h2>
          <p className="text-sm text-muted-foreground">Configure content mix and generate rankings</p>
        </div>
      </div>
      {/* Content Mix Controls */}
      <div className="space-y-4 mb-6">
        {contentTypes?.map((type) => {
          const percentage = totalItems > 0 ? ((contentMix?.[type?.key] / totalItems) * 100)?.toFixed(0) : 0;

          return (
            <div key={type?.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name={type?.icon} size={18} className="text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">{type?.label}</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={contentMix?.[type?.key]}
                    onChange={(e) => handleMixChange(type?.key, e?.target?.value)}
                    className="input w-16 text-center"
                  />
                  <span className="text-sm text-muted-foreground w-12">({percentage}%)</span>
                </div>
              </div>
              <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${type?.color} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Total Items */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Total Feed Items</span>
          <span className="text-2xl font-bold text-primary">{totalItems}</span>
        </div>
      </div>
      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating || totalItems === 0}
        className="btn btn-primary w-full mb-4"
      >
        {generating ? (
          <>
            <Icon name="Loader" size={18} className="animate-spin" />
            Generating Rankings...
          </>
        ) : (
          <>
            <Icon name="Sparkles" size={18} />
            Generate Feed Rankings
          </>
        )}
      </button>
      {/* Current Rankings Preview */}
      {feedRankings?.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Top Ranked Items</h3>
          <div className="space-y-2">
            {feedRankings?.slice(0, 5)?.map((ranking, index) => (
              <div
                key={ranking?.id || index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </div>
                  <Icon
                    name={
                      ranking?.contentItemType === 'election' ?'Vote'
                        : ranking?.contentItemType === 'post' ?'FileText' :'Megaphone'
                    }
                    size={16}
                    className="text-muted-foreground"
                  />
                  <span className="text-sm text-foreground capitalize">{ranking?.contentItemType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold text-foreground">
                    {ranking?.rankingScore?.toFixed(3)}
                  </div>
                  <Icon name="Star" size={14} className="text-yellow-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} className="mt-0.5" />
          <span>
            Rankings combine user preferences, swipe history, semantic matching, and freshness factors
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedCompositionPanel;