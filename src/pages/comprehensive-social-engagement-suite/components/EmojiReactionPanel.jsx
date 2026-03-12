import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { reactionsService } from '../../../services/reactionsService';
import { useAuth } from '../../../contexts/AuthContext';

const EmojiReactionPanel = ({ contentType, contentId }) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState([]);
  const [userReactions, setUserReactions] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [sentiment, setSentiment] = useState({ positive: 0, neutral: 0, negative: 0 });

  const emojiList = [
    { emoji: '❤️', name: 'Love', sentiment: 'positive' },
    { emoji: '👍', name: 'Like', sentiment: 'positive' },
    { emoji: '😂', name: 'Laugh', sentiment: 'positive' },
    { emoji: '😢', name: 'Sad', sentiment: 'negative' },
    { emoji: '😮', name: 'Wow', sentiment: 'neutral' },
    { emoji: '🔥', name: 'Fire', sentiment: 'positive' },
    { emoji: '🎉', name: 'Celebrate', sentiment: 'positive' },
    { emoji: '👏', name: 'Clap', sentiment: 'positive' }
  ];

  useEffect(() => {
    loadReactions();
  }, [contentType, contentId]);

  const loadReactions = async () => {
    try {
      const { data: allReactions } = await reactionsService?.getReactions(contentType, contentId);
      const { data: myReactions } = await reactionsService?.getUserReactions(contentType, contentId);
      
      setReactions(allReactions || []);
      setUserReactions(myReactions || []);
      
      // Calculate sentiment
      const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
      allReactions?.forEach(reaction => {
        const emojiData = emojiList?.find(e => e?.emoji === reaction?.emoji);
        if (emojiData) {
          sentimentCounts[emojiData?.sentiment] += reaction?.count;
        }
      });
      setSentiment(sentimentCounts);
    } catch (err) {
      console.error('Failed to load reactions:', err);
    }
  };

  const handleReaction = async (emoji) => {
    try {
      if (userReactions?.includes(emoji)) {
        await reactionsService?.removeReaction(contentType, contentId, emoji);
      } else {
        await reactionsService?.addReaction(contentType, contentId, emoji);
      }
      loadReactions();
      setShowPicker(false);
    } catch (err) {
      console.error('Failed to handle reaction:', err);
    }
  };

  const totalReactions = reactions?.reduce((sum, r) => sum + r?.count, 0);
  const sentimentPercentages = {
    positive: totalReactions > 0 ? (sentiment?.positive / totalReactions * 100)?.toFixed(0) : 0,
    neutral: totalReactions > 0 ? (sentiment?.neutral / totalReactions * 100)?.toFixed(0) : 0,
    negative: totalReactions > 0 ? (sentiment?.negative / totalReactions * 100)?.toFixed(0) : 0
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Heart" size={28} className="text-primary" />
          Emoji Reactions
        </h2>
        <p className="text-muted-foreground mb-6">
          Express your feelings with emoji reactions and see real-time sentiment analysis
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Smile" size={20} color="var(--color-success)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Positive</p>
                <p className="text-xl font-data font-bold text-success">{sentimentPercentages?.positive}%</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Meh" size={20} color="var(--color-warning)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Neutral</p>
                <p className="text-xl font-data font-bold text-warning">{sentimentPercentages?.neutral}%</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Icon name="Frown" size={20} color="var(--color-destructive)" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Negative</p>
                <p className="text-xl font-data font-bold text-destructive">{sentimentPercentages?.negative}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="w-full px-6 py-4 bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 rounded-xl transition-all duration-250 flex items-center justify-center gap-3"
          >
            <Icon name="Smile" size={24} className="text-primary" />
            <span className="text-lg font-medium text-primary">React with Emoji</span>
          </button>

          {showPicker && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border-2 border-border rounded-xl shadow-lg p-4 z-10">
              <div className="grid grid-cols-4 gap-3">
                {emojiList?.map((item) => {
                  const isActive = userReactions?.includes(item?.emoji);
                  return (
                    <button
                      key={item?.emoji}
                      onClick={() => handleReaction(item?.emoji)}
                      className={`p-4 rounded-lg transition-all hover:scale-110 ${
                        isActive ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <div className="text-3xl mb-1">{item?.emoji}</div>
                      <div className="text-xs font-medium text-foreground">{item?.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Total Reactions</span>
            <span className="text-lg font-data font-bold text-foreground">{totalReactions}</span>
          </div>

          {reactions?.map((reaction) => {
            const emojiData = emojiList?.find(e => e?.emoji === reaction?.emoji);
            const percentage = totalReactions > 0 ? (reaction?.count / totalReactions * 100) : 0;
            
            return (
              <div key={reaction?.emoji} className="flex items-center gap-3">
                <div className="text-2xl">{reaction?.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{emojiData?.name}</span>
                    <span className="text-sm font-data font-semibold text-foreground">
                      {reaction?.count} ({percentage?.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6 bg-primary/10 border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-2">Sentiment Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Reactions are automatically analyzed for sentiment to help creators understand audience feelings. 
              Positive reactions include Love, Like, Laugh, Fire, Celebrate, and Clap. Negative reactions include Sad. 
              Neutral reactions include Wow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiReactionPanel;