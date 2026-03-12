import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import DashboardStats from './components/DashboardStats';
import CreateElectionSection from './components/CreateElectionSection';
import VoteElectionSection from './components/VoteElectionSection';
import VerifyElectionSection from './components/VerifyElectionSection';
import AuditElectionSection from './components/AuditElectionSection';
import { electionsService } from '../../services/electionsService';
import { votesService } from '../../services/votesService';
import { useAuth } from '../../contexts/AuthContext';

const ElectionsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    electionsCreated: 0,
    votesCast: 0,
    verifications: 0,
    auditActivities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [electionsResult, votesResult] = await Promise.all([
      electionsService?.getUserElections(user?.id),
      votesService?.getUserVotes(user?.id)]
      );

      setStats({
        electionsCreated: electionsResult?.data?.length || 0,
        votesCast: votesResult?.data?.length || 0,
        verifications: votesResult?.data?.filter((v) => v?.blockchainHash)?.length || 0,
        auditActivities: 0
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
  {
    id: 1,
    label: "Elections Created",
    value: stats?.electionsCreated?.toString(),
    icon: "Plus",
    iconColor: "var(--color-primary)",
    bgColor: "bg-primary/10",
    trend: "+3",
    trendDirection: "up",
    description: "This month"
  },
  {
    id: 2,
    label: "Votes Cast",
    value: stats?.votesCast?.toString(),
    icon: "Vote",
    iconColor: "var(--color-secondary)",
    bgColor: "bg-secondary/10",
    trend: "+12",
    trendDirection: "up",
    description: "Total participation"
  },
  {
    id: 3,
    label: "Verifications",
    value: stats?.verifications?.toString(),
    icon: "ShieldCheck",
    iconColor: "var(--color-success)",
    bgColor: "bg-success/10",
    trend: "+5",
    trendDirection: "up",
    description: "Blockchain verified"
  },
  {
    id: 4,
    label: "Audit Activities",
    value: stats?.auditActivities?.toString(),
    icon: "FileSearch",
    iconColor: "var(--color-accent)",
    bgColor: "bg-accent/10",
    trend: "+2",
    trendDirection: "up",
    description: "Completed audits"
  }];


  const electionTemplates = [
  {
    id: 1,
    name: "Political Election",
    description: "Standard political voting with ranked choice options and comprehensive audit trails",
    icon: "Vote",
    iconColor: "var(--color-primary)",
    bgColor: "bg-primary/10",
    estimatedTime: "15 min setup"
  },
  {
    id: 2,
    name: "Community Poll",
    description: "Quick community decision-making with simple plurality voting and instant results",
    icon: "Users",
    iconColor: "var(--color-secondary)",
    bgColor: "bg-secondary/10",
    estimatedTime: "5 min setup"
  },
  {
    id: 3,
    name: "Lotterized Election",
    description: "Gamified voting with lottery rewards, prize pools, and automated winner selection",
    icon: "Trophy",
    iconColor: "var(--color-accent)",
    bgColor: "bg-accent/10",
    estimatedTime: "20 min setup"
  }];


  const recentDrafts = [
  {
    id: 1,
    title: "City Council Member Ward 3",
    lastEdited: "2 hours ago",
    completionPercentage: 75
  },
  {
    id: 2,
    title: "Annual HOA Board Election",
    lastEdited: "1 day ago",
    completionPercentage: 45
  }];


  const availableElections = [
  {
    id: 1,
    title: "Community Budget Allocation 2026",
    description: "Vote on how to allocate $2.5 million in community development funds across infrastructure, education, healthcare, and public safety initiatives for the upcoming fiscal year.",
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1a0b7563b-1765794380085.png",
    coverImageAlt: "Professional business meeting with diverse team members reviewing budget documents and charts on large conference table with laptops and financial reports",
    status: "active",
    category: "political",
    isLotterized: false,
    participants: 8947,
    totalVotes: 8947,
    endDate: "Jan 28, 2026",
    hasVoted: false,
    blockchainHash: "0x7d8f9a2b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a"
  },
  {
    id: 2,
    title: "Best Local Restaurant Award",
    description: "Cast your vote for the best dining experience in our city! Winners receive featured placement in our community guide and a $5,000 marketing package to celebrate culinary excellence.",
    coverImage: "https://images.unsplash.com/photo-1668246791341-7d30c2bbb4c3",
    coverImageAlt: "Elegant fine dining restaurant interior with white tablecloths, ambient lighting, professional waitstaff serving gourmet dishes to satisfied customers in upscale atmosphere",
    status: "active",
    category: "community",
    isLotterized: true,
    participants: 12453,
    totalVotes: 12453,
    endDate: "Jan 25, 2026",
    prizePool: "$10,000",
    hasVoted: true,
    blockchainHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
  },
  {
    id: 3,
    title: "School Board Election District 5",
    description: "Select three candidates to represent District 5 on the school board for a four-year term. Candidates will oversee curriculum development, budget allocation, and policy decisions affecting 15,000 students.",
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_14680fb1c-1767809346368.png",
    coverImageAlt: "Modern school classroom with diverse students engaged in learning activities, teacher at interactive whiteboard, colorful educational posters, bright natural lighting through large windows",
    status: "upcoming",
    category: "educational",
    isLotterized: false,
    participants: 0,
    totalVotes: 0,
    endDate: "Feb 5, 2026",
    hasVoted: false,
    blockchainHash: null
  },
  {
    id: 4,
    title: "City Council Member Ward 3",
    description: "Elect your representative for Ward 3 City Council. The elected official will serve a two-year term addressing local infrastructure, zoning regulations, and community development projects.",
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_13c78aee2-1768625830275.png",
    coverImageAlt: "City council chamber with wooden podium, rows of seats for council members, American flag, official seal on wall, professional government meeting space with modern audio-visual equipment",
    status: "completed",
    category: "political",
    isLotterized: false,
    participants: 5621,
    totalVotes: 5621,
    endDate: "Jan 15, 2026",
    hasVoted: true,
    blockchainHash: "0x9f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4"
  },
  {
    id: 5,
    title: "Corporate Sustainability Initiative Vote",
    description: "Shareholders vote on proposed environmental sustainability measures including carbon neutrality targets, renewable energy investments, and supply chain transparency initiatives for 2026-2030.",
    coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1d69f7f41-1767693098294.png",
    coverImageAlt: "Modern corporate boardroom with executives in business attire reviewing sustainability reports, solar panels visible through floor-to-ceiling windows, green plants, eco-friendly office design",
    status: "active",
    category: "corporate",
    isLotterized: false,
    participants: 3247,
    totalVotes: 3247,
    endDate: "Jan 30, 2026",
    hasVoted: false,
    blockchainHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c"
  }];


  const handleVote = (electionId) => {
    navigate('/secure-voting-interface', { state: { electionId } });
  };

  const handleVerify = (electionId) => {
    setActiveTab('verify');
  };

  const tabs = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'create', label: 'Create Elections', icon: 'Plus' },
  { id: 'vote', label: 'Vote in Elections', icon: 'Vote' },
  { id: 'verify', label: 'Verify Elections', icon: 'ShieldCheck' },
  { id: 'audit', label: 'Audit Elections', icon: 'FileSearch' }];


  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <ElectionsSidebar />
        
        <main className="flex-1 min-w-0">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
                Elections Dashboard
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Manage your elections, cast votes, and verify blockchain integrity
              </p>
            </div>

            <div className="mb-6 md:mb-8 overflow-x-auto">
              <div className="flex gap-2 min-w-max lg:min-w-0">
                {tabs?.map((tab) =>
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-250 whitespace-nowrap ${
                  activeTab === tab?.id ?
                  'bg-primary text-primary-foreground shadow-democratic-md' :
                  'bg-card text-foreground hover:bg-muted'}`
                  }>

                    <span className="hidden sm:inline">{tab?.label}</span>
                    <span className="sm:hidden">{tab?.label?.split(' ')?.[0]}</span>
                  </button>
                )}
              </div>
            </div>

            {activeTab === 'overview' &&
            <div className="space-y-6 md:space-y-8">
                <DashboardStats stats={dashboardStats} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <div className="card p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4">
                      Quick Actions
                    </h2>
                    <div className="space-y-3">
                      <button
                      onClick={() => setActiveTab('create')}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-250 group">

                        <span className="text-sm md:text-base font-medium text-foreground">
                          Create New Election
                        </span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-250">
                          <span className="text-primary">→</span>
                        </div>
                      </button>
                      <button
                      onClick={() => setActiveTab('vote')}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-all duration-250 group">

                        <span className="text-sm md:text-base font-medium text-foreground">
                          Browse Active Elections
                        </span>
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-all duration-250">
                          <span className="text-secondary">→</span>
                        </div>
                      </button>
                      <button
                      onClick={() => setActiveTab('verify')}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-success/5 hover:bg-success/10 transition-all duration-250 group">

                        <span className="text-sm md:text-base font-medium text-foreground">
                          Verify Your Vote
                        </span>
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-all duration-250">
                          <span className="text-success">→</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="card p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4">
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-success text-sm">✓</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Vote verified on blockchain
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Best Local Restaurant Award • 2 hours ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-sm">+</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            New election created
                          </p>
                          <p className="text-xs text-muted-foreground">
                            City Council Member Ward 3 • 1 day ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-secondary text-sm">✓</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Vote cast successfully
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Community Budget Allocation • 2 days ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'create' &&
            <CreateElectionSection
              templates={electionTemplates}
              recentDrafts={recentDrafts} />

            }

            {activeTab === 'vote' &&
            <VoteElectionSection
              elections={availableElections}
              onVote={handleVote}
              onVerify={handleVerify} />

            }

            {activeTab === 'verify' && <VerifyElectionSection />}

            {activeTab === 'audit' && <AuditElectionSection />}
          </div>
        </main>
      </div>
    </div>);

};

export default ElectionsDashboard;