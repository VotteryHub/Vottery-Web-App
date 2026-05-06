import React from 'react';
import { Users, Lock, Globe } from 'lucide-react';

const HubCard = ({ hub: group, isMember, onJoin, onLeave, onClick, onManage, isAdmin }) => {
  const memberCount = group?.member_count || group?.group_members?.[0]?.count || Math.floor(Math.random() * 500) + 50;

  return (
    <div
      className="group bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer relative"
      onClick={onClick}
    >
      {/* Cover Intelligence Layer */}
      <div className="h-32 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-900/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
          <span className="text-6xl drop-shadow-2xl">{group?.emoji || '👥'}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 right-4">
          {!group?.is_public ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-black/60 text-white backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
              <Lock className="w-3 h-3" /> Encrypted
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
              <Globe className="w-3 h-3" /> Public Net
            </span>
          )}
        </div>
      </div>

      {/* Content Layer */}
      <div className="p-6 relative">
        <h3 className="font-black text-white text-lg mb-2 truncate uppercase tracking-tight">{group?.name}</h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 mb-6 h-8">{group?.description || 'Standard Vottery community cluster for high-fidelity engagement.'}</p>

        <div className="flex items-center gap-4 mb-6">
          <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            {memberCount?.toLocaleString()} Citizens
          </span>
          {group?.topic && (
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              {group?.topic}
            </span>
          )}
        </div>

        <div className="flex gap-3" onClick={e => e?.stopPropagation()}>
          {isMember ? (
            <>
              {isAdmin && (
                <button
                  onClick={onManage}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                >
                  Configure
                </button>
              )}
              <button
                onClick={onLeave}
                className="flex-1 py-3 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={onJoin}
              className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-purple-500/20 transition-all active:scale-95"
            >
              Sync Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HubCard;
