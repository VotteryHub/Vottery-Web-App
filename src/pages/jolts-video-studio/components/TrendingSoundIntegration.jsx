import React, { useState, useEffect } from 'react';
import { Music, TrendingUp, Play, Pause, Check, Search } from 'lucide-react';

const TrendingSoundIntegration = ({ onAudioSelected, selectedAudio }) => {
  const [trendingSounds, setTrendingSounds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, viral, trending, popular

  useEffect(() => {
    // Mock trending sounds data
    setTrendingSounds([
      {
        id: 1,
        title: 'Viral Dance Beat 2024',
        artist: 'DJ Trends',
        duration: '0:15',
        usageCount: 1250000,
        trendScore: 98,
        category: 'viral',
        licensed: true,
      },
      {
        id: 2,
        title: 'Epic Motivation',
        artist: 'Inspire Music',
        duration: '0:30',
        usageCount: 890000,
        trendScore: 95,
        category: 'trending',
        licensed: true,
      },
      {
        id: 3,
        title: 'Chill Vibes Loop',
        artist: 'Ambient Sounds',
        duration: '0:20',
        usageCount: 650000,
        trendScore: 87,
        category: 'popular',
        licensed: true,
      },
      {
        id: 4,
        title: 'Comedy Sound Effect',
        artist: 'Funny Audio',
        duration: '0:05',
        usageCount: 2100000,
        trendScore: 99,
        category: 'viral',
        licensed: true,
      },
      {
        id: 5,
        title: 'Upbeat Pop Hook',
        artist: 'Pop Stars',
        duration: '0:25',
        usageCount: 780000,
        trendScore: 92,
        category: 'trending',
        licensed: true,
      },
    ]);
  }, []);

  const filteredSounds = trendingSounds?.filter((sound) => {
    const matchesSearch = sound?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         sound?.artist?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesFilter = filter === 'all' || sound?.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handlePlayPause = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  const handleSelectAudio = (sound) => {
    onAudioSelected(sound);
  };

  const formatUsageCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000)?.toFixed(1)}M`;
    }
    return `${(count / 1000)?.toFixed(0)}K`;
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Music className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Trending Sounds</h3>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span className="text-sm text-gray-400">Updated hourly</span>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div className="flex space-x-2">
          {['all', 'viral', 'trending', 'popular']?.map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                filter === filterOption
                  ? 'bg-yellow-400 text-black' :'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>
      {/* Sounds List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredSounds?.map((sound) => (
          <div
            key={sound?.id}
            className={`bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer ${
              selectedAudio?.id === sound?.id ? 'ring-2 ring-yellow-400' : ''
            }`}
            onClick={() => handleSelectAudio(sound)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    handlePlayPause(sound?.id);
                  }}
                  className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-all"
                >
                  {playingId === sound?.id ? (
                    <Pause className="w-4 h-4 text-black" />
                  ) : (
                    <Play className="w-4 h-4 text-black" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium">{sound?.title}</p>
                    {sound?.category === 'viral' && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                        VIRAL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <span>{sound?.artist}</span>
                    <span>•</span>
                    <span>{sound?.duration}</span>
                    <span>•</span>
                    <span>{formatUsageCount(sound?.usageCount)} uses</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold">{sound?.trendScore}</span>
                  </div>
                  <p className="text-xs text-gray-400">Trend Score</p>
                </div>

                {selectedAudio?.id === sound?.id && (
                  <div className="p-2 bg-green-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSoundIntegration;