import React from 'react';
import Icon from '../../../components/AppIcon';


const CardDesigns = () => {
  return (
    <div className="space-y-8">
      {/* Basic Card */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Basic Card Design
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Standard card with consistent padding, borders, and shadows
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Default Card
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Standard card with rounded corners, subtle shadow, and responsive padding.
            </p>
          </div>
          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Hover Card
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Card with hover effect - shadow elevation and smooth transition.
            </p>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Content Card Patterns
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Common card layouts for posts, elections, and user content
        </p>
        <div className="space-y-6">
          {/* Post Card Pattern */}
          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="User" size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">User Name</h3>
                  <Icon name="BadgeCheck" size={16} className="text-primary" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">@username</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">· 2h ago</span>
                </div>
              </div>
            </div>
            <p className="text-gray-900 dark:text-gray-100 mb-4">
              This is a sample post card design with consistent spacing, typography, and interactive elements.
            </p>
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                <Icon name="Heart" size={18} />
                <span className="text-sm">24</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={18} />
                <span className="text-sm">8</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
                <Icon name="Share2" size={18} />
                <span className="text-sm">3</span>
              </button>
            </div>
          </div>

          {/* Election Card Pattern */}
          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex gap-4">
              <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Icon name="Vote" size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    <Icon name="Activity" size={12} className="inline mr-1" />
                    Active
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    <Icon name="Trophy" size={12} className="inline mr-1" />
                    Lotterized
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Sample Election Title
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Election card with status badges, icons, and metadata display.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Icon name="Users" size={16} />
                    <span>1,234</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Icon name="Calendar" size={16} />
                    <span>2 days left</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Icon name="DollarSign" size={16} />
                    <span>$500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing & Shadows */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Card Elevation System
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Shadow levels for visual hierarchy and depth
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Default</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Standard card shadow</p>
          </div>
          <div className="card p-6 shadow-democratic-md">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Medium</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Elevated card shadow</p>
          </div>
          <div className="card p-6 shadow-democratic-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Large</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">High elevation shadow</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDesigns;