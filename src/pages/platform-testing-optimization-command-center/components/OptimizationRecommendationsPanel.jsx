import React from 'react';
import Icon from '../../../components/AppIcon';

const OptimizationRecommendationsPanel = ({ recommendations, onRefresh }) => {
  if (!recommendations || recommendations?.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
        <p className="text-muted-foreground">No optimization recommendations at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recommendations?.map((category, index) => (
        <div key={index} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Lightbulb" size={20} className="text-primary" />
              {category?.category}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              category?.priority === 'critical' ? 'bg-red-100 text-red-700' :
              category?.priority === 'high'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
            }`}>
              {category?.priority} priority
            </span>
          </div>
          <ul className="space-y-2">
            {category?.recommendations?.map((rec, recIndex) => (
              <li key={recIndex} className="flex items-start gap-2 text-sm text-foreground">
                <Icon name="CheckCircle" size={16} className="text-green-500 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OptimizationRecommendationsPanel;