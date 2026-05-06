import React from 'react';
import { X, Users, TrendingUp, Calendar } from 'lucide-react';

const HubDetailsModal = ({ group, isMember, onClose, onJoin, onLeave }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Cover */}
        <div className="relative h-48 bg-gradient-to-r from-purple-500 to-blue-500">
          {group?.cover_image && (
            <img
              src={group?.cover_image}
              alt={group?.name}
              className="w-full h-full object-cover"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            {group?.avatar ? (
              <img
                src={group?.avatar}
                alt={group?.name}
                className="w-20 h-20 rounded-full border-4 border-white -mt-12 relative z-10"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center -mt-12 relative z-10 border-4 border-white">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
            )}
            <div className="flex-1 mt-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{group?.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {group?.topic}
                </span>
                {group?.is_private && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    Private
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{group?.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{group?.member_count || 0}</div>
              <div className="text-sm text-gray-600">Members</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{group?.election_count || 0}</div>
              <div className="text-sm text-gray-600">Elections</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor((Date.now() - new Date(group.created_at)?.getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600">Days Active</div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={isMember ? onLeave : onJoin}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isMember
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' :'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isMember ? 'Leave Hub' : 'Join Hub'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubDetailsModal;