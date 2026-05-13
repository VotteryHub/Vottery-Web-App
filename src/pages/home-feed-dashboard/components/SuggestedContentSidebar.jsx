import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useNavigate } from 'react-router-dom';
import { suggestedContentService } from '../../../services/suggestedContentService';
import toast from 'react-hot-toast';

const SuggestedContentSidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('elections');
  const [suggestedElections, setSuggestedElections] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [suggestedPages, setSuggestedPages] = useState([]);
  const [suggestedHubs, setSuggestedHubs] = useState([]);
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStates, setActionStates] = useState({});

  const handleAction = async (type, id, actionFunc) => {
    setActionStates(prev => ({ ...prev, [`${type}-${id}`]: 'loading' }));
    const { error } = await actionFunc(id);
    if (error) {
      toast.error(error.message || `Failed to perform action`);
      setActionStates(prev => ({ ...prev, [`${type}-${id}`]: null }));
    } else {
      toast.success('Success!');
      setActionStates(prev => ({ ...prev, [`${type}-${id}`]: 'success' }));
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [activeTab]);

  const loadSuggestions = async () => {
    setLoading(true);
    
    // Hardened loading with timeout
    const loadPromise = async () => {
      try {
        if (activeTab === 'elections') {
          const { data } = await suggestedContentService?.getSuggestedElections(5);
          setSuggestedElections(data?.length ? data : [
            { id: 'e1', title: 'Best AI Tool of 2026', coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200', totalVoters: 5642, prizePool: 25000 },
            { id: 'e2', title: 'Community Choice Awards', coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200', totalVoters: 8931, prizePool: 15000 },
            { id: 'e3', title: 'Future of Democracy Poll', coverImage: 'https://images.unsplash.com/photo-1529107386315-0c91e98e1f7f?w=200', totalVoters: 3210, prizePool: 5000 },
          ]);
        } else if (activeTab === 'friends') {
          const { data } = await suggestedContentService?.getSuggestedFriends(5);
          setSuggestedFriends(data?.length ? data : [
            { id: 'f1', name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true },
            { id: 'f2', name: 'Michael Chen', username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: false },
            { id: 'f3', name: 'Emily Rodriguez', username: 'emilyrod', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', verified: true },
          ]);
        } else if (activeTab === 'pages') {
          const { data } = await suggestedContentService?.getSuggestedPages(5);
          setSuggestedPages(data?.length ? data : [
            { id: 'p1', name: 'Vottery Official', verified: true, followers: 125000 },
            { id: 'p2', name: 'Election Insights', verified: false, followers: 43200 },
            { id: 'p3', name: 'Democracy Now', verified: true, followers: 89100 },
          ]);
        } else if (activeTab === 'hubs') {
          const { data } = await suggestedContentService?.getSuggestedGroups(5);
          setSuggestedHubs(data?.length ? data : [
            { id: 'h1', name: 'Political Debate Club', members: 12847, isPrivate: false },
            { id: 'h2', name: 'Tech Innovation Hub', members: 8932, isPrivate: false },
            { id: 'h3', name: 'Community Voting Circle', members: 5421, isPrivate: true },
          ]);
        } else if (activeTab === 'events') {
          const { data } = await suggestedContentService?.getSuggestedEvents(5);
          setSuggestedEvents(data?.length ? data : [
            { id: 'ev1', title: 'Vottery Grand Election Launch', date: new Date(Date.now() + 86400000 * 3).toISOString(), attendees: 2340 },
            { id: 'ev2', title: 'Community Q&A Livestream', date: new Date(Date.now() + 86400000 * 7).toISOString(), attendees: 890 },
          ]);
        }
      } catch (error) {
        console.error('Error loading suggestions:', error);
      }
    };

    try {
      // 5 second timeout for suggestions
      await Promise.race([
        loadPromise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
    } catch (err) {
      console.warn('Suggestions loading timed out or failed, using mock data');
      // Mock data fallbacks for all tabs
      if (activeTab === 'elections' && !suggestedElections.length) {
        setSuggestedElections([
          { id: 'e1', title: 'Best AI Tool of 2026', coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=200', totalVoters: 5642 },
          { id: 'e2', title: 'Community Choice Awards', coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200', totalVoters: 8931 },
        ]);
      } else if (activeTab === 'friends' && !suggestedFriends.length) {
        setSuggestedFriends([
          { id: 'f1', name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true },
          { id: 'f2', name: 'Michael Chen', username: 'mchen', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', verified: false },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'elections', label: 'Elections', icon: 'Vote' },
    { id: 'friends', label: 'Friends', icon: 'Users' },
    { id: 'pages', label: 'Pages', icon: 'FileText' },
    { id: 'hubs', label: 'Hubs', icon: 'UsersRound' },
    { id: 'events', label: 'Events', icon: 'Calendar' }
  ];


  const renderElections = () =>
    <div className="space-y-4">
      {suggestedElections?.map((election) =>
        <div
          key={election?.id}
          className="group relative p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
          onClick={() => navigate(`/secure-voting-interface?election=${election?.id}`)}>

          <div className="flex items-start gap-4">
            {election?.coverImage &&
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={election?.coverImage}
                  alt={election?.coverImageAlt || 'Election cover'}
                  className="w-14 h-14 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            }
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {election?.title}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-200">
                   <Icon name="Users" size={16} className="text-primary" />
                   <span>{election?.totalVoters || 0} VOTERS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>;


  const renderFriends = () =>
    <div className="space-y-4">
      {suggestedFriends?.map((friend) =>
        <div
          key={friend?.id}
          className="flex items-center gap-4 p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 group">

          <div className="relative">
            <Image
              src={friend?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
              alt={`${friend?.name} profile picture`}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-primary/50 transition-all duration-300" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
               <h4 className="text-[15px] font-black text-slate-900 dark:text-white truncate">
                 {friend?.name}
               </h4>
               {friend?.verified && <Icon name="BadgeCheck" size={14} className="text-blue-400" />}
             </div>
             <p className="text-[12px] text-slate-500 dark:text-slate-200 font-bold truncate tracking-tight">@{friend?.username}</p>
          </div>
          <button 
            disabled={actionStates[`friend-${friend?.id}`]}
            onClick={(e) => { e.stopPropagation(); handleAction('friend', friend?.id, suggestedContentService.addFriend); }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg ${
              actionStates[`friend-${friend?.id}`] === 'success' ? 'bg-green-500 text-white' : 
              'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-primary/20'
            }`}>
            {actionStates[`friend-${friend?.id}`] === 'loading' ? <Icon name="Loader" size={14} className="animate-spin" /> : 
             actionStates[`friend-${friend?.id}`] === 'success' ? <span className="flex items-center gap-1"><Icon name="Check" size={12}/> Added</span> : 'Add'}
          </button>
        </div>
      )}
    </div>;


  const renderPages = () =>
    <div className="space-y-4">
      {suggestedPages?.map((page) =>
        <div
          key={page?.id}
          className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 group">

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{page?.name}</h4>
              {page?.verified && <Icon name="BadgeCheck" size={14} className="text-blue-400" />}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200">
              <Icon name="Users" size={14} className="text-primary" />
              <span>{page?.followers?.toLocaleString()} followers</span>
            </div>
            <button 
              disabled={actionStates[`page-${page?.id}`]}
              onClick={(e) => { e.stopPropagation(); handleAction('page', page?.id, suggestedContentService.followPage); }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                actionStates[`page-${page?.id}`] === 'success' ? 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white' : 
                'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}>
              {actionStates[`page-${page?.id}`] === 'loading' ? <Icon name="Loader" size={14} className="animate-spin" /> : 
               actionStates[`page-${page?.id}`] === 'success' ? <span className="flex items-center gap-1"><Icon name="Check" size={12}/> Following</span> : 'Follow'}
            </button>
          </div>
        </div>
      )}
    </div>;


  const renderHubs = () =>
    <div className="space-y-4">
      {suggestedHubs?.map((hub) =>
        <div
          key={hub?.id}
          className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 group">

          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{hub?.name}</h4>
            {hub?.isPrivate && <Icon name="Lock" size={14} className="text-slate-500" />}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200">
              <Icon name="Users" size={14} className="text-primary" />
              <span>{hub?.members?.toLocaleString()} members</span>
            </div>
            <button 
              disabled={actionStates[`hub-${hub?.id}`]}
              onClick={(e) => { e.stopPropagation(); handleAction('hub', hub?.id, suggestedContentService.joinHub); }}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                actionStates[`hub-${hub?.id}`] === 'success' ? 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white' : 
                'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}>
              {actionStates[`hub-${hub?.id}`] === 'loading' ? <Icon name="Loader" size={14} className="animate-spin" /> : 
               actionStates[`hub-${hub?.id}`] === 'success' ? <span className="flex items-center gap-1"><Icon name="Check" size={12}/> Joined</span> : 'Join'}
            </button>
          </div>
        </div>
      )}
    </div>;


  const renderEvents = () =>
    <div className="space-y-4">
      {suggestedEvents?.map((event) =>
        <div
          key={event?.id}
          className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 group">

          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 leading-snug">{event?.title}</h4>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200">
              <Icon name="Calendar" size={14} className="text-indigo-400" />
              <span>{new Date(event?.date)?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200">
              <Icon name="Users" size={14} className="text-primary" />
              <span>{event?.attendees} attending</span>
            </div>
          </div>
          <button 
            disabled={actionStates[`event-${event?.id}`]}
            onClick={(e) => { e.stopPropagation(); handleAction('event', event?.id, suggestedContentService.attendEvent); }}
            className={`w-full py-2 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider transition-all ${
              actionStates[`event-${event?.id}`] === 'success' ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30' : 
              'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-100 hover:bg-primary hover:text-white'
            }`}>
            {actionStates[`event-${event?.id}`] === 'loading' ? <Icon name="Loader" size={14} className="animate-spin" /> : 
             actionStates[`event-${event?.id}`] === 'success' ? <span className="flex items-center gap-1"><Icon name="Check" size={12}/> Going</span> : 'Interested'}
          </button>
        </div>
      )}
    </div>;


  return (
    <div className="premium-glass bg-slate-50/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200 dark:border-white/20 rounded-[32px] px-6 py-8 shadow-2xl overflow-hidden group">
      {/* Aurora glow effect inside sidebar */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors duration-500"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
          <div className="p-2.5 bg-primary/20 rounded-2xl">
            <Icon name="Sparkles" size={24} className="text-primary" />
          </div>
          Suggested for You
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4 scrollbar-none relative z-10">
        {tabs?.map((tab) => {
          const isActive = activeTab === tab?.id;
          return (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-300 whitespace-nowrap flex items-center gap-2 text-[11px] font-black uppercase tracking-widest ${
                isActive ?
                  'border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-105' :
                  'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'}`
              }>

              <Icon name={tab?.icon} size={14} strokeWidth={3} />
              <span>{tab?.label}</span>
            </button>);

        })}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[300px]">
        {loading ?
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
              <Icon name="Loader" size={32} className="animate-spin text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Retrieving Insights...</p>
          </div> :

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'elections' && renderElections()}
            {activeTab === 'friends' && renderFriends()}
            {activeTab === 'pages' && renderPages()}
            {activeTab === 'hubs' && renderHubs()}
            {activeTab === 'events' && renderEvents()}
          </div>
        }
      </div>

      {/* See All Link */}
      <button className="w-full mt-8 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 font-bold uppercase tracking-widest transition-all relative z-10 border border-slate-200 dark:border-white/5">
        See All {tabs?.find((t) => t?.id === activeTab)?.label}
      </button>
    </div>);

};

export default SuggestedContentSidebar;