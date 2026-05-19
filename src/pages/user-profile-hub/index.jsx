import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import ProfileHeader from './components/ProfileHeader';
import ProfileInfoSection from './components/ProfileInfoSection';
import VotingHistoryCard from './components/VotingHistoryCard';
import AchievementsGrid from './components/AchievementsGrid';
import SettingsSection from './components/SettingsSection';
import CreatePostCard from '../home-feed-dashboard/components/CreatePostCard';
import PostCard from '../home-feed-dashboard/components/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { postsService } from '../../services/postsService';
import { walletService } from '../../services/walletService';

const UserProfileHub = () => {
  const { user, userProfile: currentUserProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('id');
  
  const [targetProfile, setTargetProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !profileId || profileId === user?.id;

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      const effectiveId = profileId || user?.id;
      if (!effectiveId) return;

      try {
        // Load Profile
        if (isOwnProfile && currentUserProfile) {
          setTargetProfile(currentUserProfile);
        } else {
          const { data } = await profileService.getProfile(effectiveId);
          setTargetProfile(data);
        }

        // Load User Posts
        const { data: posts } = await postsService.getAll({ userId: effectiveId });
        setUserPosts(posts || []);

        // Load Wallet if it's the current user's profile
        if (isOwnProfile) {
          const { data: wallet } = await walletService.getUserWallet(effectiveId);
          setWalletData(wallet);
          const { data: txs } = await walletService.getWalletTransactions(effectiveId);
          setTransactions(txs || []);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [profileId, user?.id, currentUserProfile]);

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'about', label: 'About' },
    { id: 'friends', label: 'Friends' },
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Videos' },
    { id: 'wallet', label: '💰 Wallet' },
    { id: 'voting-history', label: '🗳️ Voting History' },
    { id: 'elections', label: '📋 Created Elections' },
    { id: 'achievements', label: '🏅 Badges' },
    { id: 'predictions', label: '🎯 Predictions' },
    { id: 'more', label: 'More' }
  ];

  return (
    <GeneralPageLayout title={targetProfile?.full_name || targetProfile?.name || 'Profile'} showSidebar={false} maxWidth="max-w-[1250px]">
      <div className="w-full pb-10">
        {/* Facebook Style Header */}
        <ProfileHeader 
          user={targetProfile} 
          isOwnProfile={isOwnProfile} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        {/* Main Profile Content Area */}
        <div className="mt-4 px-4 max-w-[1050px] mx-auto">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
              {/* Left Column: Intro, Photos, Friends */}
              <aside className="space-y-4">
                {/* Intro Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-xl font-black mb-4">Intro</h3>
                  <div className="space-y-4">
                    {targetProfile?.bio && (
                      <p className="text-[15px] text-center text-gray-900 dark:text-gray-100">{targetProfile.bio}</p>
                    )}
                    <button className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-bold text-[15px] transition-colors">
                      Edit Bio
                    </button>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Icon name="Briefcase" size={20} />
                        <span className="text-[15px]">Works at <span className="font-bold text-gray-900 dark:text-gray-100">Vottery Platform</span></span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Icon name="GraduationCap" size={20} />
                        <span className="text-[15px]">Studied at <span className="font-bold text-gray-900 dark:text-gray-100">Democracy Institute</span></span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Icon name="Home" size={20} />
                        <span className="text-[15px]">Lives in <span className="font-bold text-gray-900 dark:text-gray-100">{targetProfile?.location || 'The Matrix'}</span></span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Icon name="Clock" size={20} />
                        <span className="text-[15px]">Joined <span className="font-bold text-gray-900 dark:text-gray-100">March 2024</span></span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-bold text-[15px] transition-colors">
                      Edit details
                    </button>
                  </div>
                </div>

                {/* Photos Preview Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black hover:underline cursor-pointer">Photos</h3>
                    <button className="text-vottery-blue font-bold text-[15px] hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded">See All Photos</button>
                  </div>
                  <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                    {[1,2,3,4,5,6,7,8,9].map(i => (
                      <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800">
                        <img src={`https://picsum.photos/seed/${i + 100}/300/300`} className="w-full h-full object-cover" alt="" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Friends Preview Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-black hover:underline cursor-pointer">Friends</h3>
                    <button className="text-vottery-blue font-bold text-[15px] hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded">See All Friends</button>
                  </div>
                  <p className="text-gray-500 text-[15px] mb-4">456 friends</p>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                    {[1,2,3,4,5,6,7,8,9].map(i => (
                      <div key={i} className="space-y-1">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <img src={`https://randomuser.me/api/portraits/${i%2==0?'men':'women'}/${i}.jpg`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <p className="text-[12px] font-bold truncate">Friend Name {i}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Right Column: Feed */}
              <div className="space-y-4">
                {isOwnProfile && (
                  <CreatePostCard user={targetProfile} />
                )}
                
                {/* Posts Feed */}
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
                    <h3 className="text-xl font-black">Posts</h3>
                    <div className="flex gap-2">
                       <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg font-bold text-[15px]">
                         <Icon name="Settings" size={16} /> Filters
                       </button>
                       <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg font-bold text-[15px]">
                         <Icon name="Layout" size={16} /> Manage posts
                       </button>
                    </div>
                  </div>

                  {userPosts.map(post => (
                    <PostCard key={post.id} post={post} currentUser={user} />
                  ))}

                  {userPosts.length === 0 && !loading && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-10 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="FileText" size={32} className="text-gray-400" />
                      </div>
                      <h4 className="text-xl font-black text-gray-500">No posts yet</h4>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 min-h-[400px]">
               <h2 className="text-2xl font-black mb-6">About</h2>
               <ProfileInfoSection user={targetProfile} />
             </div>
          )}

          {activeTab === 'friends' && (
             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 min-h-[400px]">
               <h2 className="text-2xl font-black mb-6">Friends</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                     <div className="flex items-center gap-3">
                        <img src={`https://randomuser.me/api/portraits/thumb/women/${i}.jpg`} className="w-12 h-12 rounded-lg" alt="" />
                        <div>
                          <p className="font-bold">Friend Name {i}</p>
                          <p className="text-xs text-gray-500">12 mutual friends</p>
                        </div>
                     </div>
                     <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                       <Icon name="MoreHorizontal" size={20} />
                     </button>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* ── WALLET TAB ── */}
          {activeTab === 'wallet' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-2xl font-black mb-6">Wallet & Transactions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    label: 'Total Balance',
                    value: walletService.formatCurrency(walletData?.availableBalance || 0),
                    icon: 'DollarSign',
                    color: 'from-emerald-500 to-teal-600'
                  },
                  {
                    label: 'VP Points',
                    value: `${walletData?.vpBalance || 0} VP`,
                    icon: 'Zap',
                    color: 'from-amber-400 to-[#FFC629]'
                  },
                  {
                    label: 'Pending',
                    value: walletService.formatCurrency(walletData?.pendingBalance || 0),
                    icon: 'Clock',
                    color: 'from-blue-500 to-indigo-600'
                  }
                ].map(s => (
                  <div key={s.label} className={`p-4 rounded-2xl bg-gradient-to-br ${s.color} text-white`}>
                    <Icon name={s.icon} size={20} className="mb-2 opacity-80" />
                    <p className="text-[22px] font-black">{s.value}</p>
                    <p className="text-[11px] opacity-80 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-[16px]">Transaction History</h3>
                <button className="text-vottery-blue text-xs font-bold hover:underline">View Statement</button>
              </div>

              <div className="space-y-2">
                {transactions.length > 0 ? (
                  transactions.slice(0, 10).map((t, i) => (
                    <div key={t.id || i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          t.transactionType === 'winning' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Icon name={t.transactionType === 'winning' ? 'Trophy' : 'ArrowRight'} size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-[13px] text-gray-900 dark:text-white line-clamp-1">{t.description}</p>
                          <p className="text-[11px] text-gray-500">{walletService.formatDate(t.createdAt)}</p>
                        </div>
                      </div>
                      <p className={`font-black text-[14px] ${t.transactionType === 'winning' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.transactionType === 'winning' ? '+' : '-'}{walletService.formatCurrency(t.amount)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground italic">
                    No transactions found in this period.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── VOTING HISTORY TAB ── */}
          {activeTab === 'voting-history' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-2xl font-black mb-6">Voting History</h2>
              <div className="space-y-3">
                {[{title:'Best AI Platform 2026',voted:'ChatGPT',date:'May 13',status:'Active',outcome:null},{title:'Climate Action Leader',voted:'Aria Green',date:'May 10',status:'Ended',outcome:'Winner!'},{title:'Tech Leader of the Year',voted:'Maya Lin',date:'May 6',status:'Ended',outcome:null}].map((v,i)=>(
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-bold text-[14px] text-gray-900 dark:text-white">{v.title}</p>
                      <p className="text-[12px] text-gray-500">Voted for: <span className="text-[#0F5FFF] font-bold">{v.voted}</span> · {v.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${v.status==='Active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{v.status}</span>
                      {v.outcome && <p className="text-[11px] text-[#FFC629] font-black mt-1">{v.outcome}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CREATED ELECTIONS TAB ── */}
          {activeTab === 'elections' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-2xl font-black mb-6">Created Elections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{title:'Best AI Platform 2026',participants:'14.2K',status:'Live',prize:'$12,500'},{title:'Community Climate Poll',participants:'3.8K',status:'Draft',prize:null},{title:'Startup Innovation Award',participants:'6.1K',status:'Ended',prize:'$5,000'}].map((e,i)=>(
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-bold text-[14px] text-gray-900 dark:text-white line-clamp-2">{e.title}</p>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-black flex-shrink-0 ${e.status==='Live'?'bg-red-100 text-red-600':e.status==='Draft'?'bg-gray-200 text-gray-600':'bg-blue-100 text-blue-600'}`}>{e.status}</span>
                    </div>
                    <p className="text-[12px] text-gray-500">{e.participants} participants</p>
                    {e.prize && <p className="text-[12px] text-amber-500 font-bold">🏆 {e.prize} prize pool</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BADGES & ACHIEVEMENTS TAB ── */}
          {activeTab === 'achievements' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-2xl font-black mb-2">Badges & Achievements</h2>
              <p className="text-gray-500 text-[13px] mb-6">VP Balance: <span className="text-amber-500 font-black">8,420 VP</span></p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[{emoji:'🥇',name:'First Vote',desc:'Cast your first vote',earned:true},{emoji:'🎯',name:'Accuracy Pro',desc:'95%+ prediction accuracy',earned:true},{emoji:'🔥',name:'Hot Streak',desc:'30-day voting streak',earned:true},{emoji:'👑',name:'Election Creator',desc:'Create 5 elections',earned:true},{emoji:'🌍',name:'Global Voter',desc:'Vote in 10 countries',earned:false},{emoji:'💎',name:'Premium Member',desc:'Active subscription',earned:false}].map((b,i)=>(
                  <div key={i} className={`p-4 rounded-2xl text-center ${b.earned?'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 border-amber-200 dark:border-amber-800':'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-50'} border`}>
                    <div className="text-4xl mb-2">{b.emoji}</div>
                    <p className="font-black text-[12px] text-gray-900 dark:text-white">{b.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PREDICTIONS TAB ── */}
          {activeTab === 'predictions' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-2xl font-black mb-2">Predictions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[{label:'Overall Accuracy',value:'97.3%',icon:'Target'},{label:'Active Streak',value:'42 days',icon:'Zap'},{label:'Brier Score',value:'0.042',icon:'TrendingUp'}].map(s=>(
                  <div key={s.label} className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 text-center">
                    <Icon name={s.icon} size={20} className="text-violet-500 mx-auto mb-2" />
                    <p className="text-[22px] font-black text-violet-600">{s.value}</p>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-black text-[16px] mb-3">Recent Predictions</h3>
              <div className="space-y-2">
                {[{election:'Best AI Platform 2026',prediction:'ChatGPT wins (78%)',result:'Correct ✓',vp:'+120 VP'},{election:'Climate Action Leader',prediction:'Aria Green (65%)',result:'Incorrect ✗',vp:'-30 VP'},{election:'Startup Innovation',prediction:'NovaTech (81%)',result:'Pending…',vp:'TBD'}].map((p,i)=>(
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-bold text-[13px] text-gray-900 dark:text-white">{p.election}</p>
                      <p className="text-[11px] text-gray-500">{p.prediction}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[12px] font-bold ${p.result.includes('Correct')?'text-emerald-500':p.result.includes('Incorrect')?'text-red-500':'text-gray-500'}`}>{p.result}</p>
                      <p className={`text-[11px] font-black ${p.vp.startsWith('+')?'text-emerald-500':p.vp.startsWith('-')?'text-red-500':'text-gray-400'}`}>{p.vp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default UserProfileHub;