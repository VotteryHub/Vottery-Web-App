import React from 'react';
import Icon from '../../../components/AppIcon';
import { Bar, Doughnut } from 'react-chartjs-2';

const RevenueOverviewPanel = ({ data, timeRange }) => {
  const revenueByTypeData = {
    labels: ['Jolts Revenue', 'Elections Sponsorship', 'Group Promotions'],
    datasets: [{
      label: 'Revenue ($)',
      data: [
        data?.revenue?.jolts?.revenue || 0,
        data?.revenue?.elections?.revenue || 0,
        data?.revenue?.groups?.revenue || 0
      ],
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ]
    }]
  };

  const revenueDistributionData = {
    labels: ['Jolts', 'Elections', 'Groups'],
    datasets: [{
      data: [
        data?.revenue?.jolts?.revenue || 0,
        data?.revenue?.elections?.revenue || 0,
        data?.revenue?.groups?.revenue || 0
      ],
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="DollarSign" size={24} className="text-green-500" />
          Revenue Analysis Per Content Type
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue by Content Type</h3>
            <div className="h-[300px]">
              <Bar data={revenueByTypeData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Distribution</h3>
            <div className="h-[300px]">
              <Doughnut data={revenueDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Jolts Video Monetization</h3>
            <Icon name="Video" size={20} className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-500 mb-2">${(data?.revenue?.jolts?.revenue || 0)?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Total Revenue</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Jolts</span>
              <span className="font-semibold text-foreground">{data?.revenue?.jolts?.count || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Revenue</span>
              <span className="font-semibold text-foreground">${(data?.revenue?.jolts?.avgRevenue || 0)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trend</span>
              <span className="font-semibold text-green-500 flex items-center gap-1">
                <Icon name="TrendingUp" size={14} />
                +12.5%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Elections Sponsorship</h3>
            <Icon name="Award" size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-500 mb-2">${(data?.revenue?.elections?.revenue || 0)?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Total Revenue</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sponsored Elections</span>
              <span className="font-semibold text-foreground">{data?.revenue?.elections?.count || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Revenue</span>
              <span className="font-semibold text-foreground">${(data?.revenue?.elections?.avgRevenue || 0)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trend</span>
              <span className="font-semibold text-green-500 flex items-center gap-1">
                <Icon name="TrendingUp" size={14} />
                +18.3%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Group Promotions</h3>
            <Icon name="Users" size={20} className="text-pink-500" />
          </div>
          <p className="text-3xl font-bold text-pink-500 mb-2">${(data?.revenue?.groups?.revenue || 0)?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Total Revenue</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Promoted Groups</span>
              <span className="font-semibold text-foreground">{data?.revenue?.groups?.count || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Revenue</span>
              <span className="font-semibold text-foreground">${(data?.revenue?.groups?.avgRevenue || 0)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trend</span>
              <span className="font-semibold text-green-500 flex items-center gap-1">
                <Icon name="TrendingUp" size={14} />
                +8.7%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Forecasting</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
            <Icon name="TrendingUp" size={20} className="text-green-500 mb-2" />
            <p className="text-xl font-bold text-foreground">${((data?.revenue?.total || 0) * 1.15)?.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Projected Next Month</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
            <Icon name="BarChart3" size={20} className="text-blue-500 mb-2" />
            <p className="text-xl font-bold text-foreground">+15%</p>
            <p className="text-xs text-muted-foreground">Growth Rate</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <Icon name="Target" size={20} className="text-purple-500 mb-2" />
            <p className="text-xl font-bold text-foreground">92%</p>
            <p className="text-xs text-muted-foreground">Target Achievement</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
            <Icon name="Zap" size={20} className="text-yellow-500 mb-2" />
            <p className="text-xl font-bold text-foreground">High</p>
            <p className="text-xs text-muted-foreground">Confidence Level</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverviewPanel;