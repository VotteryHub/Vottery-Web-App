import React from 'react';
import Icon from '../../../components/AppIcon';
import { Line, Bar } from 'react-chartjs-2';

const SponsorshipPerformancePanel = ({ data, timeRange }) => {
  const cpmTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'CPM ($)',
      data: [0.12, 0.14, 0.13, parseFloat(data?.sponsorship?.cpm || 0.15)],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const engagementRatesData = {
    labels: ['Horizontal', 'Vertical', 'Gradient'],
    datasets: [{
      label: 'Engagement Rate (%)',
      data: [27.3, 23.8, 22.1],
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="TrendingUp" size={24} className="text-blue-500" />
          Sponsorship Performance Metrics
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">CPM Trend Analysis</h3>
            <div className="h-[300px]">
              <Line data={cpmTrendData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Rates by Carousel</h3>
            <div className="h-[300px]">
              <Bar data={engagementRatesData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
          <Icon name="Eye" size={24} className="text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{(data?.sponsorship?.totalImpressions || 0)?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Impressions</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
          <Icon name="MousePointer" size={24} className="text-green-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{(data?.sponsorship?.totalClicks || 0)?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Clicks</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
          <Icon name="DollarSign" size={24} className="text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">${data?.sponsorship?.cpm || '0.00'}</p>
          <p className="text-sm text-muted-foreground">CPM</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
          <Icon name="Target" size={24} className="text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{data?.sponsorship?.ctr || '0.00'}%</p>
          <p className="text-sm text-muted-foreground">CTR</p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Comparative Performance Benchmarking</h3>
        <div className="space-y-3">
          {[
            { carousel: 'Horizontal Snap', cpm: '$0.15', cpc: '$0.45', ctr: '3.2%', conversions: 1240, benchmark: 'Above Average' },
            { carousel: 'Vertical Stack', cpm: '$0.12', cpc: '$0.38', ctr: '2.8%', conversions: 980, benchmark: 'Average' },
            { carousel: 'Gradient Flow', cpm: '$0.10', cpc: '$0.32', ctr: '2.5%', conversions: 850, benchmark: 'Average' }
          ]?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="LayoutGrid" size={20} className="text-yellow-500" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item?.carousel}</p>
                  <p className="text-xs text-muted-foreground">{item?.conversions} conversions</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">CPM</p>
                  <p className="text-sm font-bold text-foreground">{item?.cpm}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">CPC</p>
                  <p className="text-sm font-bold text-foreground">{item?.cpc}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <p className="text-sm font-bold text-foreground">{item?.ctr}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded ${
                  item?.benchmark === 'Above Average' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {item?.benchmark}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Tracking</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
            <Icon name="CheckCircle" size={20} className="text-green-500 mb-2" />
            <p className="text-2xl font-bold text-foreground">{data?.sponsorship?.conversionRate || '0.00'}%</p>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
            <Icon name="Users" size={20} className="text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-foreground">3,070</p>
            <p className="text-sm text-muted-foreground">Total Conversions</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <Icon name="DollarSign" size={20} className="text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-foreground">${data?.sponsorship?.cpc || '0.00'}</p>
            <p className="text-sm text-muted-foreground">Cost Per Click</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipPerformancePanel;