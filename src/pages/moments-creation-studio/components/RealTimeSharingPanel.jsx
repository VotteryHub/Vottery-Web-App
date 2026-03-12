import React from 'react';
import { Share2, Clock, Eye, Sparkles } from 'lucide-react';

const RealTimeSharingPanel = ({ onShare }) => {
  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Share2 className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-bold text-white">Real-Time Sharing</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-2">Share to Kinetic Spindle Carousel</p>
          <p className="text-white mb-4">
            Your Moment will appear in the 3D rotating carousel with 24-hour expiry
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Automated expiry management</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-2">Real-Time Analytics</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">View tracking</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Engagement metrics</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSharingPanel;