import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useNavigate } from 'react-router-dom';
import { suggestedContentService } from '../../../services/suggestedContentService';

const SuggestedContentSidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('elections');
  const [suggestedElections, setSuggestedElections] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [suggestedPages, setSuggestedPages] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [activeTab]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      if (activeTab === 'elections') {
        const { data } = await suggestedContentService?.getSuggestedElections(5);
        setSuggestedElections(data || []);
      } else if (activeTab === 'friends') {
        const { data } = await suggestedContentService?.getSuggestedFriends(5);
        setSuggestedFriends(data || []);
      } else if (activeTab === 'pages') {
        const { data } = await suggestedContentService?.getSuggestedPages(5);
        setSuggestedPages(data || []);
      } else if (activeTab === 'groups') {
        const { data } = await suggestedContentService?.getSuggestedGroups(5);
        setSuggestedGroups(data || []);
      } else if (activeTab === 'events') {
        const { data } = await suggestedContentService?.getSuggestedEvents(5);
        setSuggestedEvents(data || []);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
  { id: 'elections', label: 'Elections', icon: 'Vote' },
  { id: 'friends', label: 'Friends', icon: 'Users' },
  { id: 'pages', label: 'Pages', icon: 'FileText' },
  { id: 'groups', label: 'Groups', icon: 'UsersRound' },
  { id: 'events', label: 'Events', icon: 'Calendar' }];


  const renderElections = () =>
  <div className="space-y-3">
      {suggestedElections?.map((election) =>
    <div
      key={election?.id}
      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
      onClick={() => navigate(`/secure-voting-interface?election=${election?.id}`)}>

          <div className="flex items-start gap-3">
            {election?.coverImage &&
        <Image
          src={election?.coverImage}
          alt={election?.coverImageAlt || 'Election cover'}
          className="w-12 h-12 rounded-lg object-cover" />

        }
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-heading font-semibold text-foreground line-clamp-2 mb-1">
                {election?.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Users" size={16} strokeWidth={2.5} />
                <span>{election?.totalVoters || 0} voters</span>
              </div>
            </div>
          </div>
        </div>
    )}
    </div>;


  const renderFriends = () =>
  <div className="space-y-3">
      {suggestedFriends?.map((friend) =>
    <div
      key={friend?.id}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">

          <Image
        src={friend?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
        alt={`${friend?.name} profile picture`}
        className="w-10 h-10 rounded-full object-cover" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-heading font-semibold text-foreground truncate">
                {friend?.name}
              </h4>
              {friend?.verified && <Icon name="BadgeCheck" size={14} className="text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">@{friend?.username}</p>
          </div>
          <button className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            Add
          </button>
        </div>
    )}
    </div>;


  const renderPages = () =>
  <div className="space-y-3">
      {suggestedPages?.map((page) =>
    <div
      key={page?.id}
      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-heading font-semibold text-foreground">{page?.name}</h4>
              {page?.verified && <Icon name="BadgeCheck" size={14} className="text-primary" />}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Users" size={12} />
              <span>{page?.followers?.toLocaleString()} followers</span>
            </div>
            <button className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              Follow
            </button>
          </div>
        </div>
    )}
    </div>;


  const renderGroups = () =>
  <div className="space-y-3">
      {suggestedGroups?.map((group) =>
    <div
      key={group?.id}
      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">

          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-heading font-semibold text-foreground">{group?.name}</h4>
            {group?.isPrivate && <Icon name="Lock" size={14} className="text-muted-foreground" />}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Users" size={12} />
              <span>{group?.members?.toLocaleString()} members</span>
            </div>
            <button className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              Join
            </button>
          </div>
        </div>
    )}
    </div>;


  const renderEvents = () =>
  <div className="space-y-3">
      {suggestedEvents?.map((event) =>
    <div
      key={event?.id}
      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">

          <h4 className="text-sm font-heading font-semibold text-foreground mb-2">{event?.title}</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Calendar" size={12} />
              <span>{new Date(event?.date)?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Users" size={12} />
              <span>{event?.attendees} attending</span>
            </div>
          </div>
          <button className="w-full mt-2 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            Interested
          </button>
        </div>
    )}
    </div>;


  return (
    <div className="card sticky top-20 px-[22px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
          <Icon name="Sparkles" size={20} className="text-primary" />
          Suggested for You
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
        {tabs?.map((tab) => {
          const isActive = activeTab === tab?.id;
          return (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 text-xs ${
              isActive ?
              'border-primary bg-primary text-primary-foreground' :
              'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'}`
              }>

              <Icon name={tab?.icon} size={14} />
              <span className="font-medium">{tab?.label}</span>
            </button>);

        })}
      </div>

      {/* Content */}
      {loading ?
      <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
        </div> :

      <div>
          {activeTab === 'elections' && renderElections()}
          {activeTab === 'friends' && renderFriends()}
          {activeTab === 'pages' && renderPages()}
          {activeTab === 'groups' && renderGroups()}
          {activeTab === 'events' && renderEvents()}
        </div>
      }

      {/* See All Link */}
      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        See All {tabs?.find((t) => t?.id === activeTab)?.label} →
      </button>
    </div>);

};

export default SuggestedContentSidebar;