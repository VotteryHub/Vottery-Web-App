import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

const HubCard = ({ group, isMember, onJoin, onLeave, onClick }) => {
  const handleAction = (e) => {
    e?.stopPropagation();
    if (isMember) {
      onLeave();
    } else {
      onJoin();
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
    >
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500 relative">
        {group?.cover_image && (
          <img
            src={group?.cover_image}
            alt={group?.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {group?.topic}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          {group?.avatar ? (
            <img
              src={group?.avatar}
              alt={group?.name}
              className="w-12 h-12 rounded-full border-2 border-white -mt-8 relative z-10"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center -mt-8 relative z-10 border-2 border-white">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          )}
          <div className="flex-1 mt-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {group?.name}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed line-clamp-2">
              {group?.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{group?.member_count || 0} Citizens</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>{group?.election_count || 0} Elections</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAction}
          className={`w-full py-2 rounded-lg font-medium transition-all ${
            isMember
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' :'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isMember ? 'Leave Hub' : 'Join Hub'}
        </button>
      </div>
    </div>
  );
};

export default HubCard;