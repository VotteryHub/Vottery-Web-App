import React, { useState, useRef } from 'react';
import { Camera, Upload, Wand2, Sparkles } from 'lucide-react';
import VideoRecordingPanel from './components/VideoRecordingPanel';
import AIAutoCaptionsPanel from './components/AIAutoCaptionsPanel';
import TrendingSoundIntegration from './components/TrendingSoundIntegration';
import HashtagIntelligenceEngine from './components/HashtagIntelligenceEngine';
import PerformancePreviewPanel from './components/PerformancePreviewPanel';
import VideoUploadPanel from './components/VideoUploadPanel';

const JoltsVideoStudio = () => {
  const [activeTab, setActiveTab] = useState('record');
  const [videoFile, setVideoFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMode, setRecordingMode] = useState('camera'); // camera, screen
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [generatedCaptions, setGeneratedCaptions] = useState([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  const videoRef = useRef(null);

  const handleVideoUpload = (file) => {
    setVideoFile(file);
    setActiveTab('edit');
  };

  const handleRecordingComplete = (recordedBlob) => {
    setVideoFile(recordedBlob);
    setActiveTab('edit');
  };

  const handleCaptionsGenerated = (captions) => {
    setGeneratedCaptions(captions);
  };

  const handleHashtagsGenerated = (hashtags) => {
    setSuggestedHashtags(hashtags);
  };

  const handlePublish = async () => {
    // Publish to Kinetic Spindle carousel
    console.log('Publishing Jolt with:', {
      video: videoFile,
      audio: selectedAudio,
      captions: generatedCaptions,
      hashtags: suggestedHashtags,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Jolts Video Studio</h1>
                <p className="text-sm text-gray-400">Create viral short-form content with AI</p>
              </div>
            </div>
            <button
              onClick={handlePublish}
              disabled={!videoFile}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish to Kinetic Spindle
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 bg-black/30 backdrop-blur-sm rounded-xl p-2">
          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'record' ?'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-5 h-5 inline-block mr-2" />
            Record
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'upload' ?'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            Upload
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            disabled={!videoFile}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              activeTab === 'edit' ?'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' :'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wand2 className="w-5 h-5 inline-block mr-2" />
            AI Enhancement
          </button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'record' && (
              <VideoRecordingPanel
                onRecordingComplete={handleRecordingComplete}
                recordingMode={recordingMode}
                setRecordingMode={setRecordingMode}
              />
            )}

            {activeTab === 'upload' && (
              <VideoUploadPanel onVideoUpload={handleVideoUpload} />
            )}

            {activeTab === 'edit' && videoFile && (
              <>
                <AIAutoCaptionsPanel
                  videoFile={videoFile}
                  onCaptionsGenerated={handleCaptionsGenerated}
                />
                <TrendingSoundIntegration
                  onAudioSelected={setSelectedAudio}
                  selectedAudio={selectedAudio}
                />
                <HashtagIntelligenceEngine
                  videoFile={videoFile}
                  onHashtagsGenerated={handleHashtagsGenerated}
                />
              </>
            )}
          </div>

          {/* Performance Preview Sidebar */}
          <div className="lg:col-span-1">
            <PerformancePreviewPanel
              videoFile={videoFile}
              captions={generatedCaptions}
              hashtags={suggestedHashtags}
              audio={selectedAudio}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoltsVideoStudio;