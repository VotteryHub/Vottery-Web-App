import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function StreamManagementPanel() {
  const [streamSettings, setStreamSettings] = useState({
    quality: '1080p',
    bitrate: '6000',
    framerate: '60',
    audioQuality: 'high',
    chatEnabled: true,
    moderationLevel: 'medium'
  });

  const qualityOptions = ['4K', '1080p', '720p', '480p', '360p'];
  const bitrateOptions = ['8000', '6000', '4500', '3000', '1500'];
  const framerateOptions = ['60', '30', '24'];
  const audioOptions = ['high', 'medium', 'low'];
  const moderationLevels = ['strict', 'medium', 'relaxed'];

  return (
    <div className="space-y-6">
      {/* Broadcast Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Video" className="w-5 h-5 text-red-600" />
          Broadcast Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video Quality
            </label>
            <select
              value={streamSettings?.quality}
              onChange={(e) => setStreamSettings({ ...streamSettings, quality: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {qualityOptions?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bitrate (kbps)
            </label>
            <select
              value={streamSettings?.bitrate}
              onChange={(e) => setStreamSettings({ ...streamSettings, bitrate: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {bitrateOptions?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frame Rate (fps)
            </label>
            <select
              value={streamSettings?.framerate}
              onChange={(e) => setStreamSettings({ ...streamSettings, framerate: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {framerateOptions?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audio Quality
            </label>
            <select
              value={streamSettings?.audioQuality}
              onChange={(e) => setStreamSettings({ ...streamSettings, audioQuality: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {audioOptions?.map(option => (
                <option key={option} value={option}>{option?.charAt(0)?.toUpperCase() + option?.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <Icon name="Radio" className="w-5 h-5" />
            Start Broadcast
          </button>
          <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
            <Icon name="Pause" className="w-5 h-5" />
            Pause Stream
          </button>
          <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
            <Icon name="StopCircle" className="w-5 h-5" />
            End Broadcast
          </button>
        </div>
      </div>
      {/* Chat Moderation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Shield" className="w-5 h-5 text-blue-600" />
          Chat Moderation
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Live Chat</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Allow viewers to send messages</p>
            </div>
            <button
              onClick={() => setStreamSettings({ ...streamSettings, chatEnabled: !streamSettings?.chatEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                streamSettings?.chatEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  streamSettings?.chatEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Moderation Level
            </label>
            <select
              value={streamSettings?.moderationLevel}
              onChange={(e) => setStreamSettings({ ...streamSettings, moderationLevel: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {moderationLevels?.map(level => (
                <option key={level} value={level}>{level?.charAt(0)?.toUpperCase() + level?.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
              <Icon name="AlertTriangle" className="w-4 h-4" />
              Slow Mode
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <Icon name="Users" className="w-4 h-4" />
              Subscriber Only
            </button>
          </div>
        </div>
      </div>
      {/* Stream Health */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-green-600" />
          Stream Health Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Connection</span>
              <Icon name="Wifi" className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">Excellent</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">98ms latency</p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bandwidth</span>
              <Icon name="Zap" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">6.2 Mbps</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Stable</p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU Usage</span>
              <Icon name="Cpu" className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">42%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Optimal</p>
          </div>
        </div>
      </div>
    </div>
  );
}