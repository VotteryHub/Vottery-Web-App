import React, { useState } from 'react';
import { Palette, Sparkles, Sun, Moon, Contrast, Droplet, Wind, Zap } from 'lucide-react';

const FilterEffectsPanel = ({ mediaFiles, onFilterApplied }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterIntensity, setFilterIntensity] = useState(100);

  const filters = [
    {
      id: 'vivid',
      name: 'Vivid',
      icon: <Sun className="w-5 h-5" />,
      description: 'Boost colors and saturation',
      cssFilter: 'saturate(150%) contrast(110%)',
    },
    {
      id: 'dramatic',
      name: 'Dramatic',
      icon: <Contrast className="w-5 h-5" />,
      description: 'High contrast black & white',
      cssFilter: 'grayscale(100%) contrast(150%)',
    },
    {
      id: 'warm',
      name: 'Warm',
      icon: <Droplet className="w-5 h-5" />,
      description: 'Warm golden tones',
      cssFilter: 'sepia(40%) saturate(120%)',
    },
    {
      id: 'cool',
      name: 'Cool',
      icon: <Wind className="w-5 h-5" />,
      description: 'Cool blue tones',
      cssFilter: 'hue-rotate(180deg) saturate(110%)',
    },
    {
      id: 'vintage',
      name: 'Vintage',
      icon: <Moon className="w-5 h-5" />,
      description: 'Retro film look',
      cssFilter: 'sepia(50%) contrast(90%) brightness(95%)',
    },
    {
      id: 'neon',
      name: 'Neon',
      icon: <Zap className="w-5 h-5" />,
      description: 'Vibrant neon glow',
      cssFilter: 'saturate(200%) brightness(110%) contrast(120%)',
    },
    {
      id: 'soft',
      name: 'Soft',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Soft dreamy effect',
      cssFilter: 'brightness(105%) contrast(90%) saturate(90%)',
    },
    {
      id: 'sharp',
      name: 'Sharp',
      icon: <Palette className="w-5 h-5" />,
      description: 'Enhanced sharpness',
      cssFilter: 'contrast(130%) brightness(105%)',
    },
  ];

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    onFilterApplied(filter);
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Palette className="w-6 h-6 text-pink-400" />
          <h3 className="text-xl font-bold text-white">Filters & Effects</h3>
        </div>
        {selectedFilter && (
          <button
            onClick={() => {
              setSelectedFilter(null);
              setFilterIntensity(100);
            }}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            Clear Filter
          </button>
        )}
      </div>
      {/* Filter Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {filters?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => handleFilterSelect(filter)}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
              selectedFilter?.id === filter?.id
                ? 'ring-2 ring-pink-400 scale-105' :'hover:scale-105'
            }`}
          >
            <div
              className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"
              style={{ filter: filter?.cssFilter }}
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
              <div className="text-white mb-1">{filter?.icon}</div>
              <p className="text-white text-xs font-medium">{filter?.name}</p>
            </div>
          </button>
        ))}
      </div>
      {/* Filter Intensity Slider */}
      {selectedFilter && (
        <div className="bg-white/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{selectedFilter?.name}</p>
              <p className="text-sm text-gray-400">{selectedFilter?.description}</p>
            </div>
            <span className="text-pink-400 font-bold">{filterIntensity}%</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Intensity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filterIntensity}
              onChange={(e) => setFilterIntensity(Number(e?.target?.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(244, 114, 182) 0%, rgb(244, 114, 182) ${filterIntensity}%, rgb(55, 65, 81) ${filterIntensity}%, rgb(55, 65, 81) 100%)`,
              }}
            />
          </div>
        </div>
      )}
      {/* Advanced Adjustments */}
      <div className="mt-6 space-y-3">
        <h4 className="text-lg font-bold text-white">Advanced Adjustments</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <label className="text-sm text-gray-400 mb-2 block">Brightness</label>
            <input
              type="range"
              min="50"
              max="150"
              defaultValue="100"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <label className="text-sm text-gray-400 mb-2 block">Contrast</label>
            <input
              type="range"
              min="50"
              max="150"
              defaultValue="100"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <label className="text-sm text-gray-400 mb-2 block">Saturation</label>
            <input
              type="range"
              min="0"
              max="200"
              defaultValue="100"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <label className="text-sm text-gray-400 mb-2 block">Blur</label>
            <input
              type="range"
              min="0"
              max="10"
              defaultValue="0"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterEffectsPanel;