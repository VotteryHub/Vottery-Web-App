import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
import Icon from '../../components/AppIcon';

import { AppShell } from '../../components/layout/AppShell';
import { PageContainer } from '../../components/layout/PageContainer';
import { ContentGrid } from '../../components/layout/ContentGrid';
import { Plus, Vote, ShieldCheck, FileSearch, LayoutDashboard, Activity, ChevronRight } from 'lucide-react';

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
  const [availableElectionsData, setAvailableElectionsData] = useState([]);
  const [recentDraftsData, setRecentDraftsData] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [electionsResult, votesResult, allElectionsResult] = await Promise.all([
        electionsService?.getUserElections(user?.id),
        votesService?.getUserVotes(user?.id),
        electionsService?.getAll({ pageSize: 50 })
      ]);

      setStats({
        electionsCreated: electionsResult?.data?.length || 0,
        votesCast: votesResult?.data?.length || 0,
        verifications: votesResult?.data?.filter((v) => v?.blockchainHash)?.length || 0,
        auditActivities: 0
      });
      const draftRows = (electionsResult?.data || [])
        ?.filter((row) => row?.status === 'draft')
        ?.slice(0, 5)
        ?.map((row) => ({
          id: row?.id,
          title: row?.title || 'Untitled election',
          lastEdited: row?.updatedAt || row?.createdAt || 'N/A',
          completionPercentage: 50,
        }));
      setRecentDraftsData(draftRows);

      const rows = (allElectionsResult?.data || [])?.slice(0, 20)?.map((row) => ({
        id: row?.id,
        title: row?.title || 'Untitled election',
        description: row?.description || 'No description available',
        coverImage: row?.coverImage || '',
        coverImageAlt: `${row?.title || 'Election'} cover image`,
        status: row?.status || 'active',
        category: row?.category || 'general',
        isLotterized: !!row?.isLotterized,
        participants: row?.voteCount || 0,
        totalVotes: row?.voteCount || 0,
        endDate: row?.endDate || '',
        hasVoted: false,
        blockchainHash: row?.blockchainHash || null,
      }));
      setAvailableElectionsData(rows);
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
      iconColor: "#a855f7",
      bgColor: "bg-purple-500/10",
      trend: "+3",
      trendDirection: "up",
      description: "This month"
    },
    {
      id: 2,
      label: "Votes Cast",
      value: stats?.votesCast?.toString(),
      icon: "Vote",
      iconColor: "#6366f1",
      bgColor: "bg-indigo-500/10",
      trend: "+12",
      trendDirection: "up",
      description: "Total participation"
    },
    {
      id: 3,
      label: "Verifications",
      value: stats?.verifications?.toString(),
      icon: "ShieldCheck",
      iconColor: "#10b981",
      bgColor: "bg-emerald-500/10",
      trend: "+5",
      trendDirection: "up",
      description: "Blockchain verified"
    },
    {
      id: 4,
      label: "Audit Activities",
      value: stats?.auditActivities?.toString(),
      icon: "FileSearch",
      iconColor: "#f59e0b",
      bgColor: "bg-amber-500/10",
      trend: "+2",
      trendDirection: "up",
      description: "Completed audits"
    }
  ];

  const electionTemplates = [
    {
      id: 1,
      name: "Political Election",
      description: "Standard political voting with ranked choice options and comprehensive audit trails",
      icon: "Vote",
      iconColor: "#a855f7",
      bgColor: "bg-purple-500/10",
      estimatedTime: "15 min setup"
    },
    {
      id: 2,
      name: "Community Poll",
      description: "Quick community decision-making with simple plurality voting and instant results",
      icon: "Users",
      iconColor: "#6366f1",
      bgColor: "bg-indigo-500/10",
      estimatedTime: "5 min setup"
    },
    {
      id: 3,
      name: "Lotterized Election",
      description: "Gamified voting with lottery rewards, prize pools, and automated winner selection",
      icon: "Trophy",
      iconColor: "#f59e0b",
      bgColor: "bg-amber-500/10",
      estimatedTime: "20 min setup"
    }
  ];

  const fallbackRecentDrafts = [
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
    }
  ];

  const fallbackAvailableElections = [
    {
      id: 1,
      title: "Community Budget Allocation 2026",
      description: "Vote on how to allocate $2.5 million in community development funds across infrastructure, education, healthcare, and public safety initiatives for the upcoming fiscal year.",
      coverImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1a0b7563b-1765794380085.png",
      coverImageAlt: "Professional budget planning",
      status: "active",
      category: "political",
      isLotterized: false,
      participants: 8947,
      totalVotes: 8947,
      endDate: "Jan 28, 2026",
      hasVoted: false,
      blockchainHash: "0x7d8f9a2b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a"
    }
  ];

  const handleVote = (electionId) => {
    navigate('/secure-voting-interface', { state: { electionId } });
  };

  const handleVerify = (electionId) => {
    setActiveTab('verify');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'create', label: 'Create', icon: 'Plus' },
    { id: 'vote', label: 'Vote', icon: 'Vote' },
    { id: 'verify', label: 'Verify', icon: 'ShieldCheck' },
    { id: 'audit', label: 'Audit', icon: 'FileSearch' }
  ];

  return (
    <GeneralPageLayout title="Elections Command Center" showSidebar={true}>
      <div className="w-full py-0">
        {/* Premium Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">Command Center</h1>
              <p className="text-muted-foreground font-medium text-sm">Advanced election governance and cryptographic verification</p>
            </div>
          </div>
          
          <button 
            onClick={() => setActiveTab('create')}
            className="px-10 py-4 bg-muted/50 hover:bg-muted text-foreground rounded-2xl border border-border backdrop-blur-xl transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]"
          >
            <Plus className="w-4 h-4 inline-block mr-2" />
            New Election
          </button>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="mb-12 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 bg-muted/30 backdrop-blur-xl rounded-2xl p-1.5 border border-border shadow-inner min-w-max">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${
                  activeTab === tab?.id 
                    ? 'bg-primary/10 text-primary shadow-xl ring-1 ring-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={14} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <DashboardStats stats={dashboardStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="bg-card backdrop-blur-xl p-10 rounded-3xl border border-border shadow-2xl relative overflow-hidden group h-full">
                  <div className="absolute -right-10 -top-10 p-6 opacity-5 group-hover:opacity-10 transition-all duration-700">
                    <Activity size={240} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-foreground mb-10 uppercase tracking-tight relative z-10 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                    Neural Feed Activity
                  </h2>
                  
                  <div className="space-y-6 relative z-10">
                    {[
                      { title: 'Vote verified on blockchain', meta: 'Best Local Restaurant Award • 2 hours ago', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
                      { title: 'New election initialized', meta: 'City Council Member Ward 3 • 1 day ago', icon: Plus, color: 'text-purple-400', bg: 'bg-purple-500/20' },
                      { title: 'Vote cast successfully', meta: 'Community Budget Allocation • 2 days ago', icon: Vote, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all group/item">
                        <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0 border border-border/10 group-hover/item:scale-110 transition-transform duration-500`}>
                          <item.icon size={24} className={item.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-foreground uppercase tracking-widest text-[11px] mb-1">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{item.meta}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover/item:text-foreground group-hover/item:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-card backdrop-blur-xl p-10 rounded-3xl border border-border shadow-2xl h-full flex flex-col">
                  <h2 className="text-2xl font-black text-foreground mb-10 uppercase tracking-tight">Protocol Actions</h2>
                  <div className="space-y-4 flex-1">
                    {[
                      { id: 'create', label: 'Initialize Election', icon: 'Plus', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                      { id: 'vote', label: 'Participate in Network', icon: 'Vote', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                      { id: 'verify', label: 'Verify Cryptographic Proof', icon: 'ShieldCheck', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    ].map((action) => (
                      <button
                        key={action.id}
                        onClick={() => setActiveTab(action.id)}
                        className="w-full flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border hover:border-border/80 hover:bg-muted/50 transition-all group"
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                            <Icon name={action.icon} size={20} className={action.color} />
                          </div>
                          <span className="font-black text-foreground uppercase tracking-widest text-[10px]">{action.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Network Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-black text-foreground uppercase tracking-tight">Mainnet Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <CreateElectionSection
              templates={electionTemplates}
              recentDrafts={recentDraftsData?.length ? recentDraftsData : fallbackRecentDrafts}
            />
          </div>
        )}

        {activeTab === 'vote' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <VoteElectionSection
              elections={availableElectionsData?.length ? availableElectionsData : fallbackAvailableElections}
              onVote={handleVote}
              onVerify={handleVerify}
            />
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <VerifyElectionSection />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <AuditElectionSection />
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default ElectionsDashboard;