import React from 'react';
import Icon from '../../../components/AppIcon';
import { Radar, Bar } from 'react-chartjs-2';

const ZoneOptimizationPanel = ({ data, timeRange }) => {
  const optimizationScoresData = {
    labels: Object.values(data?.payouts || {})?.map(z => z?.name),
    datasets: [{
      label: 'Optimization Score',
      data: Object.values(data?.payouts || {})?.map(z => parseFloat(z?.optimizationScore)),
      backgroundColor: 'rgba(255, 215, 0, 0.2)',
      borderColor: 'rgb(255, 215, 0)',
      borderWidth: 2
    }]
  };

  const recommendationsData = {
    labels: (data?.optimization || [])?.map(r => r?.zone),
    datasets: [{
      label: 'Optimization Score',
      data: (data?.optimization || [])?.map(r => r?.score),
      backgroundColor: (data?.optimization || [])?.map(r => 
        r?.priority === 'high' ? 'rgba(239, 68, 68, 0.8)' :
        r?.priority === 'medium' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(34, 197, 94, 0.8)'
      )
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="Sparkles" size={24} className="text-purple-500" />
          Zone-Specific Optimization Recommendations
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Optimization Scores by Zone</h3>
            <div className="h-[300px]">
              <Radar data={optimizationScoresData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Priority Recommendations</h3>
            <div className="h-[300px]">
              <Bar data={recommendationsData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">AI-Powered Optimization Recommendations</h3>
        <div className="space-y-3">
          {(data?.optimization || [])?.map((rec, index) => (
            <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border ${
              rec?.priority === 'high' ? 'bg-red-500/10 border-red-500/20' :
              rec?.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20'
            }`}>
              <Icon 
                name={rec?.priority === 'high' ? 'AlertCircle' : rec?.priority === 'medium' ? 'Info' : 'CheckCircle'} 
                size={20} 
                className={rec?.priority === 'high' ? 'text-red-500 mt-0.5' : rec?.priority === 'medium' ? 'text-yellow-500 mt-0.5' : 'text-green-500 mt-0.5'} 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{rec?.zone}</p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded ${
                    rec?.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                    rec?.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                  }`}>
                    {rec?.priority?.toUpperCase()} PRIORITY
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec?.recommendation}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Target" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Score: <span className="font-semibold text-foreground">{rec?.score}%</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Action: <span className="font-semibold text-foreground">{rec?.action?.replace('_', ' ')}</span></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Optimization Impact Forecast</h3>
          <div className="space-y-3">
            {[
              { zone: 'India (Zone 4)', impact: '+$12,450', timeframe: '30 days', confidence: '92%' },
              { zone: 'Latin America (Zone 5)', impact: '+$8,230', timeframe: '30 days', confidence: '88%' },
              { zone: 'Africa (Zone 6)', impact: '+$6,780', timeframe: '30 days', confidence: '85%' }
            ]?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item?.zone}</p>
                  <p className="text-xs text-muted-foreground">{item?.timeframe}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-500">{item?.impact}</p>
                  <p className="text-xs text-muted-foreground">Confidence: {item?.confidence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { action: 'Increase Zone 4 Targeting', status: 'Recommended' },
              { action: 'Adjust Zone 2 Spend', status: 'Optional' },
              { action: 'Expand Zone 7 Coverage', status: 'Recommended' },
              { action: 'Review Zone 6 Strategy', status: 'Required' }
            ]?.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-3 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon name="Zap" size={18} className="text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">{item?.action}</span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded ${
                  item?.status === 'Required' ? 'bg-red-500/20 text-red-500' :
                  item?.status === 'Recommended' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {item?.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneOptimizationPanel;