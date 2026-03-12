import React from 'react';
import { Users, Lock, Globe } from 'lucide-react';

const GroupCard = ({ group, isMember, onJoin, onLeave, onClick, onManage, isAdmin }) => {
  const memberCount = group?.member_count || group?.group_members?.[0]?.count || Math.floor(Math.random() * 500) + 50;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Cover */}
      <div className="h-24 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">{group?.emoji || '👥'}</span>
        </div>
        <div className="absolute top-2 right-2">
          {group?.is_private ? (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-black/40 text-white rounded-full text-xs">
              <Lock className="w-3 h-3" /> Private
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-black/40 text-white rounded-full text-xs">
              <Globe className="w-3 h-3" /> Public
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 truncate">{group?.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{group?.description || 'A community for like-minded people'}</p>

        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5" />
            {memberCount?.toLocaleString()} members
          </span>
          {group?.topic && (
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs capitalize">
              {group?.topic}
            </span>
          )}
        </div>

        <div className="flex gap-2" onClick={e => e?.stopPropagation()}>
          {isMember ? (
            <>
              {isAdmin && (
                <button
                  onClick={onManage}
                  className="flex-1 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                >
                  Manage
                </button>
              )}
              <button
                onClick={onLeave}
                className="flex-1 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                Leave
              </button>
            </>
          ) : (
            <button
              onClick={onJoin}
              className="flex-1 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
            >
              Join Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
