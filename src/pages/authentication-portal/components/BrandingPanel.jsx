import React from 'react';
import Icon from '../../../components/AppIcon';

const BrandingPanel = () => {
  return (
    <div className="space-y-12 md:space-y-16 relative">
      {/* Messaging Hierarchy */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full mb-4">
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Protocol_v1.0.4</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black leading-[1.05] tracking-tight flex flex-wrap items-center gap-x-4">
          <span className="text-[#0766D4]">Join the World's First Gamified</span>{' '}
          <span className="text-[#FDC532]">Democratic Community.</span>
          <div className="inline-flex items-center gap-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl transform rotate-3">
             <Icon name="Vote" size={28} className="text-[#0766D4]" />
             <Icon name="CheckCircle" size={18} className="text-[#FDC532]" />
          </div>
        </h1>
        
        <h2 className="text-xl md:text-2xl font-heading font-bold leading-relaxed text-slate-700 dark:text-slate-300 max-w-2xl">
          <span className="text-[#0766D4] font-black underline decoration-[#FDC532] decoration-4 underline-offset-4">Discover Vottery:</span> The Social Network for Collective Choice and Connection, Where:
        </h2>
      </div>

      {/* Value Propositions (Impact) */}
      <div className="space-y-10 relative">
        {/* Subtle Connector Line */}
        <div className="absolute left-7 top-7 bottom-7 w-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent hidden md:block"></div>

        {[
          { icon: 'ClipboardCheck', title: 'Every Vote Counts.', meta: 'Immutable Ledger Verification' },
          { icon: 'AudioLines', title: 'Every Voice is Heard.', meta: 'Semantic Analysis Integration' },
          { icon: 'Trophy', title: 'Everyone Plays to Win.', meta: 'Smart Contract Reward Distribution', color: 'text-[#FDC532]', bg: 'bg-[#FDC532]/10' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-start gap-8 group relative">
            <div className={`w-14 h-14 ${item.bg || 'bg-[#0766D4]/10'} rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl border border-white/10 relative z-10`}>
              <Icon name={item.icon} size={32} className={item.color || 'text-[#0766D4]'} />
            </div>
            <div className="flex flex-col">
              <p className="text-2xl md:text-4xl font-heading font-black text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-4 h-[1px] bg-primary/30"></span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{item.meta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandingPanel;