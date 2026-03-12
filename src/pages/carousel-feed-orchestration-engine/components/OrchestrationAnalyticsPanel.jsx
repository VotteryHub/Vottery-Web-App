import React from 'react';
import Icon from '../../../components/AppIcon';
import { Line, Bar } from 'react-chartjs-2';

const OrchestrationAnalyticsPanel = ({ data }) => {
  const performanceTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Engagement Rate',
        data: [85, 88, 92, 89, 94, 91, 96],
        borderColor: 'rgb(255, 215, 0)',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Content Freshness',
        data: [78, 82, 85, 83, 88, 86, 90],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const carouselDistributionData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [{
      label: 'Carousels Served',
      data: [120, 80, 250, 380, 420, 350, 180],
      backgroundColor: 'rgba(236, 72, 153, 0.8)'
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="BarChart3" size={24} className="text-blue-500" />
          Orchestration Analytics
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Performance Trends (7 Days)</h3>
            <div className="h-[300px]">
              <Line data={performanceTrendData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Carousel Distribution (24h)</h3>
            <div className="h-[300px]">
              <Bar data={carouselDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
          <Icon name="TrendingUp" size={24} className="text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">92.3%</p>
          <p className="text-sm text-muted-foreground">Avg Engagement Rate</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
            <Icon name="ArrowUp" size={12} />
            <span>+5.2% vs last week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
          <Icon name="Clock" size={24} className="text-green-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">85.7%</p>
          <p className="text-sm text-muted-foreground">Content Freshness</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
            <Icon name="ArrowUp" size={12} />
            <span>+3.1% vs last week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
          <Icon name="Zap" size={24} className="text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">1.2K</p>
          <p className="text-sm text-muted-foreground">Carousels/Hour</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
            <Icon name="ArrowUp" size={12} />
            <span>+8.7% vs last week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
          <Icon name="Target" size={24} className="text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">98.5%</p>
          <p className="text-sm text-muted-foreground">Pattern Compliance</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
            <Icon name="ArrowUp" size={12} />
            <span>+1.3% vs last week</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Optimization Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Optimal Performance Detected</p>
              <p className="text-xs text-muted-foreground mt-1">Horizontal Snap carousel showing 15% higher engagement during 12-4 PM. Consider increasing allocation.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <Icon name="AlertCircle" size={20} className="text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Content Freshness Alert</p>
              <p className="text-xs text-muted-foreground mt-1">Gradient Flow carousel has 12% stale content. Recommend increasing refresh rate.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Icon name="Info" size={20} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Pattern Optimization Opportunity</p>
              <p className="text-xs text-muted-foreground mt-1">Users in Zone 4 (India) respond better to 4:1 post-to-carousel ratio. Consider A/B testing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationAnalyticsPanel;