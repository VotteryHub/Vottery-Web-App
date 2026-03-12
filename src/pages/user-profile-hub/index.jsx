import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import ProfileHeader from './components/ProfileHeader';
import VotingHistoryCard from './components/VotingHistoryCard';
import AchievementsGrid from './components/AchievementsGrid';
import SettingsSection from './components/SettingsSection';
import ProfileInfoSection from './components/ProfileInfoSection';
import PlatformGamificationWidget from '../../components/PlatformGamificationWidget';

import { votesService } from '../../services/votesService';
import { useAuth } from '../../contexts/AuthContext';

const UserProfileHub = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadVotingHistory();
    }
  }, [user]);

  const loadVotingHistory = async () => {
    try {
      const { data } = await votesService?.getUserVotes(user?.id);
      setVotingHistory(data || []);
    } catch (error) {
      console.error('Failed to load voting history:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockUser = {
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@vottery.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    dateOfBirth: "January 15, 1990",
    occupation: "Software Engineer",
    website: "https://johndoe.com",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d90a96ad-1763299909299.png",
    avatarAlt: "Professional headshot of John Doe, a man with short brown hair wearing a navy blue suit and white shirt, smiling confidently against a neutral gray background",
    bio: "Passionate about democratic participation and blockchain technology. Advocate for transparent voting systems and civic engagement. Building a better future through technology and community involvement.",
    verified: true,
    joinDate: "March 2024",
    stats: {
      votes: 127,
      elections: 23,
      friends: 456,
      groups: 12
    },
    interests: ["Politics", "Technology", "Blockchain", "Democracy", "Social Justice", "Environment"],
    languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Intermediate" },
    { name: "French", proficiency: "Beginner" }]

  };

  const mockVotingHistory = [
  {
    id: 1,
    electionTitle: "2026 Presidential Election Primary",
    electionImage: "https://images.unsplash.com/photo-1589901304167-bedd700a80c6",
    electionImageAlt: "American flag waving proudly against clear blue sky with sunlight creating dramatic lighting and patriotic atmosphere",
    date: "January 15, 2026",
    time: "10:30 AM",
    category: "National",
    voteId: "VT-2026-001-XY7K",
    blockchainHash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
    status: "verified",
    lotteryTicket: "LT-2026-001-4892",
    prizeWon: false
  },
  {
    id: 2,
    electionTitle: "City Council District 5 Representative",
    electionImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1de19c487-1772282853397.png",
    electionImageAlt: "Close-up of diverse hands placing voting ballots into transparent ballot box, symbolizing democratic participation and civic duty",
    date: "January 10, 2026",
    time: "2:15 PM",
    category: "Local",
    voteId: "VT-2026-002-AB3M",
    blockchainHash: "0x3c2c2eb7b11a91385fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7",
    status: "verified",
    lotteryTicket: "LT-2026-002-7621",
    prizeWon: true,
    prizeAmount: 50
  },
  {
    id: 3,
    electionTitle: "State Education Budget Referendum",
    electionImage: "https://img.rocket.new/generatedImages/rocket_gen_img_101336450-1772141567927.png",
    electionImageAlt: "Modern classroom with students raising hands enthusiastically, bright natural lighting streaming through large windows, representing education and learning",
    date: "January 5, 2026",
    time: "9:45 AM",
    category: "State",
    voteId: "VT-2026-003-CD9P",
    blockchainHash: "0x91385fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a9",
    status: "verified",
    lotteryTicket: "LT-2026-003-3456",
    prizeWon: false
  },
  {
    id: 4,
    electionTitle: "Community Park Development Initiative",
    electionImage: "https://images.unsplash.com/photo-1596441414923-220982c3a1b2",
    electionImageAlt: "Beautiful green park with children playing on modern playground equipment, families relaxing on grass, surrounded by tall trees and colorful flowers",
    date: "December 28, 2025",
    time: "4:20 PM",
    category: "Local",
    voteId: "VT-2025-004-EF2Q",
    blockchainHash: "0xead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385fade1c0d57a7af66ab4e",
    status: "pending",
    lotteryTicket: "LT-2025-004-8901",
    prizeWon: false
  }];


  const mockAchievements = [
  {
    id: 1,
    name: "First Vote",
    description: "Cast your first vote on Vottery",
    icon: "Vote",
    rarity: "common",
    unlocked: true,
    unlockedDate: "March 15, 2024",
    progress: 100
  },
  {
    id: 2,
    name: "Democracy Champion",
    description: "Vote in 100 elections",
    icon: "Trophy",
    rarity: "legendary",
    unlocked: true,
    unlockedDate: "January 10, 2026",
    progress: 100
  },
  {
    id: 3,
    name: "Verified Voter",
    description: "Verify your first vote on the blockchain",
    icon: "ShieldCheck",
    rarity: "rare",
    unlocked: true,
    unlockedDate: "March 20, 2024",
    progress: 100
  },
  {
    id: 4,
    name: "Election Creator",
    description: "Create your first election",
    icon: "PlusCircle",
    rarity: "rare",
    unlocked: true,
    unlockedDate: "April 5, 2024",
    progress: 100
  },
  {
    id: 5,
    name: "Lottery Winner",
    description: "Win a prize in a lotterized election",
    icon: "Ticket",
    rarity: "epic",
    unlocked: true,
    unlockedDate: "January 10, 2026",
    progress: 100
  },
  {
    id: 6,
    name: "Streak Master",
    description: "Vote for 30 consecutive days",
    icon: "Flame",
    rarity: "epic",
    unlocked: false,
    progress: 67
  },
  {
    id: 7,
    name: "Community Leader",
    description: "Create 50 elections",
    icon: "Users",
    rarity: "legendary",
    unlocked: false,
    progress: 46
  },
  {
    id: 8,
    name: "Blockchain Explorer",
    description: "Audit 25 elections",
    icon: "FileSearch",
    rarity: "rare",
    unlocked: false,
    progress: 32
  },
  {
    id: 9,
    name: "Social Butterfly",
    description: "Connect with 500 friends",
    icon: "Heart",
    rarity: "epic",
    unlocked: false,
    progress: 91
  },
  {
    id: 10,
    name: "Early Adopter",
    description: "Join Vottery in its first year",
    icon: "Star",
    rarity: "legendary",
    unlocked: true,
    unlockedDate: "March 10, 2024",
    progress: 100
  },
  {
    id: 11,
    name: "Engagement Pro",
    description: "Receive 1000 likes on your posts",
    icon: "ThumbsUp",
    rarity: "rare",
    unlocked: false,
    progress: 78
  },
  {
    id: 12,
    name: "Transparency Advocate",
    description: "Verify 50 votes",
    icon: "Eye",
    rarity: "epic",
    unlocked: false,
    progress: 54
  }];


  const mockSettings = {
    twoFactorEnabled: true,
    publicProfile: true,
    showVotingHistory: false,
    allowFriendRequests: true,
    emailNotifications: true,
    pushNotifications: true,
    notifyElections: true,
    notifyVotingReminders: true,
    notifyResults: true,
    notifyLottery: true,
    notifySocial: true,
    theme: "system",
    reduceMotion: false,
    highContrast: false,
    language: "en",
    timezone: "est",
    dateFormat: "MM/DD/YYYY",
    publicKey: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385fade1c0d57a7af66ab4ead7",
    keyFingerprint: "A3:B7:C9:D2:E5:F8:11:24:37:4A:5D:70:83:96:A9:BC",
    activeSessions: [
    {
      id: 1,
      device: "desktop",
      location: "San Francisco, CA",
      lastActive: "Just now",
      current: true
    },
    {
      id: 2,
      device: "mobile",
      location: "San Francisco, CA",
      lastActive: "2 hours ago",
      current: false
    }]

  };

  const tabs = [
  { id: 'info', label: 'Profile Info', icon: 'User' },
  { id: 'history', label: 'Voting History', icon: 'History' },
  { id: 'achievements', label: 'Achievements', icon: 'Trophy' },
  { id: 'settings', label: 'Settings', icon: 'Settings' }];


  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleAvatarChange = () => {
    console.log('Avatar change clicked');
  };

  const handleSettingsChange = (newSettings) => {
    console.log('Settings changed:', newSettings);
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Vottery</title>
        <meta
          name="description"
          content="Manage your Vottery profile, view voting history, achievements, and customize your account settings" />

      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <ProfileHeader
            user={userProfile}
            onEditProfile={handleEditProfile}
            onAvatarChange={handleAvatarChange} />

          {/* Platform Gamification Badge */}
          <div className="mt-4">
            <PlatformGamificationWidget compact={true} />
          </div>

          <div className="mt-6 md:mt-8 lg:mt-12">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="border-b border-border overflow-x-auto">
                <div className="flex min-w-max">
                  {tabs?.map((tab) =>
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 md:px-6 lg:px-8 py-3 md:py-4 font-medium transition-all duration-250 border-b-2 flex-shrink-0 ${
                    activeTab === tab?.id ?
                    'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`
                    }>

                      <Icon name={tab?.icon} size={18} />
                      <span className="text-sm md:text-base">{tab?.label}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 md:p-6 lg:p-8">
                {activeTab === 'info' && <ProfileInfoSection user={userProfile} />}

                {activeTab === 'history' &&
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
                          Voting History
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Your encrypted voting participation records
                        </p>
                      </div>
                      <div className="crypto-indicator">
                        <Icon name="Lock" size={14} />
                        <span className="text-xs">Private</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {loading ?
                    <div className="text-center py-8">
                          <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto" />
                        </div> :
                    votingHistory?.length === 0 ?
                    <div className="card p-8 text-center">
                          <Icon name="Vote" size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                          <p className="text-muted-foreground">No voting history yet</p>
                        </div> :

                    votingHistory?.map((vote) =>
                    <VotingHistoryCard key={vote?.id} vote={vote} />
                    )
                    }
                    </div>
                  </div>
                }

                {activeTab === 'achievements' &&
                <AchievementsGrid achievements={mockAchievements} stats={userProfile?.stats} />
                }

                {activeTab === 'settings' && <SettingsSection user={userProfile} settings={mockSettings} onSettingsChange={handleSettingsChange} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);

};

export default UserProfileHub;