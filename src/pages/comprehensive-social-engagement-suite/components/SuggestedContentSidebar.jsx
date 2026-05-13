import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { suggestedContentService } from '../../../services/suggestedContentService';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SuggestedContentSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('elections');
  const [suggestions, setSuggestions] = useState({
    elections: [],
    friends: [],
    pages: [],
    groups: [],
    events: []
  });
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
    try {
      const { data, error } = await suggestedContentService?.getSuggestions(activeTab);
      if (error) throw error;
      setSuggestions(prev => ({ ...prev, [activeTab]: data || [] }));
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'elections', label: 'Elections', icon: 'Vote' },
    { id: 'friends', label: 'Friends', icon: 'Users' },
    { id: 'pages', label: 'Pages', icon: 'FileText' },
    { id: 'groups', label: 'Groups', icon: 'Users' },
    { id: 'events', label: 'Events', icon: 'Calendar' }
  ];

  const tabs = [
    { id: 'elections', label: 'Elections', icon: 'Vote' },
    { id: 'friends', label: 'Friends', icon: 'Users' },
    { id: 'pages', label: 'Pages', icon: 'FileText' },
    { id: 'groups', label: 'Groups', icon: 'Users' },
    { id: 'events', label: 'Events', icon: 'Calendar' }
  ];

  const renderElections = () => (
    <div className="space-y-3">
      {suggestions?.elections?.slice(0, 5)?.map((election) => (
        <div key={election?.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-all cursor-pointer"
          onClick={() => navigate(`/secure-voting-interface?election=${election?.id}`)}
        >
          <div className="flex items-start gap-3">
            {election?.coverImage && (
              <img 
                src={election?.coverImage} 
                alt={election?.coverImageAlt || 'Election cover'}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground line-clamp-1">{election?.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {election?.votingType} • {election?.totalVoters || 0} voters
              </p>
              {election?.isLotterized && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="Gift" size={12} className="text-accent" />
                  <span className="text-xs text-accent font-medium">{election?.prizePool}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFriends = () => (
    <div className="space-y-3">
      {suggestions?.friends?.slice(0, 5)?.map((friend) => (
        <div key={friend?.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-all">
          <img 
            src={friend?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'} 
            alt={`${friend?.name} avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">{friend?.name}</h4>
            <p className="text-xs text-muted-foreground">@{friend?.username}</p>
            {friend?.mutualFriends > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {friend?.mutualFriends} mutual friends
              </p>
            )}
          </div>
          <button
            disabled={actionStates[`friend-${friend?.id}`]}
            onClick={(e) => { e.stopPropagation(); handleAction('friend', friend?.id, suggestedContentService.addFriend); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              actionStates[`friend-${friend?.id}`] === 'success' ? 'bg-green-500 text-white' : 
              'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {actionStates[`friend-${friend?.id}`] === 'loading' ? <Icon name="Loader" size={12} className="animate-spin" /> : 
             actionStates[`friend-${friend?.id}`] === 'success' ? <span className="flex items-center gap-1"><Icon name="Check" size={12}/> Added</span> : 'Add'}
          </button>
        </div>
      ))}
    </div>
  );

  const renderPages = () => (
    <div className="space-y-3">
      {suggestions?.pages?.slice(0, 5)?.map((page) => (
        <div key={page?.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">{page?.name}</h4>
            <p className="text-xs text-muted-foreground">{page?.category}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {page?.followers?.toLocaleString()} followers
            </p>
          </div>
          <button
            disabled={actionStates[`page-${page?.id}`]}
            onClick={(e) => { e.stopPropagation(); handleAction('page', page?.id, suggestedContentService.followPage); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              actionStates[`page-${page?.id}`] === 'success' ? 'bg-muted text-foreground' : 
              'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {actionStates[`page-${page?.id}`] === 'loading' ? <Icon name="Loader" size={12} className="animate-spin" /> : 
             actionStates[`page-${page?.id}`] === 'success' ? <span className="flex items-center gap-1"><Icon name="Check" size={12}/> Following</span> : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  );

  const renderGroups = () => (
    <div className="space-y-3">
      {suggestions?.groups?.slice(0, 5)?.map((group) => (
        <div key={group?.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-all">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Icon name="Users" size={20} className="text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">{group?.name}</h4>
            <p className="text-xs text-muted-foreground">{group?.privacy}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {group?.members?.toLocaleString()} members
            </p>
          </div>
          <button
            disabled={actionStates[`group-${group?.id}`]}
            onClick={(e) => { e.stopPropagation(); handleAction('group', group?.id, suggestedContentService.joinHub); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              actionStates[`group-${group?.id}`] === 'success' ? 'bg-muted text-foreground' : 
              'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {actionStates[`group-${group?.id}`] === 'loading' ? <Icon name="Loader" size={12} className="animate-spin" /> : 
             actionStates[`group-${group?.id}`] === 'success' ? <span className="flex items-center gap-1"><Icon name="Check" size={12}/> Joined</span> : 'Join'}
          </button>
        </div>
      ))}
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-3">
      {suggestions?.events?.slice(0, 5)?.map((event) => (
        <div key={event?.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-accent">{new Date(event?.date)?.getDate()}</span>
              <span className="text-[10px] text-accent">{new Date(event?.date)?.toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground line-clamp-1">{event?.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{event?.location}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {event?.interested?.toLocaleString()} interested
              </p>
            </div>
          </div>
          <button
            disabled={actionStates[`event-${event?.id}`]}
            onClick={(e) => { e.stopPropagation(); handleAction('event', event?.id, suggestedContentService.attendEvent); }}
            className={`w-full mt-2 px-3 py-1 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
              actionStates[`event-${event?.id}`] === 'success' ? 'bg-green-500/20 text-green-600' : 
              'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {actionStates[`event-${event?.id}`] === 'loading' ? <Icon name="Loader" size={12} className="animate-spin" /> : 
             actionStates[`event-${event?.id}`] === 'success' ? <span className="flex items-center gap-1"><Icon name="Check" size={12}/> Going</span> : 'Interested'}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="card p-4">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Sparkles" size={20} className="text-primary" />
        Suggested for You
      </h3>

      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={tab?.icon} size={14} className="inline mr-1" />
            {tab?.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {activeTab === 'elections' && renderElections()}
          {activeTab === 'friends' && renderFriends()}
          {activeTab === 'pages' && renderPages()}
          {activeTab === 'groups' && renderGroups()}
          {activeTab === 'events' && renderEvents()}
        </div>
      )}
    </div>
  );
};

export default SuggestedContentSidebar;