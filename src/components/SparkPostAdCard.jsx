import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PostCard from '../pages/home-feed-dashboard/components/PostCard';
import Icon from './AppIcon';

const SparkPostAdCard = ({ sourcePostId, currentUser, ctaLabel, ctaUrl, onInteraction }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!sourcePostId) return;
      try {
        const { data, error } = await supabase
          ?.from('posts')
          ?.select('*, userProfiles:user_profiles(*)')
          ?.eq('id', sourcePostId)
          ?.single();
        if (!cancelled && !error) setPost(data);
      } catch (_) {
        // ignore
      }
    };
    load();
    return () => { cancelled = true; };
  }, [sourcePostId]);

  if (!sourcePostId) return null;

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <Icon name="Sparkles" size={14} />
        Spark Ad
      </div>

      {post ? (
        <PostCard
          post={post}
          currentUser={currentUser}
          onInteraction={(t) => onInteraction?.(t)}
        />
      ) : (
        <div className="card p-6 w-full max-w-[545.67px] mx-auto border border-border text-sm text-muted-foreground">
          Loading promoted post…
        </div>
      )}

      {ctaUrl ? (
        <div className="w-full max-w-[545.67px] mx-auto -mt-4 mb-6 px-4">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            {ctaLabel || 'Learn more'}
            <Icon name="ArrowUpRight" size={16} />
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default SparkPostAdCard;

