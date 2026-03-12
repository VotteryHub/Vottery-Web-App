import React from 'react';
import Icon from '../../../components/AppIcon';
import { Doughnut, Bar } from 'react-chartjs-2';

const FeedCompositionPanel = ({ data }) => {
  const compositionData = {
    labels: ['Horizontal Snap', 'Vertical Stack', 'Gradient Flow'],
    datasets: [{
      data: [35, 35, 30],
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const contentTypeData = {
    labels: ['Live Elections', 'Jolts', 'Moments', 'Connections', 'Groups', 'Winners', 'Topics', 'Earners'],
    datasets: [{
      label: 'Content Distribution',
      data: [18, 15, 12, 14, 13, 11, 9, 8],
      backgroundColor: 'rgba(255, 215, 0, 0.8)'
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="LayoutGrid" size={24} className="text-yellow-500" />
          Live Feed Composition Metrics
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Carousel Type Balance</h3>
            <div className="h-[300px]">
              <Doughnut data={compositionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Content Type Distribution</h3>
            <div className="h-[300px]">
              <Bar data={contentTypeData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
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
          <p className="text-3xl font-bold text-yellow-500 mb-2">35%</p>
          <p className="text-sm text-muted-foreground mb-4">Live Elections, Jolts, Moments, Spotlights</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement Rate</span>
              <span className="font-semibold text-foreground">27.3%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Dwell Time</span>
              <span className="font-semibold text-foreground">4.2s</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Vertical Stack</h3>
            <Icon name="ArrowUp" size={20} className="text-pink-500" />
          </div>
          <p className="text-3xl font-bold text-pink-500 mb-2">35%</p>
          <p className="text-sm text-muted-foreground mb-4">Connections, Groups, Elections, Services</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement Rate</span>
              <span className="font-semibold text-foreground">23.8%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Dwell Time</span>
              <span className="font-semibold text-foreground">6.8s</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Gradient Flow</h3>
            <Icon name="Waves" size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-500 mb-2">30%</p>
          <p className="text-sm text-muted-foreground mb-4">Winners, Topics, Earners, Champions</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement Rate</span>
              <span className="font-semibold text-foreground">22.1%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Dwell Time</span>
              <span className="font-semibold text-foreground">3.5s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCompositionPanel;