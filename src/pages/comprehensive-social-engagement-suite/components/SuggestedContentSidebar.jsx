import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { suggestedContentService } from '../../../services/suggestedContentService';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  const handleFollow = async (itemId, type) => {
    await suggestedContentService?.follow(itemId, type);
    loadSuggestions();
  };

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
            onClick={() => handleFollow(friend?.id, 'friend')}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all"
          >
            Add
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
            onClick={() => handleFollow(page?.id, 'page')}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all"
          >
            Follow
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
            onClick={() => handleFollow(group?.id, 'group')}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all"
          >
            Join
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
            onClick={() => handleFollow(event?.id, 'event')}
            className="w-full mt-2 px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all"
          >
            Interested
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