import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Loader } from 'lucide-react';

import { carouselCoachingService } from '../../../services/carouselCoachingService';

const InteractiveChatInterface = ({ creatorId }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversation();
  }, [creatorId]);

  const loadConversation = async () => {
    try {
      setError(null);
      const result = await carouselCoachingService?.getOrCreateConversation(creatorId);
      if (result?.error) {
        setConversation(null);
        setMessages([]);
        setError(result?.error);
        return;
      }
      if (result?.data) {
        setConversation(result?.data);
        setMessages(result?.data?.messages || []);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage?.trim() || !conversation?.id) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setStreaming(true);
    setStreamingMessage('');

    try {
      await carouselCoachingService?.sendMessage(
        conversation?.id,
        userMessage,
        (chunk) => {
          setStreamingMessage(prev => prev + chunk);
        }
      );

      await loadConversation();
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error?.message || 'Unable to send message right now.');
    } finally {
      setStreaming(false);
      setStreamingMessage('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Interactive Coaching Chat</h2>
      </div>

      {error && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
          {`Chat unavailable: ${error}`}
        </div>
      )}

      <div className="space-y-4">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {messages?.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Start a conversation with your AI coach</p>
              <p className="text-sm text-gray-500">Ask about carousel optimization, engagement strategies, or monetization tips</p>
            </div>
          )}

          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg?.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  msg?.role === 'user' ?'bg-blue-600 text-white' :'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg?.content}</p>
              </div>
            </div>
          ))}

          {streaming && streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 rounded-lg bg-white border border-gray-200 text-gray-900">
                <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Loader className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-xs text-gray-500">Claude is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e?.target?.value)}
            onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
            placeholder="Ask your coach anything..."
            disabled={streaming}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage?.trim() || streaming}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {streaming ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Send
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Powered by Claude AI • Responses are generated in real-time
        </p>
      </div>
    </div>
  );
};

export default InteractiveChatInterface;