import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, MessageSquare, Handshake, GraduationCap, Award, TrendingUp, Search, Plus } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { creatorCommunityService } from '../../services/creatorCommunityService';
import toast from 'react-hot-toast';

const CreatorCommunityHub = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [mentorshipSessions, setMentorshipSessions] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'discussions') {
        const result = await creatorCommunityService?.getDiscussions();
        if (result?.data) setDiscussions(result?.data);
      } else if (activeTab === 'partnerships') {
        const result = await creatorCommunityService?.getPartnerships();
        if (result?.data) setPartnerships(result?.data);
      } else if (activeTab === 'mentorship') {
        const result = await creatorCommunityService?.getMentorshipSessions();
        if (result?.data) setMentorshipSessions(result?.data);
      } else if (activeTab === 'reputation') {
        const result = await creatorCommunityService?.getCreatorReputation();
        if (result?.data) setReputation(result?.data);
      }

      const communitiesResult = await creatorCommunityService?.getAllCommunities();
      if (communitiesResult?.data) setCommunities(communitiesResult?.data);
    } catch (error) {
      toast?.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async () => {
    const fallbackCommunityId = communities?.[0]?.id;
    if (!fallbackCommunityId) {
      toast?.error('No community available yet. Create a community first.');
      return;
    }

    const title = `Community discussion - ${new Date()?.toLocaleDateString()}`;
    const content = 'Start your discussion here. Update this post with full context for your creator community.';
    const result = await creatorCommunityService?.createDiscussion({
      communityId: fallbackCommunityId,
      title,
      content,
      category: selectedCategory === 'all' ? 'strategy_sharing' : selectedCategory,
      isTrending: false,
      upvotes: 0,
      downvotes: 0,
      replyCount: 0,
      viewCount: 0,
    });

    if (result?.error) {
      toast?.error(result?.error?.message || 'Failed to create discussion');
      return;
    }

    toast?.success('Discussion created');
    setActiveTab('discussions');
    loadData();
  };

  const handleVote = async (discussionId, voteType) => {
    const result = await creatorCommunityService?.voteDiscussion(discussionId, voteType);
    if (result?.error) {
      toast?.error(result?.error?.message);
    } else {
      toast?.success('Vote recorded');
      loadData();
    }
  };

  const tabs = [
    { id: 'discussions', label: 'Discussion Forums', icon: MessageSquare },
    { id: 'partnerships', label: 'Partnership Formation', icon: Handshake },
    { id: 'mentorship', label: 'Peer Mentorship', icon: GraduationCap },
    { id: 'reputation', label: 'Reputation Scoring', icon: Award }
  ];

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'strategy_sharing', label: 'Strategy Sharing' },
    { value: 'trend_discussion', label: 'Content Trends' },
    { value: 'monetization', label: 'Monetization' },
    { value: 'platform_updates', label: 'Platform Updates' }
  ];

  const normalizedQuery = searchQuery?.trim()?.toLowerCase();
  const filteredDiscussions = discussions?.filter((discussion) => {
    const categoryMatch = selectedCategory === 'all' || discussion?.category === selectedCategory;
    if (!categoryMatch) return false;
    if (!normalizedQuery) return true;
    const haystack = [
      discussion?.title,
      discussion?.content,
      discussion?.creator?.username,
      discussion?.category,
    ]
      ?.filter(Boolean)
      ?.join(' ')
      ?.toLowerCase();
    return haystack?.includes(normalizedQuery);
  });

  return (
    <>
      <Helmet>
        <title>Creator Community Hub | Collaboration & Networking</title>
        <meta name="description" content="Collaborative space for creator strategy sharing, trend discussions, partnerships, and peer-to-peer mentorship" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <HeaderNavigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Icon icon={Users} className="w-8 h-8 text-blue-600" />
                  Creator Community Hub
                </h1>
                <p className="mt-2 text-gray-600">
                  Collaborative space for strategy sharing, trend discussions, partnership formation, and peer-to-peer mentorship
                </p>
              </div>

              <Button onClick={handleCreateDiscussion} className="flex items-center gap-2">
                <Icon icon={Plus} className="w-4 h-4" />
                New Discussion
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Icon icon={Search} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions, topics, creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e?.target?.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories?.map(cat => (
                  <option key={cat?.value} value={cat?.value}>{cat?.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${
                        activeTab === tab?.id
                          ? 'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon icon={tab?.icon} className="w-5 h-5" />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'discussions' && (
                    <div className="space-y-4">
                      {filteredDiscussions?.map((discussion) => (
                        <div key={discussion?.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{discussion?.title}</h3>
                                {discussion?.isTrending && (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    <Icon icon={TrendingUp} className="w-3 h-3" />
                                    Trending
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3">{discussion?.content?.substring(0, 200)}...</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>By {discussion?.creator?.username}</span>
                                <span>•</span>
                                <span>{discussion?.replyCount} replies</span>
                                <span>•</span>
                                <span>{discussion?.viewCount} views</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                              <button
                                onClick={() => handleVote(discussion?.id, 'up')}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                              >
                                <Icon icon={TrendingUp} className="w-5 h-5 text-green-600" />
                              </button>
                              <span className="text-lg font-semibold text-gray-900">
                                {discussion?.upvotes - discussion?.downvotes}
                              </span>
                              <button
                                onClick={() => handleVote(discussion?.id, 'down')}
                                className="p-2 hover:bg-white rounded-lg transition-colors rotate-180"
                              >
                                <Icon icon={TrendingUp} className="w-5 h-5 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredDiscussions?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No discussions match your current filters.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'partnerships' && (
                    <div className="space-y-4">
                      {partnerships?.map((partnership) => (
                        <div key={partnership?.id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon icon={Handshake} className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{partnership?.projectTitle || 'Partnership Opportunity'}</h3>
                                <p className="text-sm text-gray-600">
                                  {partnership?.creatorOne?.username} & {partnership?.creatorTwo?.username}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              partnership?.status === 'active' ? 'bg-green-100 text-green-700' :
                              partnership?.status === 'pending'? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {partnership?.status}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4">{partnership?.projectDescription}</p>

                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>Audience Overlap: {partnership?.audienceOverlapScore}%</span>
                            <span>•</span>
                            <span>Content Synergy: {partnership?.contentSynergyScore}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'mentorship' && (
                    <div className="space-y-4">
                      {mentorshipSessions?.map((session) => (
                        <div key={session?.id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Icon icon={GraduationCap} className="w-6 h-6 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{session?.topic}</h3>
                                <p className="text-sm text-gray-600">
                                  Mentor: {session?.mentor?.username} • Mentee: {session?.mentee?.username}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              session?.status === 'completed' ? 'bg-green-100 text-green-700' :
                              session?.status === 'in_progress'? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {session?.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>Type: {session?.sessionType}</span>
                            <span>•</span>
                            <span>Scheduled: {new Date(session?.scheduledAt)?.toLocaleDateString()}</span>
                            {session?.progressRating && (
                              <>
                                <span>•</span>
                                <span>Rating: {session?.progressRating}/5</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reputation' && reputation && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-blue-900">Overall Reputation</h3>
                            <Icon icon={Award} className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-3xl font-bold text-blue-900">{reputation?.overallReputation}</p>
                          <p className="text-sm text-blue-700 mt-2 capitalize">{reputation?.rank}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-green-900">Influence Score</h3>
                            <Icon icon={TrendingUp} className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="text-3xl font-bold text-green-900">{reputation?.influenceScore}</p>
                          <p className="text-sm text-green-700 mt-2">Community Impact</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-purple-900">Quality Score</h3>
                            <Icon icon={Award} className="w-6 h-6 text-purple-600" />
                          </div>
                          <p className="text-3xl font-bold text-purple-900">{reputation?.contributionQualityScore}</p>
                          <p className="text-sm text-purple-700 mt-2">Contribution Quality</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h3>
                        <div className="flex flex-wrap gap-3">
                          {reputation?.peerRecognitionBadges?.map((badge, index) => (
                            <span key={index} className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700">
                              🏆 {badge}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-2xl font-bold text-gray-900">{reputation?.totalContributions}</p>
                          <p className="text-sm text-gray-600 mt-1">Total Contributions</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-2xl font-bold text-gray-900">{reputation?.helpfulVotesReceived}</p>
                          <p className="text-sm text-gray-600 mt-1">Helpful Votes</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-2xl font-bold text-gray-900">{reputation?.mentorshipSessionsCompleted}</p>
                          <p className="text-sm text-gray-600 mt-1">Mentorship Sessions</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-2xl font-bold text-gray-900">{reputation?.partnershipsCompleted}</p>
                          <p className="text-sm text-gray-600 mt-1">Partnerships</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorCommunityHub;