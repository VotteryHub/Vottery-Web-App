import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { ROLES } from '../../../constants/roles';
import { geminiChatService } from '../../../services/geminiChatService';
import { platformGamificationService } from '../../../services/platformGamificationService';
import { electionsService } from '../../../services/electionsService';

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

  // Gemini AI State
  const [isAICreatorOpen, setIsAICreatorOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMode, setAiMode] = useState('standard'); // 'standard' or 'premium'
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');

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

  async function fetchActiveElections() {
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

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const baseCost = 100;
      const surcharge = aiMode === 'premium' ? 1.2 : 1.0;
      const totalCost = Math.round(baseCost * surcharge);

      // 1. Redeem VP first
      const redemption = await platformGamificationService.redeemVP({
        userId: user?.id,
        type: 'ai_generation',
        amount: totalCost,
        metadata: { aiMode, prompt: aiPrompt }
      });

      if (!redemption.success) {
        alert(`Insufficient VP. You need ${totalCost} VP for this generation.`);
        return;
      }

      // 2. Call Gemini
      const messages = [
        { role: 'system', content: `You are a Vottery Content Assistant. Create ${aiMode === 'premium' ? 'highly creative and engaging' : 'standard'} social media content for Vottery.` },
        { role: 'user', content: aiPrompt }
      ];

      const result = await geminiChatService.generateContent(messages, {
        model: aiMode === 'premium' ? 'gemini-1.5-pro' : 'gemini-1.5-flash',
        temperature: aiMode === 'premium' ? 0.9 : 0.6
      });

      const content = result.choices[0].message.content;
      setAiGeneratedContent(content);
      setPostContent(content);
      setIsAICreatorOpen(false);
    } catch (err) {
      console.error('AI Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 w-full max-w-xl mx-auto mb-6 p-4 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl transition-all">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                {(user?.full_name || user?.name || 'V').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        
        {/* Pill Input */}
        <button
          onClick={() => setShowFullComposer(true)}
          className="flex-1 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-left text-gray-900 dark:text-gray-100 transition-all duration-300 px-4 border border-gray-200 dark:border-gray-700 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <span className="text-[15px] font-normal opacity-70">What's on your mind?</span>
        </button>

        {/* Gallery Icon */}
        <button 
          onClick={() => { setShowFullComposer(true); fileInputRef.current?.click(); }}
          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          title="Photo/Video"
        >
          <Icon name="Image" size={26} strokeWidth={1.5} />
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
            style={{ backdropFilter: 'blur(30px)' }}
          >
            {/* AI Assistant Layer */}
            {isAICreatorOpen && (
              <div className="absolute inset-0 z-[101] bg-white dark:bg-slate-900 animate-in slide-in-from-bottom duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-vottery-blue/10 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-vottery-blue text-white rounded-xl shadow-lg animate-pulse">
                      <Icon name="Zap" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-vottery-blue dark:text-blue-400">Gemini AI Assistant</h3>
                      <p className="text-xs text-gray-500 font-medium italic">Crafting perfection with one prompt...</p>
                    </div>
                  </div>
                  <button onClick={() => setIsAICreatorOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <Icon name="X" size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-3">Your Vision</label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Write a post about the upcoming digital voting benefits for Gen Z..."
                      className="w-full h-32 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-vottery-blue focus:outline-none text-base placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-gray-400 mb-3">Creative Mode</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setAiMode('standard')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          aiMode === 'standard' ? 'border-vottery-blue bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-800'
                        }`}
                      >
                        <Icon name="Zap" size={24} className={aiMode === 'standard' ? 'text-vottery-blue' : 'text-gray-400'} />
                        <span className="font-bold text-sm">Standard</span>
                        <span className="text-[10px] uppercase font-black text-gray-500">100 VP</span>
                      </button>
                      <button
                        onClick={() => setAiMode('premium')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 relative overflow-hidden ${
                          aiMode === 'premium' ? 'border-vottery-yellow bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-100 dark:border-gray-800'
                        }`}
                      >
                        <div className="absolute top-0 right-0 bg-vottery-yellow text-vottery-blue text-[8px] font-black px-2 py-0.5 rounded-bl-lg">+20% Fee</div>
                        <Icon name="Star" size={24} className={aiMode === 'premium' ? 'text-vottery-yellow' : 'text-gray-400'} />
                        <span className="font-bold text-sm">Premium</span>
                        <span className="text-[10px] uppercase font-black text-gray-500">120 VP</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={handleAIGeneration}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full h-14 bg-vottery-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-vottery-blue/30 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Icon name="Loader" size={20} className="animate-spin" />
                        Generating Wisdom...
                      </>
                    ) : (
                      <>
                        <Icon name="Zap" size={20} />
                        Ignite Intelligence
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
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
                      title="Feeling"
                    >
                      <Icon name="Smile" size={26} />
                    </button>
                    <button 
                      type="button" 
                      className="p-3 rounded-full hover:bg-muted text-blue-500 transition-all hover:scale-110 active:scale-95" 
                      disabled={isPosting}
                      title="Tag Friends"
                    >
                      <Icon name="UserPlus" size={26} />
                    </button>
                    <button 
                      type="button" 
                      className="p-3 rounded-full hover:bg-muted text-orange-500 transition-all hover:scale-110 active:scale-95" 
                      disabled={isPosting}
                      title="Check In"
                    >
                      <Icon name="MapPin" size={26} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSelectedType(CONTENT_TYPES.find(t => t.id === 'live'))}
                      className="p-3 rounded-full hover:bg-muted text-red-600 transition-all hover:scale-110 active:scale-95" 
                      disabled={isPosting}
                      title="Go Live"
                    >
                      <Icon name="Radio" size={26} />
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