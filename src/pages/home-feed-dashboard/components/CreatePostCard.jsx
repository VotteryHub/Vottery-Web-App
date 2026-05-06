import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { ROLES } from '../../../constants/roles';

const CONTENT_TYPES = [
  { id: 'post', label: 'Post', icon: 'FileText', description: 'Share thoughts or updates', vpEarning: 5 },
  { id: 'moment', label: 'Moment', icon: 'Clock', description: 'Ephemeral 24h story', vpEarning: 3 },
  { id: 'jolts', label: 'Jolts', icon: 'Zap', description: 'Short-form video', vpEarning: 15 },
  { id: 'live', label: 'Live', icon: 'Radio', description: 'Start a live broadcast', vpEarning: 25 }
];

const FEELINGS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'excited', label: 'Excited', emoji: '🤩' },
  { id: 'loved', label: 'Loved', emoji: '🥰' },
  { id: 'blessed', label: 'Blessed', emoji: '😇' },
  { id: 'traveling', label: 'Traveling', emoji: '✈️' },
  { id: 'eating', label: 'Eating', emoji: '😋' },
  { id: 'watching', label: 'Watching', emoji: '📺' },
  { id: 'listening', label: 'Listening to', emoji: '🎧' },
  { id: 'playing', label: 'Playing', emoji: '🎮' },
  { id: 'reading', label: 'Reading', emoji: '📖' }
];

const CreatePostCard = ({ user, onCreatePost, autoOpen = false }) => {
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showFullComposer, setShowFullComposer] = useState(autoOpen);
  const [selectedType, setSelectedType] = useState(CONTENT_TYPES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionResults, setMentionResults] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);
  
  // New state for Brand/Agency requirements
  const [activeElections, setActiveElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [loadingElections, setLoadingElections] = useState(false);

  const isRestrictedRole = user?.role === ROLES.ADVERTISER || user?.role === ROLES.MANAGER || user?.role === 'brand' || user?.role === 'agency';

  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch elections if role is restricted
  useEffect(() => {
    if (showFullComposer && isRestrictedRole) {
      fetchActiveElections();
    }
  }, [showFullComposer, isRestrictedRole]);

  const fetchActiveElections = async () => {
    setLoadingElections(true);
    const { data } = await electionsService?.getAll({ status: 'active' });
    setActiveElections(data || []);
    setLoadingElections(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(e?.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleContentChange = (e) => {
    const value = e?.target?.value;
    setPostContent(value);
    const pos = e?.target?.selectionStart;
    setCursorPos(pos);

    // Detect @mention
    const textBefore = value?.slice(0, pos);
    const mentionMatch = textBefore?.match(/@(\w*)$/);
    if (mentionMatch) {
      const query = mentionMatch?.[1];
      setMentionQuery(query);
      setShowMentions(true);
      // Mock user search results
      setMentionResults([
        { id: 1, name: 'Alice Johnson', username: 'alicej', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: 2, name: 'Bob Smith', username: 'bobsmith', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { id: 3, name: 'Carol White', username: 'carolw', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' }
      ]?.filter(u => u?.username?.toLowerCase()?.includes(query?.toLowerCase()) || u?.name?.toLowerCase()?.includes(query?.toLowerCase())));
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (username) => {
    const textBefore = postContent?.slice(0, cursorPos);
    const textAfter = postContent?.slice(cursorPos);
    const newText = textBefore?.replace(/@\w*$/, `@${username} `) + textAfter;
    setPostContent(newText);
    setShowMentions(false);
    textareaRef?.current?.focus();
  };

  const applyFormatting = (format) => {
    const textarea = textareaRef?.current;
    if (!textarea) return;
    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const selected = postContent?.slice(start, end);
    let formatted = '';
    if (format === 'bold') formatted = `**${selected || 'bold text'}**`;
    else if (format === 'italic') formatted = `_${selected || 'italic text'}_`;
    else if (format === 'link') formatted = `[${selected || 'link text'}](url)`;
    const newContent = postContent?.slice(0, start) + formatted + postContent?.slice(end);
    setPostContent(newContent);
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview({
          url: reader.result,
          type: file.type.startsWith('video') ? 'video' : 'image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!postContent?.trim()) return;
    
    if (isRestrictedRole && !selectedElectionId) {
      alert('Brand and Agency accounts must link their posts to an active election or campaign.');
      return;
    }

    setIsPosting(true);
    try {
      await onCreatePost?.({
        content: postContent,
        type: selectedType.id,
        feeling: selectedFeeling,
        media: selectedFile,
        electionId: selectedElectionId
      });
      setPostContent('');
      setSelectedFile(null);
      setFilePreview(null);
      setSelectedFeeling(null);
      setSelectedElectionId('');
      setShowFullComposer(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="premium-glass premium-card w-full max-w-xl mx-auto mb-8 relative z-10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg flex-shrink-0 premium-avatar uppercase shadow-lg ring-2 ring-white/10">
          {(user?.name || user?.full_name || user?.username || user?.email || 'U').charAt(0)}
        </div>
        <button
          onClick={() => setShowFullComposer(true)}
          className="flex-1 h-12 rounded-full bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-left text-muted-foreground transition-all duration-300 text-sm md:text-base px-6 border border-transparent hover:border-primary/20"
        >
          What's on your mind, {user?.full_name?.split(' ')?.[0] || 'User'}?
        </button>
        <div className="hidden sm:flex items-center gap-1 md:gap-2">
          <button 
            type="button" 
            onClick={() => { setShowFullComposer(true); setTimeout(() => fileInputRef.current?.click(), 100); }} 
            className="p-2 rounded-lg hover:bg-muted transition-colors" 
            title="Live Video"
          >
            <Icon name="Video" size={20} className="text-red-500" />
          </button>
          <button 
            type="button" 
            onClick={() => { setShowFullComposer(true); setTimeout(() => fileInputRef.current?.click(), 100); }} 
            className="p-2 rounded-lg hover:bg-muted transition-colors" 
            title="Photo/Video"
          >
            <Icon name="Image" size={20} className="text-green-500" />
          </button>
          <button 
            type="button" 
            onClick={() => { setShowFullComposer(true); setTimeout(() => setShowFeelingPicker(true), 100); }} 
            className="p-2 rounded-lg hover:bg-muted transition-colors" 
            title="Feeling/Activity"
          >
            <Icon name="Smile" size={20} className="text-pink-500" />
          </button>
        </div>
      </div>
      
      {/* Mobile-only icons row */}
      <div className="sm:hidden flex items-center justify-around mt-3 pt-3 border-t border-border">
        <button onClick={() => { setShowFullComposer(true); setTimeout(() => fileInputRef.current?.click(), 100); }} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon name="Video" size={18} className="text-red-500" />
          Video
        </button>
        <button onClick={() => { setShowFullComposer(true); setTimeout(() => fileInputRef.current?.click(), 100); }} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon name="Image" size={18} className="text-green-500" />
          Photo
        </button>
        <button onClick={() => { setShowFullComposer(true); setTimeout(() => setShowFeelingPicker(true), 100); }} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon name="Smile" size={18} className="text-pink-500" />
          Feeling
        </button>
      </div>

      <input 
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      {/* Full Composer Modal */}
      {showFullComposer && createPortal(
        <div 
          className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-[9999] sm:p-4 animate-in fade-in duration-200 backdrop-blur-md"
          onClick={() => !isPosting && setShowFullComposer(false)}
        >
          <div
            className="premium-glass w-full sm:max-w-xl h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 ring-1 ring-white/20"
            onClick={(e) => e.stopPropagation()}
            style={{ backdropFilter: 'blur(30px)' }}
          >
            {/* Header with Content Type Dropdown */}
            <div className="sticky top-0 !bg-white dark:!bg-slate-900 border-b border-border p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => !isPosting && setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-foreground border border-transparent hover:border-border"
                    disabled={isPosting}
                  >
                    <Icon name={selectedType?.icon} size={16} className="text-primary" />
                    {selectedType?.label}
                    <Icon name="ChevronDown" size={14} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-border rounded-xl shadow-xl py-2 z-20 animate-in fade-in zoom-in duration-100">
                      {CONTENT_TYPES?.map((type) => (
                        <button
                          key={type?.id}
                          type="button"
                          onClick={() => {
                            setSelectedType(type);
                            setShowDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors ${selectedType?.id === type?.id ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                        >
                          <Icon name={type?.icon} size={16} />
                          <div className="text-left">
                            <p className="font-medium">{type?.label}</p>
                            <p className="text-[10px] text-muted-foreground opacity-70">{type?.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{user?.full_name || user?.username || user?.email?.split('@')?.[0] || 'User'}</span>
                    {selectedFeeling && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        is feeling {selectedFeeling.emoji} <span className="font-medium text-foreground">{selectedFeeling.label}</span>
                        <button 
                          onClick={() => setSelectedFeeling(null)}
                          className="p-0.5 hover:bg-muted rounded-full transition-colors"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Public</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !isPosting && setShowFullComposer(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                disabled={isPosting}
              >
                <Icon name="X" size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
              <form onSubmit={handleSubmit} className="p-4 flex flex-col h-full">
                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-1 mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border/40">
                  <button type="button" onClick={() => applyFormatting('bold')} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Bold">
                    <Icon name="Bold" size={16} className="text-foreground" />
                  </button>
                  <button type="button" onClick={() => applyFormatting('italic')} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Italic">
                    <Icon name="Italic" size={16} className="text-foreground" />
                  </button>
                  <button type="button" onClick={() => applyFormatting('link')} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Link">
                    <Icon name="Link" size={16} className="text-foreground" />
                  </button>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
                  <span className="text-xs text-muted-foreground font-medium">Use @mention to tag users</span>
                </div>

                {/* Textarea with @mention */}
                <div className="relative flex-1 flex flex-col">
                  <textarea
                    ref={textareaRef}
                    value={postContent}
                    onChange={handleContentChange}
                    placeholder={`What's on your mind? Use @ to mention someone...`}
                    className="w-full h-full min-h-[160px] p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/30 focus:outline-none resize-none text-foreground text-lg placeholder:text-muted-foreground/60 transition-all duration-300"
                    disabled={isPosting}
                    autoFocus
                  />
                  {/* @mention autocomplete */}
                  {showMentions && mentionResults?.length > 0 && (
                    <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-800 border border-border rounded-xl shadow-2xl z-20 w-72 max-h-60 overflow-y-auto divide-y divide-border">
                      {mentionResults?.map(u => (
                        <button
                          key={u?.id}
                          type="button"
                          onClick={() => insertMention(u?.username)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                        >
                          <img src={u?.avatar} alt={`${u?.name} profile`} className="w-10 h-10 rounded-full object-cover border border-border" />
                          <div className="text-left">
                            <p className="text-sm font-semibold text-foreground">{u?.name}</p>
                            <p className="text-xs text-muted-foreground">@{u?.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* File Preview */}
                {filePreview && (
                  <div className="mt-4 relative group rounded-2xl overflow-hidden border border-border shadow-lg max-h-[300px] bg-black/5 dark:bg-white/5">
                    {filePreview.type === 'image' ? (
                      <img src={filePreview.url} alt="Upload preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={filePreview.url} className="w-full h-full object-cover" controls />
                    )}
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all shadow-lg z-10"
                    >
                      <Icon name="X" size={18} />
                    </button>
                  </div>
                )}

                {/* Brand/Agency Restricted Fields */}
                {isRestrictedRole && (
                  <div className="mt-4 p-4 !bg-purple-50 dark:!bg-purple-900/40 rounded-2xl border-2 border-purple-100 dark:border-purple-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Target" size={18} className="text-purple-600 dark:text-purple-400" />
                      <p className="text-sm font-bold text-purple-900 dark:text-purple-100">Campaign Attribution</p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        {user.role === 'brand' || user.role === ROLES.ADVERTISER ? 'As a Brand' : 'As an Agency'}, you must link this post to an active campaign.
                      </p>
                      
                      {loadingElections ? (
                        <div className="flex items-center gap-2 text-xs text-purple-600">
                          <Icon name="Loader" size={14} className="animate-spin" />
                          <span>Fetching active elections...</span>
                        </div>
                      ) : (
                        <select
                          value={selectedElectionId}
                          onChange={(e) => setSelectedElectionId(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">Select an Active Election</option>
                          {activeElections.map(election => (
                            <option key={election.id} value={election.id}>
                              {election.title}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {!selectedElectionId && (
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                          <Icon name="AlertCircle" size={10} />
                          Required for Brand/Agency posting
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* VP Earning Preview - High Emphasis */}
                <div className="mt-4 p-4 !bg-blue-50 dark:!bg-blue-900/40 rounded-2xl border-2 border-blue-100 dark:border-blue-800 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-xl">
                      <Icon name="Coins" size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Estimated Earning</p>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Receive <strong className="text-lg text-blue-900 dark:text-blue-50">+{selectedType?.vpEarning} VP</strong> for this post
                      </p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-blue-400" />
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div className="flex gap-1 md:gap-3">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 rounded-full hover:bg-muted text-green-500 transition-all hover:scale-110 active:scale-95" 
                      disabled={isPosting}
                    >
                      <Icon name="Image" size={26} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowFeelingPicker(true)}
                      className="p-3 rounded-full hover:bg-muted text-yellow-500 transition-all hover:scale-110 active:scale-95" 
                      disabled={isPosting}
                    >
                      <Icon name="Smile" size={26} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 rounded-full hover:bg-muted text-red-500 transition-all hover:scale-110 active:scale-95" 
                      disabled={isPosting}
                    >
                      <Icon name="Video" size={26} />
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    className="premium-button h-12 px-12 disabled:opacity-50"
                    disabled={!postContent?.trim() || isPosting}
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
              {/* Feeling Picker Sub-screen */}
              {showFeelingPicker && (
                <div className="absolute inset-0 z-[100] !bg-white dark:!bg-slate-900 animate-in slide-in-from-right duration-300 flex flex-col">
                  <div className="sticky top-0 p-4 border-b border-border flex items-center gap-4 bg-white dark:bg-slate-900 z-10">
                    <button type="button" onClick={() => setShowFeelingPicker(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                      <Icon name="ChevronLeft" size={24} />
                    </button>
                    <h3 className="text-lg font-bold">How are you feeling?</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-3 pb-8">
                      {FEELINGS.map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setSelectedFeeling(f);
                            setShowFeelingPicker(false);
                          }}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                            selectedFeeling?.id === f.id 
                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' 
                            : 'border-border hover:border-primary/50 hover:bg-muted'
                          }`}
                        >
                          <span className="text-2xl">{f.emoji}</span>
                          <span className="font-semibold">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CreatePostCard;