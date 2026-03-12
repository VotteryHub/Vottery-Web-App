import React from 'react';
import Icon from '../../../components/AppIcon';
import { Bar, Line } from 'react-chartjs-2';

const CarouselMonetizationPanel = ({ data, timeRange }) => {
  const monetizationComparisonData = {
    labels: ['Horizontal Snap', 'Vertical Stack', 'Gradient Flow'],
    datasets: [{
      label: 'Revenue ($)',
      data: [
        data?.monetization?.horizontal?.revenue || 0,
        data?.monetization?.vertical?.revenue || 0,
        data?.monetization?.gradient?.revenue || 0
      ],
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ]
    }]
  };

  const roiTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Horizontal',
        data: [280, 310, 295, parseFloat(data?.monetization?.horizontal?.roi || 320)],
        borderColor: 'rgb(255, 215, 0)',
        tension: 0.4
      },
      {
        label: 'Vertical',
        data: [250, 270, 265, parseFloat(data?.monetization?.vertical?.roi || 280)],
        borderColor: 'rgb(236, 72, 153)',
        tension: 0.4
      },
      {
        label: 'Gradient',
        data: [220, 240, 235, parseFloat(data?.monetization?.gradient?.roi || 250)],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="BarChart3" size={24} className="text-yellow-500" />
          Carousel Monetization Comparison
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue by Carousel Type</h3>
            <div className="h-[300px]">
              <Bar data={monetizationComparisonData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">ROI Trend (4 Weeks)</h3>
            <div className="h-[300px]">
              <Line data={roiTrendData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Horizontal Snap</h3>
            <Icon name="ArrowRight" size={20} className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-500 mb-2">${(data?.monetization?.horizontal?.revenue || 0)?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Total Revenue</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Revenue Share</span>
              <span className="font-semibold text-foreground">{data?.monetization?.horizontal?.percentage || '0'}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ROI</span>
              <span className="font-semibold text-green-500">{data?.monetization?.horizontal?.roi || '0'}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Performance</span>
              <span className="font-semibold text-green-500 flex items-center gap-1">
                <Icon name="TrendingUp" size={14} />
                Excellent
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Vertical Stack</h3>
            <Icon name="ArrowUp" size={20} className="text-pink-500" />
          </div>
          <p className="text-3xl font-bold text-pink-500 mb-2">${(data?.monetization?.vertical?.revenue || 0)?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Total Revenue</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Revenue Share</span>
              <span className="font-semibold text-foreground">{data?.monetization?.vertical?.percentage || '0'}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ROI</span>
              <span className="font-semibold text-green-500">{data?.monetization?.vertical?.roi || '0'}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Performance</span>
              <span className="font-semibold text-blue-500 flex items-center gap-1">
                <Icon name="Minus" size={14} />
                Good
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Gradient Flow</h3>
            <Icon name="Waves" size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-500 mb-2">${(data?.monetization?.gradient?.revenue || 0)?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mb-4">Total Revenue</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Revenue Share</span>
              <span className="font-semibold text-foreground">{data?.monetization?.gradient?.percentage || '0'}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ROI</span>
              <span className="font-semibold text-green-500">{data?.monetization?.gradient?.roi || '0'}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Performance</span>
              <span className="font-semibold text-blue-500 flex items-center gap-1">
                <Icon name="Minus" size={14} />
                Good
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Attribution Modeling</h3>
        <div className="space-y-3">
          {[
            { source: 'Direct Carousel Clicks', revenue: '$45,230', attribution: '42%', model: 'Last Click' },
            { source: 'Assisted Conversions', revenue: '$28,450', attribution: '26%', model: 'Linear' },
            { source: 'View-Through', revenue: '$19,870', attribution: '18%', model: 'Time Decay' },
            { source: 'Cross-Carousel', revenue: '$15,120', attribution: '14%', model: 'Position Based' }
          ]?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Target" size={20} className="text-yellow-500" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item?.source}</p>
                  <p className="text-xs text-muted-foreground">{item?.model} Attribution</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-sm font-bold text-green-500">{item?.revenue}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Attribution</p>
                  <p className="text-sm font-bold text-foreground">{item?.attribution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselMonetizationPanel;