import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { format } from 'date-fns';
import MessageReactions from './MessageReactions';
import MediaGallery from './MediaGallery';
import { messagingService } from '../../../services/messagingService';

const ConversationPanel = ({ thread, messages, onSendMessage, currentUserId, otherParticipant, onToggleDetails, onBack }) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const messagesEndRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const recordingDurationRef = useRef(0);
  const typingTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (messageText?.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value ?? '';
    setMessageText(value);

    if (!thread?.id) return;

    // Send typing start immediately
    messagingService?.sendTypingIndicator?.(thread?.id, true);

    // Reset debounce timer for typing stop
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      messagingService?.sendTypingIndicator?.(thread?.id, false);
    }, 3000);
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch {
      return '';
    }
  };

  const handleAddReaction = async (messageId, emoji) => {
    try {
      await messagingService?.addReaction(messageId, emoji);
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  };

  const handleRemoveReaction = async (messageId, emoji) => {
    try {
      await messagingService?.removeReaction(messageId, emoji);
    } catch (err) {
      console.error('Failed to remove reaction:', err);
    }
  };

  const sendVoiceMessage = async (blob, durationSec) => {
    if (!thread?.id || !blob || blob?.size === 0) return;
    try {
      const fileName = `voice-${thread?.id}-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await messagingService
        ?.uploadVoiceMessage?.(thread?.id, blob, fileName);
      if (uploadError) throw new Error(uploadError?.message);

      const publicUrl = uploadData?.publicUrl || uploadData?.publicURL || null;
      const content = `[Voice message ${durationSec || 0}s]`;

      await messagingService?.sendMessage(
        thread?.id,
        content,
        'voice',
        publicUrl,
        null,
        { duration: durationSec || 0 }
      );
    } catch (err) {
      console.error('Failed to send voice message:', err);
    }
  };

  const startRecording = async () => {
    if (isRecording) return;
    if (typeof navigator === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      console.warn('MediaDevices API not available');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event?.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const durationSec = recordingDurationRef?.current ?? recordingDuration ?? 0;
        try {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (blob?.size > 0 && durationSec > 0) {
            await sendVoiceMessage(blob, durationSec);
          }
        } catch (err) {
          console.error('Error processing voice recording:', err);
        } finally {
          stream?.getTracks?.()?.forEach?.((track) => track?.stop?.());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingDuration(0);
      recordingDurationRef.current = 0;

      mediaRecorder.start();
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
        recordingDurationRef.current = (recordingDurationRef.current || 0) + 1;
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef?.current) {
      clearInterval(recordingIntervalRef?.current);
    }
    if (mediaRecorderRef?.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
    setRecordingDuration(0);
    recordingDurationRef.current = 0;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!thread?.id || !currentUserId) return;

    const unsubscribe = messagingService?.subscribeToTyping?.(thread?.id, (payload) => {
      if (!payload || payload?.userId === currentUserId) return;
      if (payload?.isTyping) {
        setIsTyping(true);
        // auto-hide after a short delay
        setTimeout(() => setIsTyping(false), 4000);
      } else {
        setIsTyping(false);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [thread?.id, currentUserId]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef?.current) {
        clearInterval(recordingIntervalRef?.current);
      }
      if (typingTimeoutRef?.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (mediaRecorderRef?.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Icon name="ChevronLeft" size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
          {otherParticipant?.avatar ? (
            <img
              src={otherParticipant?.avatar}
              alt={otherParticipant?.name || 'User avatar'}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary md:size-20" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm md:text-base">
                {otherParticipant?.name || 'Unknown User'}
              </h2>
              {otherParticipant?.verified && (
                <Icon name="BadgeCheck" size={14} className="text-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-[10px] md:text-xs text-green-500">Active now</p>
          </div>
        </div>
        <button
          onClick={onToggleDetails}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Icon name="Info" size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => {
          const isSent = message?.senderId === currentUserId;
          return (
            <div
              key={message?.id}
              className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isSent ? 'order-2' : 'order-1'}`}>
                {/* Voice Message */}
                {message?.messageType === 'voice' && (
                  <div
                    className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${
                      isSent
                        ? 'bg-primary text-white rounded-br-none' :'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                    }`}
                  >
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      {message?.status === 'sending' ? (
                        <Icon name="Loader" size={20} className="animate-spin" />
                      ) : (
                        <Icon name="Play" size={20} />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/40 w-1/3"></div>
                      </div>
                    </div>
                    <span className="text-xs opacity-80">
                      {formatDuration(message?.metadata?.duration || 0)}
                    </span>
                  </div>
                )}

                {/* Text/Image Message */}
                {message?.messageType !== 'voice' && (
                  <div
                    className={`rounded-2xl px-4 py-2 transition-opacity duration-300 ${
                      message?.status === 'sending' ? 'opacity-70 animate-pulse' : ''
                    } ${
                      isSent
                        ? 'bg-primary text-white rounded-br-none' :'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                    }`}
                  >
                    {message?.attachmentUrl && (
                      <div className="mb-2 rounded-lg overflow-hidden">
                        <img
                          src={message?.attachmentUrl}
                          alt={message?.attachmentAlt || 'Shared image'}
                          className="max-w-full h-auto"
                        />
                      </div>
                    )}
                    <p className="text-sm break-words">{message?.content}</p>
                  </div>
                )}

                {/* Reactions */}
                <MessageReactions
                  message={message}
                  currentUserId={currentUserId}
                  onAddReaction={handleAddReaction}
                  onRemoveReaction={handleRemoveReaction}
                />

                {/* Timestamp */}
                <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatMessageTime(message?.createdAt)}
                  </span>
                  {isSent && (
                    <div className="flex items-center">
                      {message?.status === 'sending' ? (
                        <Icon name="Clock" size={12} className="text-gray-400 animate-pulse" />
                      ) : message?.status === 'error' ? (
                        <Icon name="AlertCircle" size={12} className="text-red-500" />
                      ) : (
                        <Icon name="Check" size={14} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {isRecording ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="flex-1 text-red-600 dark:text-red-400 font-medium">
              Recording... {formatDuration(recordingDuration)}
            </span>
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Icon name="Square" size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <button 
              onClick={() => setShowMediaGallery(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Icon name="Image" size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Icon name="Smile" size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Icon name="Paperclip" size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1">
              <textarea
                value={messageText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            {messageText?.trim() ? (
              <Button
                onClick={handleSend}
                disabled={!messageText?.trim()}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Icon name="Send" size={20} />
              </Button>
            ) : (
              <button
                onClick={startRecording}
                className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
              >
                <Icon name="Mic" size={20} />
              </button>
            )}
          </div>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {isRecording ? 'Tap to stop recording' : 'Press Enter to send, Shift + Enter for new line'}
        </p>
      </div>

      {/* Media Gallery Modal */}
      {showMediaGallery && (
        <MediaGallery
          thread={thread}
          onClose={() => setShowMediaGallery(false)}
        />
      )}
    </div>
  );
};

export default ConversationPanel;