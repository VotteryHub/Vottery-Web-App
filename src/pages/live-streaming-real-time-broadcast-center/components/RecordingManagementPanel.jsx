import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function RecordingManagementPanel() {
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      title: 'Election Results Announcement 2026',
      date: '2026-01-29',
      duration: '1h 23m',
      views: 15234,
      size: '2.4 GB',
      status: 'processed'
    },
    {
      id: 2,
      title: 'Community Town Hall Meeting',
      date: '2026-01-28',
      duration: '45m',
      views: 8456,
      size: '1.1 GB',
      status: 'processed'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Film" className="w-5 h-5 text-purple-600" />
          Recorded Broadcasts
        </h2>

        <div className="space-y-4">
          {recordings?.map(recording => (
            <div key={recording?.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Icon name="Play" className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{recording?.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" className="w-4 h-4" />
                        {recording?.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" className="w-4 h-4" />
                        {recording?.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" className="w-4 h-4" />
                        {recording?.views?.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="HardDrive" className="w-4 h-4" />
                        {recording?.size}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Icon name="Download" className="w-4 h-4" />
                    Download
                  </button>
                  <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <Icon name="MoreVertical" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Recording Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Settings" className="w-5 h-5 text-gray-600" />
          Recording Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Auto-Record All Streams</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save all broadcasts</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Generate Highlights</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered highlight clips</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}