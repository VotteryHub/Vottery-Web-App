import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { feedRankingService } from '../../../services/feedRankingService';

const SemanticMatchingPanel = ({ userPreferences, generating }) => {
  const [testText1, setTestText1] = useState('');
  const [testText2, setTestText2] = useState('');
  const [similarity, setSimilarity] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTestSimilarity = async () => {
    if (!testText1 || !testText2) return;

    setTesting(true);
    try {
      const { data, error } = await feedRankingService?.calculateSemanticSimilarity(testText1, testText2);
      if (error) throw new Error(error?.message);
      setSimilarity(data);
    } catch (err) {
      console.error('Similarity test failed:', err);
    } finally {
      setTesting(false);
    }
  };

  const topPreferences = userPreferences?.slice(0, 5);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
          <Icon name="Sparkles" size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-foreground">OpenAI Semantic Matching</h2>
          <p className="text-sm text-muted-foreground">AI-powered content similarity analysis</p>
        </div>
      </div>
      {/* User Preference Context */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">User Interest Profile</h3>
        <div className="space-y-2">
          {topPreferences?.map((pref) => (
            <div
              key={pref?.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Icon name={pref?.topicCategories?.iconName || 'Star'} size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {pref?.topicCategories?.displayName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70"
                    style={{ width: `${((pref?.preferenceScore + 1) / 2) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {pref?.preferenceScore?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {topPreferences?.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <Icon name="AlertCircle" size={24} className="mx-auto mb-2 opacity-50" />
            <p>No user preferences found. Complete topic preference collection first.</p>
          </div>
        )}
      </div>
      {/* Semantic Similarity Tester */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Test Semantic Similarity</h3>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Text 1</label>
            <input
              type="text"
              value={testText1}
              onChange={(e) => setTestText1(e?.target?.value)}
              placeholder="Enter first text..."
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Text 2</label>
            <input
              type="text"
              value={testText2}
              onChange={(e) => setTestText2(e?.target?.value)}
              placeholder="Enter second text..."
              className="input w-full"
            />
          </div>
        </div>

        <button
          onClick={handleTestSimilarity}
          disabled={!testText1 || !testText2 || testing}
          className="btn btn-primary w-full mb-4"
        >
          {testing ? (
            <>
              <Icon name="Loader" size={18} className="animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Icon name="Zap" size={18} />
              Calculate Similarity
            </>
          )}
        </button>

        {similarity !== null && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {(similarity * 100)?.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mb-3">Semantic Similarity Score</div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  style={{ width: `${similarity * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} className="mt-0.5" />
          <span>
            Uses OpenAI text-embedding-3-small model for semantic analysis and cosine similarity calculation
          </span>
        </div>
      </div>
    </div>
  );
};

export default SemanticMatchingPanel;