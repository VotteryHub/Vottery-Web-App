import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { messagingService } from '../../../services/messagingService';

const MediaGallery = ({ thread, onClose }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (thread?.id) {
      loadMedia();
    }
  }, [thread?.id]);

  const loadMedia = async () => {
    try {
      const { data, error } = await messagingService?.getThreadMedia(thread?.id);
      if (error) throw new Error(error?.message);
      setMedia(data || []);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = filter === 'all' 
    ? media 
    : media?.filter(m => m?.mediaType === filter);

  const mediaTypes = [
    { value: 'all', label: 'All', icon: 'Grid' },
    { value: 'image', label: 'Images', icon: 'Image' },
    { value: 'video', label: 'Videos', icon: 'Video' },
    { value: 'voice', label: 'Voice', icon: 'Mic' },
    { value: 'file', label: 'Files', icon: 'File' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Media Gallery</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 flex-wrap">
            {mediaTypes?.map((type) => (
              <button
                key={type?.value}
                onClick={() => setFilter(type?.value)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  filter === type?.value
                    ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon name={type?.icon} size={16} />
                <span className="text-sm font-medium">{type?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Icon name="Loader" size={48} className="animate-spin text-primary" />
            </div>
          ) : filteredMedia?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Icon name="Image" size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No media found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia?.map((item) => (
                <div
                  key={item?.id}
                  onClick={() => setSelectedMedia(item)}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100 dark:bg-gray-700"
                >
                  {item?.mediaType === 'image' && (
                    <Image
                      src={item?.thumbnailUrl || item?.mediaUrl}
                      alt={item?.mediaAlt || 'Media item'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {item?.mediaType === 'video' && (
                    <div className="relative w-full h-full">
                      <Image
                        src={item?.thumbnailUrl || 'https://via.placeholder.com/300x300?text=Video'}
                        alt={item?.mediaAlt || 'Video thumbnail'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Icon name="Play" size={32} className="text-white" />
                      </div>
                    </div>
                  )}
                  {item?.mediaType === 'voice' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-primary/10">
                      <Icon name="Mic" size={32} className="text-primary mb-2" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {item?.duration ? `${Math.floor(item?.duration / 60)}:${(item?.duration % 60)?.toString()?.padStart(2, '0')}` : 'Voice'}
                      </span>
                    </div>
                  )}
                  {item?.mediaType === 'file' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-600">
                      <Icon name="File" size={32} className="text-gray-600 dark:text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-center px-2">
                        {item?.fileSize ? `${(item?.fileSize / 1024 / 1024)?.toFixed(2)} MB` : 'File'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Media Preview */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
            <div className="max-w-4xl max-h-[90vh]" onClick={(e) => e?.stopPropagation()}>
              {selectedMedia?.mediaType === 'image' && (
                <Image
                  src={selectedMedia?.mediaUrl}
                  alt={selectedMedia?.mediaAlt || 'Full size image'}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              )}
              {selectedMedia?.mediaType === 'video' && (
                <video
                  src={selectedMedia?.mediaUrl}
                  controls
                  className="max-w-full max-h-[90vh] rounded-lg"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;