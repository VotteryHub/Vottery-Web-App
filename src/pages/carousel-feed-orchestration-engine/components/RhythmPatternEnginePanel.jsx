import React from 'react';
import Icon from '../../../components/AppIcon';
import { Line } from 'react-chartjs-2';

const RhythmPatternEnginePanel = ({ data }) => {
  const patternData = {
    labels: Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`),
    datasets: [{
      label: 'Engagement Score',
      data: [65, 72, 68, 95, 70, 75, 73, 92, 68, 71, 69, 88, 72, 74, 70, 90, 69, 73, 71, 94],
      borderColor: 'rgb(255, 215, 0)',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="Repeat" size={24} className="text-yellow-500" />
          Rhythm of 3 Pattern Engine
        </h2>
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6 mb-6 border border-yellow-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Icon name="FileText" size={24} className="text-blue-500" />
              </div>
              <span className="text-sm font-medium text-foreground">Post</span>
            </div>
            <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Icon name="FileText" size={24} className="text-blue-500" />
              </div>
              <span className="text-sm font-medium text-foreground">Post</span>
            </div>
            <Icon name="ArrowRight" size={20} className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Icon name="FileText" size={24} className="text-blue-500" />
              </div>
              <span className="text-sm font-medium text-foreground">Post</span>
            </div>
            <Icon name="ArrowRight" size={20} className="text-yellow-500" />
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Icon name="LayoutGrid" size={24} className="text-yellow-500" />
              </div>
              <span className="text-sm font-medium text-yellow-500">Carousel</span>
            </div>
            <Icon name="Repeat" size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Intelligent sequencing: 3 posts → carousel → 3 posts pattern with automated positioning optimization</p>
        </div>

        <div className="h-[300px] mb-6">
          <Line data={patternData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
            <Icon name="CheckCircle" size={24} className="text-green-500 mb-2" />
            <p className="text-2xl font-bold text-foreground">98.5%</p>
            <p className="text-sm text-muted-foreground">Pattern Compliance</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
            <Icon name="Zap" size={24} className="text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-foreground">2.3s</p>
            <p className="text-sm text-muted-foreground">Avg Scroll Time</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <Icon name="TrendingUp" size={24} className="text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-foreground">+15%</p>
            <p className="text-sm text-muted-foreground">Engagement Lift</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Automated Positioning Optimization</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Target" size={20} className="text-yellow-500" />
              <span className="text-sm font-medium text-foreground">User Engagement Patterns</span>
            </div>
            <span className="text-sm font-semibold text-green-500">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Activity" size={20} className="text-blue-500" />
              <span className="text-sm font-medium text-foreground">Scroll Behavior Analysis</span>
            </div>
            <span className="text-sm font-semibold text-green-500">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Sparkles" size={20} className="text-purple-500" />
              <span className="text-sm font-medium text-foreground">Dynamic Carousel Insertion</span>
            </div>
            <span className="text-sm font-semibold text-green-500">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RhythmPatternEnginePanel;