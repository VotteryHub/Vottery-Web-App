import React from 'react';
import NavIcon from '../../../components/ui/NavIcon';

const StandardPost = ({ post, onAudit }) => {
  return (
    <div className="glass-card p-6 transition-all hover:shadow-xl hover:border-vottery-blue/30 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-vottery-blue border border-gray-200 dark:border-gray-700">
            {post.author[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white group-hover:text-vottery-blue transition-colors">{post.author}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{post.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onAudit(post)}
            className="text-gray-400 hover:text-vottery-blue transition-colors"
            title="Logic Audit"
          >
            <NavIcon name="Scale" size={16} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <NavIcon name="Menu" size={18} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {post.content}
      </p>
      
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button className="flex items-center gap-2 text-gray-500 hover:text-vottery-blue transition-colors">
          <NavIcon name="Plus" active={false} size={18} />
          <span className="text-xs font-bold">Vote</span>
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-vottery-blue transition-colors">
          <NavIcon name="Messages" active={false} size={18} />
          <span className="text-xs font-bold">Comment</span>
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-vottery-blue transition-colors">
          <NavIcon name="Jolts" active={false} size={18} />
          <span className="text-xs font-bold">Share</span>
        </button>
      </div>
    </div>
  );
};

export default StandardPost;
