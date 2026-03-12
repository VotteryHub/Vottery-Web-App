import React from 'react';
import Icon from '../../../components/AppIcon';

const StrategicInsightsPanel = ({ intelligence }) => {
  return (
    <div className="space-y-6">
      {/* Key Findings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} />
          Key Strategic Findings
        </h3>
        <div className="space-y-4">
          {[
            {
              title: 'Cross-System Threat Correlation',
              description: 'Perplexity and Claude analysis converge on coordinated attack patterns affecting financial and user behavior domains',
              aiServices: ['Perplexity', 'Claude'],
              confidence: 94,
            },
            {
              title: 'Dispute Resolution Optimization',
              description: 'Claude reasoning patterns show 88% accuracy in policy violation decisions with minimal bias detection',
              aiServices: ['Claude', 'Platform'],
              confidence: 88,
            },
            {
              title: 'Semantic Matching Enhancement',
              description: 'OpenAI semantic analysis identifies content recommendation improvements with 82% user satisfaction correlation',
              aiServices: ['OpenAI', 'Platform'],
              confidence: 82,
            },
          ]?.map((finding, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{finding?.title}</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{finding?.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {finding?.aiServices?.map((service, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-1 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Confidence:</span>
                  <span className="text-xs font-semibold text-primary">{finding?.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Strategic Recommendations</h3>
        <div className="space-y-3">
          {[
            {
              category: 'Threat Mitigation',
              recommendation: 'Deploy enhanced Perplexity threat monitoring in Zone 3 with real-time Claude decision support',
              impact: 'High',
              timeline: 'Immediate',
            },
            {
              category: 'Compliance Enhancement',
              recommendation: 'Integrate Claude policy reasoning into automated compliance workflows for 3 new jurisdictions',
              impact: 'Medium',
              timeline: '30 days',
            },
            {
              category: 'Performance Optimization',
              recommendation: 'Leverage OpenAI semantic matching to improve content distribution accuracy by 15%',
              impact: 'High',
              timeline: '60 days',
            },
          ]?.map((rec, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {rec?.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Timeline: {rec?.timeline}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{rec?.recommendation}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-3 ${
                  rec?.impact === 'High' ?'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {rec?.impact} Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrategicInsightsPanel;