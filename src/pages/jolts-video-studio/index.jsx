import React, { useState, useRef } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="Jolts Studio" showSidebar={true}>
      <div className="w-full py-0">
        <div className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/40 animate-float">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight uppercase">Jolts Studio</h1>
                <p className="text-slate-100 font-medium">Create viral short-form content with Vottery AI intelligence</p>
              </div>
            </div>
            <button
              onClick={handlePublish}
              disabled={!videoFile}
              className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-orange-500/40 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              Publish to Spindle
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="space-y-10">
          <div className="flex gap-2 bg-black/20 backdrop-blur-md rounded-2xl p-2 border border-white/5 shadow-inner">
            <button
              onClick={() => setActiveTab('record')}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${
                activeTab === 'record' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Record</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${
                activeTab === 'upload' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              disabled={!videoFile}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 disabled:opacity-20 ${
                activeTab === 'edit' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>AI Enhancement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              {activeTab === 'record' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <VideoRecordingPanel
                    onRecordingComplete={handleRecordingComplete}
                    recordingMode={recordingMode}
                    setRecordingMode={setRecordingMode}
                  />
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <VideoUploadPanel onVideoUpload={handleVideoUpload} />
                </div>
              )}

              {activeTab === 'edit' && videoFile && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
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
      </div>
    </GeneralPageLayout>
  );
};

export default JoltsVideoStudio;