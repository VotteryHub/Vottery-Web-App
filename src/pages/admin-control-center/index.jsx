import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import AdminToolbar from '../../components/ui/AdminToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import PlatformMetricsCard from './components/PlatformMetricsCard';
import ElectionApprovalCard from './components/ElectionApprovalCard';
import UserManagementTable from './components/UserManagementTable';
import BlockchainMonitor from './components/BlockchainMonitor';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SystemActivityLog from './components/SystemActivityLog';
import ParticipationFeeControls from './components/ParticipationFeeControls';
import PlatformControlsPanel from './components/PlatformControlsPanel';

import { electionsService } from '../../services/electionsService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AdminControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminControls, setAdminControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [countryInput, setCountryInput] = useState('');
  const [savingControl, setSavingControl] = useState(null);
  const [livePlatformMetrics, setLivePlatformMetrics] = useState([]);
  const [livePendingElections, setLivePendingElections] = useState([]);
  const [liveUsers, setLiveUsers] = useState([]);
  const [liveSystemActivities, setLiveSystemActivities] = useState([]);

  const platformMetrics = [
  {
    label: "Active Users",
    value: "12,847",
    trend: "+12%",
    icon: "Users",
    bgColor: "bg-primary/10",
    iconColor: "var(--color-primary)",
    subtitle: "Last 24 hours",
    activeUsers: 12847
  },
  {
    label: "Live Elections",
    value: "34",
    trend: "+5",
    icon: "Vote",
    bgColor: "bg-secondary/10",
    iconColor: "var(--color-secondary)",
    subtitle: "Currently active"
  },
  {
    label: "Total Votes Today",
    value: "89,234",
    trend: "+23%",
    icon: "TrendingUp",
    bgColor: "bg-success/10",
    iconColor: "var(--color-success)",
    subtitle: "Across all elections"
  },
  {
    label: "Blockchain TPS",
    value: "1,247",
    trend: "Stable",
    icon: "Activity",
    bgColor: "bg-accent/10",
    iconColor: "var(--color-accent)",
    subtitle: "Transactions per second"
  },
  {
    label: "Pending Approvals",
    value: "18",
    trend: "-3",
    icon: "Clock",
    bgColor: "bg-warning/10",
    iconColor: "var(--color-warning)",
    subtitle: "Requires review"
  },
  {
    label: "Revenue Today",
    value: "$45,892",
    trend: "+18%",
    icon: "DollarSign",
    bgColor: "bg-success/10",
    iconColor: "var(--color-success)",
    subtitle: "Participation fees"
  },
  {
    label: "System Health",
    value: "99.8%",
    trend: "+0.2%",
    icon: "Heart",
    bgColor: "bg-success/10",
    iconColor: "var(--color-success)",
    subtitle: "Uptime"
  },
  {
    label: "Security Alerts",
    value: "2",
    trend: "-5",
    icon: "ShieldAlert",
    bgColor: "bg-destructive/10",
    iconColor: "var(--color-destructive)",
    subtitle: "Requires attention"
  }];


  const pendingElections = [
  {
    id: 1,
    title: "2026 Community Development Initiative",
    description: "Vote on proposed infrastructure projects for local community development including parks, roads, and public facilities.",
    coverImage: "https://images.unsplash.com/photo-1628119481641-f3bca387943d",
    coverImageAlt: "Modern city skyline with construction cranes and urban development projects in progress during golden hour",
    creator: "Sarah Johnson",
    startDate: "01/25/2026",
    participants: "0",
    feeType: "Free",
    status: "pending"
  },
  {
    id: 2,
    title: "Tech Innovation Awards 2026",
    description: "Participate in selecting the most innovative technology startups of the year with prizes for winners.",
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_196152baf-1772221159500.png",
    coverImageAlt: "Modern technology workspace with multiple computer screens displaying code and data analytics in dark ambient lighting",
    creator: "Michael Chen",
    startDate: "01/28/2026",
    participants: "0",
    feeType: "Paid General",
    status: "pending"
  },
  {
    id: 3,
    title: "Environmental Policy Referendum",
    description: "Cast your vote on proposed environmental protection policies and sustainability initiatives for the region.",
    coverImage: "https://images.unsplash.com/photo-1695607209107-ae42357846c8",
    coverImageAlt: "Lush green forest with sunlight filtering through tall trees and vibrant vegetation in natural wilderness setting",
    creator: "Emma Rodriguez",
    startDate: "02/01/2026",
    participants: "0",
    feeType: "Free",
    status: "pending"
  }];


  useEffect(() => {
    loadAdminControls();
    loadAdminDashboardData();
  }, []);

  useEffect(() => {
    // Track admin control center access
    analytics?.trackEvent('admin_center_accessed', {
      pending_approvals: (livePendingElections?.length || pendingElections?.length) || 0,
      active_users: (livePlatformMetrics?.find((m) => m?.metricKey === 'active_users')?.activeUsers || platformMetrics?.activeUsers) || 0,
      timestamp: new Date()?.toISOString()
    });
  }, [livePendingElections, livePlatformMetrics, pendingElections, platformMetrics]);

  const loadAdminControls = async () => {
    try {
      const { data, error } = await electionsService?.getAdminControls();
      if (error) throw new Error(error.message);
      setAdminControls(data || []);
    } catch (err) {
      console.error('Failed to load admin controls:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminDashboardData = async () => {
    try {
      const [electionsResult, usersResult, flagsResult] = await Promise.all([
        supabase
          ?.from('elections')
          ?.select('id, title, description, created_at, created_by, status, vote_count, participation_fee_type')
          ?.eq('status', 'pending')
          ?.order('created_at', { ascending: false })
          ?.limit(20),
        supabase
          ?.from('user_profiles')
          ?.select('id, name, username, email, avatar, role, status, created_at'),
        supabase
          ?.from('content_flags')
          ?.select('id')
          ?.in('status', ['pending_review', 'under_review'])
      ]);

      const pending = (electionsResult?.data || []).map((election) => ({
        id: election?.id,
        title: election?.title || 'Untitled Election',
        description: election?.description || 'No description provided.',
        coverImage: 'https://images.unsplash.com/photo-1628119481641-f3bca387943d',
        coverImageAlt: 'Election preview image',
        creator: election?.created_by || 'Unknown',
        startDate: election?.created_at ? new Date(election?.created_at)?.toLocaleDateString() : 'N/A',
        participants: String(election?.vote_count || 0),
        feeType: election?.participation_fee_type || 'Free',
        status: election?.status || 'pending'
      }));

      const users = (usersResult?.data || []).map((user) => ({
        id: user?.id,
        name: user?.name || user?.username || user?.email || 'Unknown User',
        email: user?.email || 'N/A',
        avatar: user?.avatar || 'https://img.rocket.new/generatedImages/rocket_gen_img_1aef10a9f-1763294632369.png',
        avatarAlt: 'User profile avatar',
        role: user?.role || 'user',
        status: user?.status || 'active',
        joinedDate: user?.created_at ? new Date(user?.created_at)?.toLocaleDateString() : 'N/A',
        votesCount: 0,
        electionsCreated: 0
      }));

      const activeUsers = users?.filter((user) => user?.status === 'active')?.length || 0;
      const pendingApprovals = pending?.length || 0;
      const securityAlerts = (flagsResult?.data || [])?.length || 0;

      setLivePlatformMetrics([
        {
          label: 'Active Users',
          value: activeUsers?.toLocaleString(),
          trend: 'Live',
          icon: 'Users',
          bgColor: 'bg-primary/10',
          iconColor: 'var(--color-primary)',
          subtitle: 'Current active accounts',
          activeUsers,
          metricKey: 'active_users'
        },
        {
          label: 'Pending Approvals',
          value: pendingApprovals?.toLocaleString(),
          trend: 'Live',
          icon: 'Clock',
          bgColor: 'bg-warning/10',
          iconColor: 'var(--color-warning)',
          subtitle: 'Requires review',
          metricKey: 'pending_approvals'
        },
        {
          label: 'Security Alerts',
          value: securityAlerts?.toLocaleString(),
          trend: 'Live',
          icon: 'ShieldAlert',
          bgColor: 'bg-destructive/10',
          iconColor: 'var(--color-destructive)',
          subtitle: 'Flagged moderation events',
          metricKey: 'security_alerts'
        }
      ]);

      setLivePendingElections(pending);
      setLiveUsers(users);
      setLiveSystemActivities(
        pending?.slice(0, 8)?.map((election, index) => ({
          id: `pending-${election?.id}`,
          type: 'election',
          description: `Election awaiting approval: ${election?.title}`,
          admin: 'System',
          timestamp: election?.startDate,
          ipAddress: 'N/A',
          severity: index < 3 ? 'medium' : 'low',
          details: election?.description
        }))
      );
    } catch (error) {
      console.error('Failed to load admin dashboard data:', error);
    }
  };

  const handleGlobalToggle = async (featureName, currentValue) => {
    setSavingControl(featureName);
    try {
      const { error } = await electionsService?.updateAdminControl(featureName, {
        globallyEnabled: !currentValue
      });
      if (error) throw new Error(error.message);
      await loadAdminControls();
    } catch (err) {
      console.error('Failed to update control:', err);
    } finally {
      setSavingControl(null);
    }
  };

  const handleCountryToggle = async (featureName, country, action) => {
    setSavingControl(featureName);
    try {
      const control = adminControls?.find((c) => c?.featureName === featureName);
      let updatedDisabled = [...(control?.disabledCountries || [])];
      let updatedEnabled = [...(control?.enabledCountries || [])];

      if (action === 'disable') {
        if (!updatedDisabled?.includes(country)) {
          updatedDisabled?.push(country);
        }
        updatedEnabled = updatedEnabled?.filter((c) => c !== country);
      } else if (action === 'enable') {
        if (!updatedEnabled?.includes(country)) {
          updatedEnabled?.push(country);
        }
        updatedDisabled = updatedDisabled?.filter((c) => c !== country);
      }

      const { error } = await electionsService?.updateAdminControl(featureName, {
        disabledCountries: updatedDisabled,
        enabledCountries: updatedEnabled
      });
      if (error) throw new Error(error.message);
      await loadAdminControls();
    } catch (err) {
      console.error('Failed to update country control:', err);
    } finally {
      setSavingControl(null);
    }
  };

  const addCountryToList = (country) => {
    const trimmed = country?.trim()?.toUpperCase();
    if (trimmed && !selectedCountries?.includes(trimmed)) {
      setSelectedCountries([...selectedCountries, trimmed]);
      setCountryInput('');
    }
  };

  const removeCountryFromList = (country) => {
    setSelectedCountries(selectedCountries?.filter((c) => c !== country));
  };

  const users = [
  {
    id: 1,
    name: "John Anderson",
    email: "john.anderson@vottery.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1aef10a9f-1763294632369.png",
    avatarAlt: "Professional headshot of Caucasian man with short brown hair wearing navy blue business suit and striped tie",
    role: "admin",
    status: "active",
    joinedDate: "03/15/2025",
    votesCount: 234,
    electionsCreated: 12
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@vottery.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d48526bd-1763295298208.png",
    avatarAlt: "Professional portrait of Hispanic woman with long dark hair wearing white blouse and warm smile",
    role: "moderator",
    status: "active",
    joinedDate: "05/22/2025",
    votesCount: 189,
    electionsCreated: 8
  },
  {
    id: 3,
    name: "Robert Kim",
    email: "robert.kim@vottery.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1fd29f585-1763300949045.png",
    avatarAlt: "Professional headshot of Asian man with black hair and glasses wearing gray suit jacket",
    role: "verified",
    status: "active",
    joinedDate: "07/10/2025",
    votesCount: 456,
    electionsCreated: 3
  },
  {
    id: 4,
    name: "Emily Thompson",
    email: "emily.thompson@vottery.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14da91c34-1763294780479.png",
    avatarAlt: "Professional portrait of blonde woman with shoulder-length hair wearing blue blazer and pearl necklace",
    role: "user",
    status: "suspended",
    joinedDate: "09/05/2025",
    votesCount: 78,
    electionsCreated: 1
  },
  {
    id: 5,
    name: "James Wilson",
    email: "james.wilson@vottery.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19b9a2646-1772196531480.png",
    avatarAlt: "Professional headshot of African American man with short hair wearing black suit and red tie",
    role: "user",
    status: "active",
    joinedDate: "11/18/2025",
    votesCount: 312,
    electionsCreated: 5
  }];


  const blockchainTransactions = [
  {
    id: 1,
    type: "vote",
    description: "Vote cast in University Student Council Elections",
    hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
    status: "confirmed",
    timestamp: "2 minutes ago",
    blockNumber: "15,847,293",
    gasUsed: "21,000"
  },
  {
    id: 2,
    type: "election",
    description: "New election created: Tech Innovation Awards 2026",
    hash: "0x3c2c2eb7b11a91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7",
    status: "confirmed",
    timestamp: "5 minutes ago",
    blockNumber: "15,847,289",
    gasUsed: "45,000"
  },
  {
    id: 3,
    type: "verification",
    description: "Vote verification request processed",
    hash: "0x91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a",
    status: "pending",
    timestamp: "8 minutes ago",
    blockNumber: "15,847,285",
    gasUsed: "18,500"
  },
  {
    id: 4,
    type: "lottery",
    description: "Lottery draw completed for Best Restaurant election",
    hash: "0xead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385f9fade1c0d57a7af66ab4",
    status: "confirmed",
    timestamp: "12 minutes ago",
    blockNumber: "15,847,280",
    gasUsed: "67,000"
  },
  {
    id: 5,
    type: "audit",
    description: "Audit trail generated for Environmental Policy Referendum",
    hash: "0xab4ead7c2c2eb7b11a91385f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66",
    status: "confirmed",
    timestamp: "15 minutes ago",
    blockNumber: "15,847,275",
    gasUsed: "32,000"
  }];


  const analyticsData = {
    engagementTrend: [
    { date: "01/15", activeUsers: 8500, votes: 12000 },
    { date: "01/16", activeUsers: 9200, votes: 13500 },
    { date: "01/17", activeUsers: 8800, votes: 12800 },
    { date: "01/18", activeUsers: 10500, votes: 15200 },
    { date: "01/19", activeUsers: 11200, votes: 16800 },
    { date: "01/20", activeUsers: 12000, votes: 18500 },
    { date: "01/21", activeUsers: 12847, votes: 19234 }],

    electionTypes: [
    { name: "Public", value: 45 },
    { name: "Private", value: 28 },
    { name: "Lotterized", value: 18 },
    { name: "Sponsored", value: 9 }],

    revenueByCategory: [
    { category: "Participation Fees", revenue: 45892, fees: 4589 },
    { category: "Sponsored Elections", revenue: 32500, fees: 3250 },
    { category: "Premium Features", revenue: 18700, fees: 1870 },
    { category: "Lottery Entries", revenue: 28900, fees: 2890 }],

    keyMetrics: [
    {
      label: "Total Revenue",
      value: "$126,092",
      trend: "+18%",
      icon: "DollarSign",
      bgColor: "bg-success/10",
      iconColor: "var(--color-success)"
    },
    {
      label: "Avg. Election Size",
      value: "2,847",
      trend: "+12%",
      icon: "Users",
      bgColor: "bg-primary/10",
      iconColor: "var(--color-primary)"
    },
    {
      label: "Completion Rate",
      value: "94.2%",
      trend: "+3%",
      icon: "CheckCircle",
      bgColor: "bg-success/10",
      iconColor: "var(--color-success)"
    },
    {
      label: "User Retention",
      value: "87.5%",
      trend: "+5%",
      icon: "TrendingUp",
      bgColor: "bg-primary/10",
      iconColor: "var(--color-primary)"
    }]

  };

  const systemActivities = [
  {
    id: 1,
    type: "election",
    description: "Election approved: Community Development Initiative",
    admin: "John Anderson",
    timestamp: "5 minutes ago",
    ipAddress: "192.168.1.100",
    severity: "low",
    details: "Election reviewed and approved for public voting. Blockchain confirmation pending."
  },
  {
    id: 2,
    type: "security",
    description: "Multiple failed login attempts detected",
    admin: "System",
    timestamp: "12 minutes ago",
    ipAddress: "203.45.67.89",
    severity: "high",
    details: "5 consecutive failed login attempts from suspicious IP address. Account temporarily locked."
  },
  {
    id: 3,
    type: "user",
    description: "User account suspended: emily.thompson@vottery.com",
    admin: "Maria Garcia",
    timestamp: "28 minutes ago",
    ipAddress: "192.168.1.105",
    severity: "medium",
    details: "Account suspended due to violation of community guidelines. User notified via email."
  },
  {
    id: 4,
    type: "system",
    description: "Blockchain node synchronization completed",
    admin: "System",
    timestamp: "45 minutes ago",
    ipAddress: "10.0.0.1",
    severity: "info",
    details: "Full blockchain sync completed successfully. All transactions verified and up to date."
  },
  {
    id: 5,
    type: "content",
    description: "Sponsored election content moderated",
    admin: "Maria Garcia",
    timestamp: "1 hour ago",
    ipAddress: "192.168.1.105",
    severity: "low",
    details: "Reviewed and approved sponsored election content for Tech Innovation Awards."
  }];


  const handleElectionApprove = (electionId) => {
    console.log('Approving election:', electionId);
  };

  const handleElectionReject = (electionId) => {
    console.log('Rejecting election:', electionId);
  };

  const handleUserAction = (action, userId) => {
    console.log('User action:', action, userId);
  };

  const tabs = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'users', label: 'User Management', icon: 'Users' },
  { id: 'elections', label: 'Election Approval', icon: 'Vote' },
  { id: 'blockchain', label: 'Blockchain Monitor', icon: 'Shield' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'activity', label: 'Activity Log', icon: 'Activity' },
  { id: 'participation_fees', label: 'Participation Fees', icon: 'DollarSign' }];

  const displayedPlatformMetrics = livePlatformMetrics?.length ? livePlatformMetrics : platformMetrics;
  const displayedPendingElections = livePendingElections?.length ? livePendingElections : pendingElections;
  const displayedUsers = liveUsers?.length ? liveUsers : users;
  const displayedSystemActivities = liveSystemActivities?.length ? liveSystemActivities : systemActivities;

  return (
    <>
      <Helmet>
        <title>Admin Control Center - Vottery</title>
        <meta name="description" content="Comprehensive platform management dashboard for election oversight, user administration, and blockchain monitoring on Vottery." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <AdminToolbar />

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Admin Control Center
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Comprehensive platform management and monitoring dashboard
            </p>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) =>
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                activeTab === tab?.id ?
                'bg-primary text-primary-foreground' :
                'bg-card text-foreground hover:bg-muted'}`
                }>

                  <Icon name={tab?.icon} size={18} />
                  <span className="hidden sm:inline">{tab?.label}</span>
                </button>
              )}
            </div>
          </div>

          {activeTab === 'overview' &&
          <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedPlatformMetrics?.map((metric, index) =>
              <PlatformMetricsCard key={index} metric={metric} />
              )}
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Pending Approvals ({displayedPendingElections?.length})
                </h3>
                <div className="space-y-4">
                  {displayedPendingElections?.map((election) =>
                <ElectionApprovalCard
                  key={election?.id}
                  election={election}
                  onApprove={handleElectionApprove}
                  onReject={handleElectionReject} />

                )}
                </div>
              </div>
            </div>
          }

          {activeTab === 'users' &&
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-1">
                    User Management
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage user accounts and permissions
                  </p>
                </div>
                <Button variant="default" iconName="UserPlus">
                  Add User
                </Button>
              </div>

              <UserManagementTable users={displayedUsers} onUserAction={handleUserAction} />
            </div>
          }

          {activeTab === 'elections' &&
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-1">
                    Election Management
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Review and manage platform elections
                  </p>
                </div>
                <Button variant="outline" iconName="Filter">
                  Filter Elections
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Pending Approvals ({displayedPendingElections?.length})
                </h3>
                <div className="space-y-4">
                  {displayedPendingElections?.map((election) =>
                <ElectionApprovalCard
                  key={election?.id}
                  election={election}
                  onApprove={handleElectionApprove}
                  onReject={handleElectionReject} />

                )}
                </div>
              </div>
            </div>
          }

          {activeTab === 'blockchain' &&
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-1">
                    Blockchain Monitoring
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Real-time blockchain network status and transactions
                  </p>
                </div>
                <Button variant="outline" iconName="ExternalLink">
                  View Explorer
                </Button>
              </div>

              <BlockchainMonitor transactions={blockchainTransactions} />
            </div>
          }

          {activeTab === 'analytics' &&
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-1">
                    Platform Analytics
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Engagement metrics and performance insights
                  </p>
                </div>
                <Button variant="outline" iconName="Download">
                  Export Report
                </Button>
              </div>

              <AnalyticsDashboard analyticsData={analyticsData} />
            </div>
          }

          {activeTab === 'activity' &&
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-1">
                    System Activity Log
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Complete audit trail of admin actions and system events
                  </p>
                </div>
              </div>

              <SystemActivityLog activities={displayedSystemActivities} />
            </div>
          }
          {activeTab === 'platform-controls' &&
          <div className="space-y-6">
              <PlatformControlsPanel />
            </div>
          }
          {activeTab === 'participation_fees' && <ParticipationFeeControls />}
        </main>
      </div>
    </>);

};

export default AdminControlCenter;