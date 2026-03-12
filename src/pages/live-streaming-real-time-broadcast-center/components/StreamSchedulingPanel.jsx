import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function StreamSchedulingPanel() {
  const [scheduledStreams, setScheduledStreams] = useState([
    {
      id: 1,
      title: 'Weekly Election Results Roundup',
      date: '2026-02-05',
      time: '18:00',
      duration: '60',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Community Q&A Session',
      date: '2026-02-07',
      time: '15:00',
      duration: '45',
      status: 'scheduled'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Calendar" className="w-5 h-5 text-blue-600" />
            Scheduled Broadcasts
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Icon name="Plus" className="w-4 h-4" />
            Schedule Stream
          </button>
        </div>

        <div className="space-y-4">
          {scheduledStreams?.map(stream => (
            <div key={stream?.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{stream?.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" className="w-4 h-4" />
                      {stream?.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" className="w-4 h-4" />
                      {stream?.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Timer" className="w-4 h-4" />
                      {stream?.duration} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}