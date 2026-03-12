import React from 'react';
import Icon from '../../../components/AppIcon';

const ContentEngagementPanel = ({ contentEngagement }) => {
  const getCarouselIcon = (carousel) => {
    switch(carousel) {
      case 'horizontal': return 'ArrowLeftRight';
      case 'vertical': return 'Layers';
      case 'gradient': return 'Waves';
      default: return 'Box';
    }
  };

  const getCarouselColor = (carousel) => {
    switch(carousel) {
      case 'horizontal': return 'text-blue-600 dark:text-blue-400';
      case 'vertical': return 'text-purple-600 dark:text-purple-400';
      case 'gradient': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCarouselBg = (carousel) => {
    switch(carousel) {
      case 'horizontal': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'vertical': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'gradient': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const horizontalContent = contentEngagement?.filter(c => c?.carousel === 'horizontal');
  const verticalContent = contentEngagement?.filter(c => c?.carousel === 'vertical');
  const gradientContent = contentEngagement?.filter(c => c?.carousel === 'gradient');

  return (
    <div className="space-y-6">
      {/* Content Engagement Overview */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Content Engagement Breakdown</h2>
            <p className="text-sm text-muted-foreground">Performance metrics for all 9 content types across carousels</p>
          </div>
        </div>

        {/* Horizontal Snap Content */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="ArrowLeftRight" size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-foreground">Horizontal Snap Carousel</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {horizontalContent?.map((content) => (
              <div key={content?.type} className={`rounded-xl p-4 border ${getCarouselBg(content?.carousel)}`}>
                <h4 className="font-semibold text-foreground mb-3">{content?.type}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Views</span>
                    <span className="text-sm font-bold text-foreground">{content?.views?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Clicks</span>
                    <span className="text-sm font-bold text-foreground">{content?.clicks?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Avg Dwell</span>
                    <span className="text-sm font-bold text-foreground">{content?.avgDwell}s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Conversion</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{content?.conversion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Stack Content */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Layers" size={20} className="text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-foreground">Vertical Stack Carousel</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {verticalContent?.map((content) => (
              <div key={content?.type} className={`rounded-xl p-4 border ${getCarouselBg(content?.carousel)}`}>
                <h4 className="font-semibold text-foreground mb-3">{content?.type}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Views</span>
                    <span className="text-sm font-bold text-foreground">{content?.views?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Swipes</span>
                    <span className="text-sm font-bold text-foreground">{content?.clicks?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Avg Dwell</span>
                    <span className="text-sm font-bold text-foreground">{content?.avgDwell}s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Conversion</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{content?.conversion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Flow Content */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Waves" size={20} className="text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-bold text-foreground">Gradient Flow Carousel</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gradientContent?.map((content) => (
              <div key={content?.type} className={`rounded-xl p-4 border ${getCarouselBg(content?.carousel)}`}>
                <h4 className="font-semibold text-foreground mb-3">{content?.type}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Views</span>
                    <span className="text-sm font-bold text-foreground">{content?.views?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Clicks</span>
                    <span className="text-sm font-bold text-foreground">{content?.clicks?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Avg Dwell</span>
                    <span className="text-sm font-bold text-foreground">{content?.avgDwell}s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Engagement</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{content?.conversion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Top Performing Content */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Trophy" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Top Performing Content Types</h3>
            <p className="text-sm text-muted-foreground">Ranked by conversion and engagement metrics</p>
          </div>
        </div>

        <div className="space-y-3">
          {contentEngagement
            ?.sort((a, b) => b?.conversion - a?.conversion)
            ?.slice(0, 5)
            ?.map((content, index) => (
              <div key={content?.type} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-400 text-orange-900': 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{content?.type}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name={getCarouselIcon(content?.carousel)} size={12} className={getCarouselColor(content?.carousel)} />
                      <span className="capitalize">{content?.carousel} Carousel</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{content?.conversion}%</div>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* User Retention Analysis */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">User Retention Analysis</h3>
            <p className="text-sm text-muted-foreground">Content engagement impact on user retention</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">82%</div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">7-Day Retention</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Users who engaged with carousels</p>
          </div>

          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">68%</div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">30-Day Retention</p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Long-term engagement rate</p>
          </div>

          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">3.2x</div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Return Visit Rate</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">Compared to non-carousel users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEngagementPanel;