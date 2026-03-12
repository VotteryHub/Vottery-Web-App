import React, { useState, useRef } from 'react';
import { Upload, Image, Video, Music, X, Plus } from 'lucide-react';

const MediaUploadPanel = ({ onMediaUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
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

    const files = Array.from(e?.dataTransfer?.files);
    handleFileSelection(files);
  };

  const handleFileSelection = (files) => {
    const validFiles = files?.filter(
      (file) => file?.type?.startsWith('image/') || file?.type?.startsWith('video/') || file?.type?.startsWith('audio/')
    );

    if (validFiles?.length > 0) {
      setSelectedFiles([...selectedFiles, ...validFiles]);
      const urls = validFiles?.map((file) => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...urls]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e?.target?.files || []);
    handleFileSelection(files);
  };

  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles?.filter((_, i) => i !== index);
    const newUrls = previewUrls?.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewUrls?.[index]);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleContinue = () => {
    if (selectedFiles?.length > 0) {
      onMediaUpload(selectedFiles);
    }
  };

  const getFileIcon = (file) => {
    if (file?.type?.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (file?.type?.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (file?.type?.startsWith('audio/')) return <Music className="w-6 h-6" />;
    return null;
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Upload Media</h3>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef?.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all mb-6 ${
          isDragging
            ? 'border-pink-400 bg-pink-400/10' :'border-gray-600 hover:border-pink-400 hover:bg-white/5'
        }`}
      >
        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-semibold text-white mb-2">
          Drag and drop your media here
        </p>
        <p className="text-sm text-gray-400 mb-4">or click to browse</p>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Image className="w-4 h-4" />
            <span>Images</span>
          </div>
          <div className="flex items-center space-x-1">
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </div>
          <div className="flex items-center space-x-1">
            <Music className="w-4 h-4" />
            <span>Audio</span>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
      {/* Selected Files Preview */}
      {selectedFiles?.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white">Selected Media ({selectedFiles?.length})</h4>
          <div className="grid grid-cols-2 gap-4">
            {selectedFiles?.map((file, index) => (
              <div
                key={index}
                className="relative bg-white/5 rounded-xl overflow-hidden group"
              >
                {file?.type?.startsWith('image/') && (
                  <img
                    src={previewUrls?.[index]}
                    alt={file?.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                {file?.type?.startsWith('video/') && (
                  <video
                    src={previewUrls?.[index]}
                    className="w-full h-48 object-cover"
                  />
                )}
                {file?.type?.startsWith('audio/') && (
                  <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <Music className="w-16 h-16 text-pink-400" />
                  </div>
                )}

                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {file?.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {(file?.size / (1024 * 1024))?.toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <button
              onClick={() => fileInputRef?.current?.click()}
              className="h-48 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-pink-400 hover:bg-white/5 transition-all"
            >
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-400 text-sm">Add More</span>
            </button>
          </div>

          <button
            onClick={handleContinue}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Continue to Edit & Enhance
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUploadPanel;