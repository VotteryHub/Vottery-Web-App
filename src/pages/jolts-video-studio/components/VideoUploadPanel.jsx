import React, { useState, useRef } from 'react';
import { Upload, Film, X } from 'lucide-react';

const VideoUploadPanel = ({ onVideoUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);

    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileSelection(files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (file && file?.type?.startsWith('video/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onVideoUpload(selectedFile);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Upload Video</h3>
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef?.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-yellow-400 bg-yellow-400/10' :'border-gray-600 hover:border-yellow-400 hover:bg-white/5'
          }`}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold text-white mb-2">
            Drag and drop your video here
          </p>
          <p className="text-sm text-gray-400 mb-4">or click to browse</p>
          <p className="text-xs text-gray-500">
            Supports MP4, MOV, AVI (Max 500MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Video Preview */}
          <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16]">
            <video
              src={previewUrl}
              controls
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-4 right-4 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* File Info */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Film className="w-8 h-8 text-yellow-400" />
              <div className="flex-1">
                <p className="text-white font-medium">{selectedFile?.name}</p>
                <p className="text-sm text-gray-400">
                  {(selectedFile?.size / (1024 * 1024))?.toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Continue to AI Enhancement
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploadPanel;