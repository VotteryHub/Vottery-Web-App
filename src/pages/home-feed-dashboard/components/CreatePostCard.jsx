import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CONTENT_TYPES = [
  { id: 'post', label: 'Post', icon: 'FileText', description: 'Share thoughts or updates', vpEarning: 5 },
  { id: 'moment', label: 'Moment', icon: 'Clock', description: 'Ephemeral 24h story', vpEarning: 3 },
  { id: 'jolts', label: 'Jolts', icon: 'Zap', description: 'Short-form video', vpEarning: 15 },
  { id: 'live', label: 'Live', icon: 'Radio', description: 'Start a live broadcast', vpEarning: 25 }
];

const CreatePostCard = ({ user, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showFullComposer, setShowFullComposer] = useState(false);
  const [contentType, setContentType] = useState('post');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionResults, setMentionResults] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedType = CONTENT_TYPES?.find(t => t?.id === contentType) || CONTENT_TYPES?.[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(e?.target)) {
        setShowTypeDropdown(false);
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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!postContent?.trim()) return;
    setIsPosting(true);
    try {
      await onCreatePost?.(postContent, contentType);
      setPostContent('');
      setShowFullComposer(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 rounded-br-xl rounded-t-xl rounded-bl-xl">
      <div className="flex items-center gap-3">
        <Image
          src={user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
          alt={`${user?.name || 'User'} profile picture`}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <button
          onClick={() => setShowFullComposer(true)}
          className="flex-1 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-left text-gray-500 dark:text-gray-400 transition-colors duration-200 text-base font-normal px-[29px]"
        >
          What's on your mind, {user?.full_name?.split(' ')?.[0] || 'User'}?
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowFullComposer(true)} className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" title="Live Video">
            <Icon name="Video" size={24} strokeWidth={2} className="text-red-500" />
          </button>
          <button type="button" onClick={() => setShowFullComposer(true)} className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" title="Photo/Video">
            <Icon name="Image" size={24} strokeWidth={2} className="text-green-500" />
          </button>
          <button type="button" onClick={() => setShowFullComposer(true)} className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" title="Feeling/Activity">
            <Icon name="Smile" size={24} strokeWidth={2} className="text-pink-500" />
          </button>
        </div>
      </div>
      {/* Full Composer Modal */}
      {showFullComposer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header with Content Type Dropdown */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Icon name={selectedType?.icon} size={16} />
                    <span className="text-sm font-semibold">{selectedType?.label}</span>
                    <Icon name="ChevronDown" size={14} />
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 w-56">
                      {CONTENT_TYPES?.map(type => (
                        <button
                          key={type?.id}
                          onClick={() => { setContentType(type?.id); setShowTypeDropdown(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            contentType === type?.id ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            contentType === type?.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Icon name={type?.icon} size={16} className={contentType === type?.id ? 'text-white' : 'text-muted-foreground'} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{type?.label}</p>
                            <p className="text-xs text-muted-foreground">{type?.description}</p>
                          </div>
                          <div className="ml-auto text-xs font-bold text-yellow-600">+{type?.vpEarning} VP</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground">Create {selectedType?.label}</h3>
              </div>
              <button onClick={() => setShowFullComposer(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <Icon name="X" size={24} strokeWidth={2.5} className="text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <Image
                  src={user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={`${user?.name || 'User'} profile picture`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">Public</p>
                </div>
              </div>

              {/* Rich Text Toolbar */}
              <div className="flex items-center gap-1 mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <button type="button" onClick={() => applyFormatting('bold')} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Bold">
                  <Icon name="Bold" size={16} className="text-foreground" />
                </button>
                <button type="button" onClick={() => applyFormatting('italic')} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Italic">
                  <Icon name="Italic" size={16} className="text-foreground" />
                </button>
                <button type="button" onClick={() => applyFormatting('link')} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Link">
                  <Icon name="Link" size={16} className="text-foreground" />
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
                <span className="text-xs text-muted-foreground">Use @mention to tag users</span>
              </div>

              {/* Textarea with @mention */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={postContent}
                  onChange={handleContentChange}
                  placeholder={`What's on your mind? Use @ to mention someone...`}
                  className="w-full min-h-[120px] p-3 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground"
                  disabled={isPosting}
                  autoFocus
                />
                {/* @mention autocomplete */}
                {showMentions && mentionResults?.length > 0 && (
                  <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 w-64">
                    {mentionResults?.map(u => (
                      <button
                        key={u?.id}
                        type="button"
                        onClick={() => insertMention(u?.username)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                      >
                        <img src={u?.avatar} alt={`${u?.name} profile`} className="w-8 h-8 rounded-full object-cover" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{u?.name}</p>
                          <p className="text-xs text-muted-foreground">@{u?.username}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* VP Earning Preview */}
              <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <Icon name="Coins" size={16} className="text-yellow-600" />
                <span className="text-sm text-yellow-700 dark:text-yellow-400">
                  Estimated earning: <strong>+{selectedType?.vpEarning} VP</strong> for this {selectedType?.label}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <button type="button" className="p-2 rounded-lg hover:bg-muted transition-colors duration-200" disabled={isPosting}>
                    <Icon name="Image" size={24} className="text-green-500" />
                  </button>
                  <button type="button" className="p-2 rounded-lg hover:bg-muted transition-colors duration-200" disabled={isPosting}>
                    <Icon name="Smile" size={24} className="text-yellow-500" />
                  </button>
                </div>
                <Button type="submit" variant="default" size="sm" disabled={!postContent?.trim() || isPosting} loading={isPosting}>
                  Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostCard;