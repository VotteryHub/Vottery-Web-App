import React from 'react';
import Icon from '../../../components/AppIcon';
import { Line, Bar } from 'react-chartjs-2';

const SponsorshipROIPanel = ({ data, timeRange }) => {
  const conversionFunnelData = {
    labels: ['Impressions', 'Clicks', 'Engagements', 'Conversions', 'Revenue'],
    datasets: [{
      label: 'Funnel Metrics',
      data: [
        data?.roi?.conversionFunnel?.impressions || 0,
        data?.roi?.conversionFunnel?.clicks || 0,
        data?.roi?.conversionFunnel?.engagements || 0,
        data?.roi?.conversionFunnel?.conversions || 0,
        (data?.roi?.conversionFunnel?.revenue || 0) / 10
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(147, 51, 234, 0.8)'
      ]
    }]
  };

  const ltvTrendData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [{
      label: 'Lifetime Value ($)',
      data: [45, 78, 112, 156, 198, parseFloat(data?.roi?.ltv || 245)],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="Target" size={24} className="text-green-500" />
          Sponsorship ROI Tracking with Conversion Funnels
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Funnel</h3>
            <div className="h-[300px]">
              <Bar data={conversionFunnelData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Advertiser Lifetime Value</h3>
            <div className="h-[300px]">
              <Line data={ltvTrendData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
          <Icon name="TrendingUp" size={24} className="text-green-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{data?.roi?.roi || '0'}%</p>
          <p className="text-sm text-muted-foreground">Overall ROI</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
            <Icon name="ArrowUp" size={12} />
            <span>+8.3% vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
          <Icon name="DollarSign" size={24} className="text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">${data?.roi?.ltv || '0.00'}</p>
          <p className="text-sm text-muted-foreground">Advertiser LTV</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-blue-500">
            <Icon name="Info" size={12} />
            <span>Per conversion</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
          <Icon name="Target" size={24} className="text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{data?.roi?.campaignEffectiveness || '0.000'}%</p>
          <p className="text-sm text-muted-foreground">Campaign Effectiveness</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-purple-500">
            <Icon name="CheckCircle" size={12} />
            <span>Above benchmark</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
          <Icon name="Users" size={24} className="text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-foreground">{data?.roi?.conversionFunnel?.conversions || 0}</p>
          <p className="text-sm text-muted-foreground">Total Conversions</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
            <Icon name="TrendingUp" size={12} />
            <span>+12.7% vs last period</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Funnel Stage Analysis</h3>
        <div className="space-y-3">
          {[
            { stage: 'Impressions', count: data?.roi?.conversionFunnel?.impressions || 0, rate: '100%', dropoff: '0%' },
            { stage: 'Clicks', count: data?.roi?.conversionFunnel?.clicks || 0, rate: '3.2%', dropoff: '96.8%' },
            { stage: 'Engagements', count: data?.roi?.conversionFunnel?.engagements || 0, rate: '1.9%', dropoff: '40.6%' },
            { stage: 'Conversions', count: data?.roi?.conversionFunnel?.conversions || 0, rate: '0.29%', dropoff: '84.9%' }
          ]?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-blue-500/20' :
                  index === 1 ? 'bg-green-500/20' :
                  index === 2 ? 'bg-yellow-500/20' : 'bg-pink-500/20'
                }`}>
                  <span className="text-sm font-bold text-foreground">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item?.stage}</p>
                  <p className="text-xs text-muted-foreground">Conversion Rate: {item?.rate}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Count</p>
                  <p className="text-sm font-bold text-foreground">{item?.count?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Drop-off</p>
                  <p className="text-sm font-bold text-red-500">{item?.dropoff}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Effectiveness Scoring</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
            <Icon name="Award" size={20} className="text-green-500 mb-2" />
            <p className="text-xl font-bold text-foreground">A+</p>
            <p className="text-xs text-muted-foreground">Overall Grade</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
            <Icon name="Target" size={20} className="text-blue-500 mb-2" />
            <p className="text-xl font-bold text-foreground">95%</p>
            <p className="text-xs text-muted-foreground">Target Achievement</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <Icon name="Zap" size={20} className="text-purple-500 mb-2" />
            <p className="text-xl font-bold text-foreground">High</p>
            <p className="text-xs text-muted-foreground">Performance Level</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipROIPanel;