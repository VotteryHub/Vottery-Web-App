import React from 'react';
import { Eye, Clock, Sparkles, TrendingUp } from 'lucide-react';

const StoryPreviewPanel = ({
  mediaFiles,
  filters,
  textStickers,
  interactiveElements,
  viralScore,
  expiryTime,
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6 sticky top-24">
      <div className="flex items-center space-x-3 mb-4">
        <Eye className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-bold text-white">Story Preview</h3>
      </div>
      {/* Mobile Preview Frame */}
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-[9/16] mb-4 border-4 border-gray-800">
        {mediaFiles?.length > 0 ? (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400 text-center px-4">
              Upload media to see preview
            </p>
          </div>
        )}

        {/* Expiry Timer Overlay */}
        {mediaFiles?.length > 0 && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{expiryTime}h</span>
            </div>
            {viralScore && (
              <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm font-bold">{viralScore?.overallScore}</span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Stats */}
      {mediaFiles?.length > 0 && (
        <div className="space-y-3">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Media Files</span>
              <span className="text-white font-bold">{mediaFiles?.length}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Filters Applied</span>
              <span className="text-white font-bold">{filters?.length}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Text Stickers</span>
              <span className="text-white font-bold">{textStickers?.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Interactive Elements</span>
              <span className="text-white font-bold">{interactiveElements?.length}</span>
            </div>
          </div>

          {viralScore && (
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-3 border border-pink-500/30">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span className="text-white font-bold">Viral Potential</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Score</span>
                <span className="text-2xl font-bold text-white">
                  {viralScore?.overallScore}/100
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryPreviewPanel;