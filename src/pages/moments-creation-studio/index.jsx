import React, { useState, useRef } from 'react';
import { Sparkles, Upload, Type, BarChart3, Share2, Clock } from 'lucide-react';
import MediaUploadPanel from './components/MediaUploadPanel';
import FilterEffectsPanel from './components/FilterEffectsPanel';
import InteractiveElementsPanel from './components/InteractiveElementsPanel';
import ClaudeViralScoringEngine from './components/ClaudeViralScoringEngine';
import StoryPreviewPanel from './components/StoryPreviewPanel';
import momentService from '../../services/momentService';
import { Toaster, toast } from 'react-hot-toast';

const MomentsCreationStudio = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [textStickers, setTextStickers] = useState([]);
  const [interactiveElements, setInteractiveElements] = useState([]);
  const [viralScore, setViralScore] = useState(null);
  const [expiryTime, setExpiryTime] = useState(24); // hours

  const handleMediaUpload = (files) => {
    setMediaFiles([...mediaFiles, ...files]);
    setActiveTab('edit');
  };

  const handleFilterApplied = (filter) => {
    setAppliedFilters([...appliedFilters, filter]);
  };

  const handleTextStickerAdded = (sticker) => {
    setTextStickers([...textStickers, sticker]);
  };

  const handleInteractiveElementAdded = (element) => {
    setInteractiveElements([...interactiveElements, element]);
  };

  const handleViralScoreGenerated = (score) => {
    setViralScore(score);
  };

  const handlePublishToKineticSpindle = async () => {
    try {
      const expiresAt = new Date();
      expiresAt?.setHours(expiresAt?.getHours() + (expiryTime || 24));
      const { data, error } = await momentService?.createMoment?.({
        content: `Moment with ${appliedFilters?.length || 0} filters`,
        media_url: mediaFiles?.[0]?.url || mediaFiles?.[0]?.name || '',
        expires_at: expiresAt?.toISOString(),
      });
      if (error) throw error;
      toast?.success('Moment published! Expires in 24h.');
      setMediaFiles([]);
      setAppliedFilters([]);
      setTextStickers([]);
      setInteractiveElements([]);
      setViralScore(null);
      setActiveTab('upload');
    } catch (e) {
      toast?.error(e?.message || 'Failed to publish moment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-lg border-b border-pink-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Moments Creation Studio</h1>
                <p className="text-sm text-gray-400">Create ephemeral stories with 24-hour expiry</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-pink-400" />
                <span className="text-white font-medium">{expiryTime}h expiry</span>
              </div>
              <button
                onClick={handlePublishToKineticSpindle}
                disabled={mediaFiles?.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="w-5 h-5 inline-block mr-2" />
                Share to Kinetic Spindle
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 bg-black/30 backdrop-blur-sm rounded-xl p-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'upload' ?'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg' :'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            Upload Media
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            disabled={mediaFiles?.length === 0}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === 'edit' ?'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg' :'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-5 h-5 inline-block mr-2" />
            Edit & Enhance
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            disabled={mediaFiles?.length === 0}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === 'interactive' ?'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg' :'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Type className="w-5 h-5 inline-block mr-2" />
            Interactive
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            disabled={mediaFiles?.length === 0}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === 'analytics' ?'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg' :'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline-block mr-2" />
            AI Scoring
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'upload' && (
              <MediaUploadPanel onMediaUpload={handleMediaUpload} />
            )}

            {activeTab === 'edit' && mediaFiles?.length > 0 && (
              <FilterEffectsPanel
                mediaFiles={mediaFiles}
                onFilterApplied={handleFilterApplied}
              />
            )}

            {activeTab === 'interactive' && mediaFiles?.length > 0 && (
              <InteractiveElementsPanel
                onTextStickerAdded={handleTextStickerAdded}
                onInteractiveElementAdded={handleInteractiveElementAdded}
              />
            )}

            {activeTab === 'analytics' && mediaFiles?.length > 0 && (
              <ClaudeViralScoringEngine
                mediaFiles={mediaFiles}
                filters={appliedFilters}
                textStickers={textStickers}
                interactiveElements={interactiveElements}
                onViralScoreGenerated={handleViralScoreGenerated}
              />
            )}
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <StoryPreviewPanel
              mediaFiles={mediaFiles}
              filters={appliedFilters}
              textStickers={textStickers}
              interactiveElements={interactiveElements}
              viralScore={viralScore}
              expiryTime={expiryTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomentsCreationStudio;