import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommunityBuildingToolsPanel = () => {
  const groupCreationCapabilities = [
    { name: 'Sports Enthusiasts', members: 1234, elections: 45, activity: 'Very High' },
    { name: 'Tech Innovators', members: 987, elections: 67, activity: 'High' },
    { name: 'Entertainment Fans', members: 2345, elections: 89, activity: 'Very High' },
    { name: 'Political Discussions', members: 678, elections: 34, activity: 'Medium' }
  ];

  const topicBasedCommunities = [
    { topic: 'Streaming Platforms', subscribers: 5678, posts: 234, engagement: 89 },
    { topic: 'Gaming', subscribers: 4567, posts: 456, engagement: 92 },
    { topic: 'Movies & TV', subscribers: 6789, posts: 567, engagement: 87 },
    { topic: 'Music', subscribers: 3456, posts: 345, engagement: 85 }
  ];

  const collaborativeElectionDevelopment = [
    { title: 'Best Streaming Service 2024', collaborators: 12, contributions: 45, status: 'Active' },
    { title: 'Top Gaming Console', collaborators: 8, contributions: 34, status: 'Draft' },
    { title: 'Favorite Social Platform', collaborators: 15, contributions: 67, status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Icon name="Users" size={24} className="text-primary" />
              Group Creation Capabilities
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage interest-based communities with moderation controls
            </p>
          </div>
          <Button>
            <Icon name="Plus" size={16} className="mr-2" />
            Create Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupCreationCapabilities?.map((group, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{group?.name}</h3>
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{group?.members?.toLocaleString()} members</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  group?.activity === 'Very High' ?'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : group?.activity === 'High' ?'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                }`}>
                  {group?.activity}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{group?.elections} active elections</span>
                <Button variant="outline" size="sm">
                  <Icon name="ArrowRight" size={14} className="mr-1" />
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Hash" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Topic-Based Communities
          </h2>
        </div>

        <div className="space-y-3">
          {topicBasedCommunities?.map((community, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  #
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">{community?.topic}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{community?.subscribers?.toLocaleString()} subscribers</span>
                    <span>{community?.posts} posts</span>
                    <span className="flex items-center gap-1">
                      <Icon name="TrendingUp" size={14} className="text-green-600 dark:text-green-400" />
                      {community?.engagement}% engagement
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <Icon name="Plus" size={16} className="mr-2" />
                Subscribe
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="GitBranch" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Collaborative Election Development
          </h2>
        </div>

        <div className="space-y-4">
          {collaborativeElectionDevelopment?.map((election, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-foreground">{election?.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      election?.status === 'Active' ?'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {election?.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={14} />
                      <span>{election?.collaborators} collaborators</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Edit" size={14} />
                      <span>{election?.contributions} contributions</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Icon name="UserPlus" size={14} className="mr-2" />
                  Join Project
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(election?.collaborators, 5))]?.map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {election?.collaborators > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold">
                      +{election?.collaborators - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Moderation Controls & Member Management</h3>
            <p className="text-purple-100 mb-4">
              Comprehensive tools for community health and safety
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Icon name="Shield" size={24} className="mb-2" />
                <div className="text-sm">Content Moderation</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Icon name="Users" size={24} className="mb-2" />
                <div className="text-sm">Member Management</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Icon name="Settings" size={24} className="mb-2" />
                <div className="text-sm">Community Settings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityBuildingToolsPanel;