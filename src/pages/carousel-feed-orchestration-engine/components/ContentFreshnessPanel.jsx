import React from 'react';
import Icon from '../../../components/AppIcon';
import { Line, Bar } from 'react-chartjs-2';

const ContentFreshnessPanel = ({ data }) => {
  const freshnessDecayData = {
    labels: ['0h', '2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h', '24h'],
    datasets: [{
      label: 'Freshness Score',
      data: [100, 95, 90, 85, 78, 70, 60, 50, 40, 30, 20, 10, 5],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const contentLifecycleData = {
    labels: ['Fresh (0-6h)', 'Recent (6-12h)', 'Aging (12-18h)', 'Stale (18-24h)', 'Archived (24h+)'],
    datasets: [{
      label: 'Content Count',
      data: [450, 320, 180, 90, 40],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="Clock" size={24} className="text-green-500" />
          Content Freshness Scoring
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Time-Decay Algorithm</h3>
            <div className="h-[300px]">
              <Line data={freshnessDecayData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Content freshness decreases exponentially over 24 hours. Fresh content (0-6h) receives priority placement.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Content Lifecycle Distribution</h3>
            <div className="h-[300px]">
              <Bar data={contentLifecycleData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Real-time distribution of content across lifecycle stages with automated archival.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Sparkles" size={20} className="text-green-500" />
            <span className="text-xs font-medium text-green-600 bg-green-500/20 px-2 py-1 rounded">Fresh</span>
          </div>
          <p className="text-2xl font-bold text-foreground">450</p>
          <p className="text-sm text-muted-foreground">0-6 hours old</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 h-2 bg-green-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
            </div>
            <span className="text-xs font-semibold text-green-500">100%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={20} className="text-blue-500" />
            <span className="text-xs font-medium text-blue-600 bg-blue-500/20 px-2 py-1 rounded">Recent</span>
          </div>
          <p className="text-2xl font-bold text-foreground">320</p>
          <p className="text-sm text-muted-foreground">6-12 hours old</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 h-2 bg-blue-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
            </div>
            <span className="text-xs font-semibold text-blue-500">70%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertCircle" size={20} className="text-yellow-500" />
            <span className="text-xs font-medium text-yellow-600 bg-yellow-500/20 px-2 py-1 rounded">Aging</span>
          </div>
          <p className="text-2xl font-bold text-foreground">180</p>
          <p className="text-sm text-muted-foreground">12-18 hours old</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 h-2 bg-yellow-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '40%' }} />
            </div>
            <span className="text-xs font-semibold text-yellow-500">40%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-4 border border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Archive" size={20} className="text-red-500" />
            <span className="text-xs font-medium text-red-600 bg-red-500/20 px-2 py-1 rounded">Stale</span>
          </div>
          <p className="text-2xl font-bold text-foreground">90</p>
          <p className="text-sm text-muted-foreground">18-24 hours old</p>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '10%' }} />
            </div>
            <span className="text-xs font-semibold text-red-500">10%</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Real-Time Scoring Updates</h3>
        <div className="space-y-3">
          {[
            { title: 'Live Elections', time: '2 min ago', score: 98, trend: 'up' },
            { title: 'Trending Jolts', time: '5 min ago', score: 95, trend: 'up' },
            { title: 'New Moments', time: '12 min ago', score: 89, trend: 'stable' },
            { title: 'Creator Spotlights', time: '28 min ago', score: 76, trend: 'down' }
          ]?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="FileText" size={20} className="text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item?.title}</p>
                  <p className="text-xs text-muted-foreground">{item?.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{item?.score}%</p>
                  <p className="text-xs text-muted-foreground">Freshness</p>
                </div>
                <Icon 
                  name={item?.trend === 'up' ? 'TrendingUp' : item?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                  size={18} 
                  className={item?.trend === 'up' ? 'text-green-500' : item?.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentFreshnessPanel;