import React from 'react';
import NavIcon from '../../../components/ui/NavIcon';

const VerticalPost = ({ post, onAudit }) => {
  return (
    <div className="glass-card overflow-hidden h-[600px] flex flex-col relative group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
      <img 
        src={`https://picsum.photos/seed/${post.id}/800/1200`} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      
      <div className="relative z-20 mt-auto p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-vottery-blue border-2 border-white flex items-center justify-center font-bold">
            {post.author[0]}
          </div>
          <div>
            <p className="font-bold text-lg">{post.author}</p>
            <p className="text-sm opacity-80">{post.date}</p>
          </div>
        </div>
        
        <h2 className="text-3xl font-black mb-4 leading-tight">
          {post.content}
        </h2>
        
        <div className="flex items-center gap-6 pt-4 border-t border-white/20">
          <button className="flex items-center gap-2 hover:text-vottery-yellow transition-colors">
            <NavIcon name="Jolts" active={false} size={20} className="stroke-white" />
            <span className="font-bold">1.2k</span>
          </button>
          <button className="flex items-center gap-2 hover:text-vottery-yellow transition-colors">
            <NavIcon name="Messages" active={false} size={20} className="stroke-white" />
            <span className="font-bold">450</span>
          </button>
          <button className="px-6 py-2 bg-vottery-blue rounded-full font-bold text-sm hover:bg-blue-700 transition-all">
            Join Discussion
          </button>
        </div>
      </div>
      
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        <button 
          onClick={() => onAudit(post)}
          className="p-1.5 bg-black/40 backdrop-blur-md rounded hover:bg-black/60 transition-colors"
          title="Logic Audit"
        >
          <NavIcon name="Scale" size={14} className="stroke-white" />
        </button>
        <div className="px-3 py-1 bg-vottery-yellow text-black text-xs font-black rounded uppercase">
          Featured
        </div>
      </div>
    </div>
  );
};

export default VerticalPost;
