import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { votesService } from '../../services/votesService';
import { walletService } from '../../services/walletService';

import VotingPerformance from './components/VotingPerformance';
import EarningsTracking from './components/EarningsTracking';
import AchievementProgress from './components/AchievementProgress';
import EngagementAnalytics from './components/EngagementAnalytics';
import PerformanceOverview from './components/PerformanceOverview';

const PersonalAnalyticsDashboard = () => {
  const { user, userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    votingStats: null,
    earningsData: null,
    achievements: null,
    engagement: null
  });

  useEffect(() => {
    if (user?.id) {
      loadAnalyticsData();
    }
  }, [user?.id, timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [votesResult, walletResult, transactionsResult] = await Promise.all([
        votesService?.getUserVotes(user?.id),
        walletService?.getUserWallet(user?.id),
        walletService?.getWalletTransactions(user?.id, { type: 'winning' })
      ]);

      // Calculate voting statistics
      const votes = votesResult?.data || [];
      const filteredVotes = filterByTimeRange(votes, timeRange);
      
      const votingStats = {
        totalVotes: filteredVotes?.length,
        electionsParticipated: new Set(filteredVotes?.map(v => v?.electionId))?.size,
        averagePerWeek: calculateAveragePerWeek(filteredVotes),
        participationRate: calculateParticipationRate(filteredVotes)
      };

      // Calculate earnings data
      const transactions = transactionsResult?.data || [];
      const filteredTransactions = filterByTimeRange(transactions, timeRange);
      
      const earningsData = {
        totalEarnings: walletResult?.data?.totalWinnings || 0,
        periodEarnings: filteredTransactions?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0),
        averagePerElection: filteredTransactions?.length > 0 
          ? filteredTransactions?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0) / filteredTransactions?.length
          : 0,
        transactions: filteredTransactions
      };

      // Mock achievements data (would come from user profile stats in production)
      const achievements = {
        totalBadges: 12,
        unlockedBadges: 8,
        completionPercentage: 67,
        recentUnlocks: [
          { id: 1, name: 'First Vote', unlockedAt: new Date(), icon: 'Vote' },
          { id: 2, name: '10 Elections', unlockedAt: new Date(), icon: 'Trophy' }
        ],
        milestones: [
          { id: 1, name: '100 Votes', progress: votingStats?.totalVotes, target: 100, icon: 'Target' },
          { id: 2, name: '₹10,000 Earned', progress: earningsData?.totalEarnings, target: 10000, icon: 'DollarSign' }
        ]
      };

      // Calculate engagement metrics
      const engagement = {
        votingFrequency: calculateVotingFrequency(filteredVotes),
        categoryPreferences: calculateCategoryPreferences(filteredVotes),
        activityPattern: calculateActivityPattern(filteredVotes),
        streakDays: 7 // Mock data
      };

      setAnalyticsData({
        votingStats,
        earningsData,
        achievements,
        engagement
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const filterByTimeRange = (data, range) => {
    if (!data) return [];
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '7d':
        startDate?.setDate(now?.getDate() - 7);
        break;
      case '30d':
        startDate?.setDate(now?.getDate() - 30);
        break;
      case '90d':
        startDate?.setDate(now?.getDate() - 90);
        break;
      case 'all':
        return data;
      default:
        startDate?.setDate(now?.getDate() - 30);
    }

    return data?.filter(item => new Date(item?.createdAt) >= startDate);
  };

  const calculateAveragePerWeek = (votes) => {
    if (!votes?.length) return 0;
    const weeks = Math.ceil(votes?.length / 7);
    return (votes?.length / weeks)?.toFixed(1);
  };

  const calculateParticipationRate = (votes) => {
    // Mock calculation - would compare against available elections
    return Math.min(95, (votes?.length * 5));
  };

  const calculateVotingFrequency = (votes) => {
    if (!votes?.length) return [];
    const frequency = {};
    votes?.forEach(vote => {
      const date = new Date(vote?.createdAt)?.toLocaleDateString();
      frequency[date] = (frequency?.[date] || 0) + 1;
    });
    return Object.entries(frequency)?.map(([date, count]) => ({ date, count }));
  };

  const calculateCategoryPreferences = (votes) => {
    // Mock data - would use actual election categories
    return [
      { category: 'National', count: Math.floor(votes?.length * 0.4) },
      { category: 'Local', count: Math.floor(votes?.length * 0.3) },
      { category: 'Community', count: Math.floor(votes?.length * 0.2) },
      { category: 'Other', count: Math.floor(votes?.length * 0.1) }
    ];
  };

  const calculateActivityPattern = (votes) => {
    const pattern = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    votes?.forEach(vote => {
      const hour = new Date(vote?.createdAt)?.getHours();
      if (hour >= 6 && hour < 12) pattern.morning++;
      else if (hour >= 12 && hour < 17) pattern.afternoon++;
      else if (hour >= 17 && hour < 21) pattern.evening++;
      else pattern.night++;
    });
    return pattern;
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <>
      <Helmet>
        <title>Personal Analytics Dashboard - Vottery</title>
        <meta name="description" content="Comprehensive performance insights including voting patterns, earnings tracking, achievement progress, and engagement analytics for your Vottery account." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Personal Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Track your voting performance, earnings, achievements, and engagement metrics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e?.target?.value)}
                  options={timeRangeOptions}
                  className="w-40"
                />
                <Button
                  onClick={refreshData}
                  iconName="RefreshCw"
                  variant="outline"
                  disabled={refreshing}
                  iconClassName={refreshing ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Performance Overview */}
              <PerformanceOverview 
                votingStats={analyticsData?.votingStats}
                earningsData={analyticsData?.earningsData}
                achievements={analyticsData?.achievements}
                timeRange={timeRange}
              />

              {/* Main Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VotingPerformance 
                  stats={analyticsData?.votingStats}
                  engagement={analyticsData?.engagement}
                  timeRange={timeRange}
                />
                <EarningsTracking 
                  data={analyticsData?.earningsData}
                  timeRange={timeRange}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AchievementProgress 
                  achievements={analyticsData?.achievements}
                />
                <EngagementAnalytics 
                  engagement={analyticsData?.engagement}
                  timeRange={timeRange}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default PersonalAnalyticsDashboard;