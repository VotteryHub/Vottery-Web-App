import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

export default function InteractiveFeaturesPanel() {
  const [activePolls, setActivePolls] = useState([
    {
      id: 1,
      question: 'Which candidate do you support?',
      options: [
        { text: 'Candidate A', votes: 5234, percentage: 45.2 },
        { text: 'Candidate B', votes: 4123, percentage: 35.6 },
        { text: 'Candidate C', votes: 2234, percentage: 19.2 }
      ],
      totalVotes: 11591,
      status: 'active'
    }
  ]);

  const [queuedQuestions, setQueuedQuestions] = useState([
    { id: 1, user: 'John Doe', question: 'What are the key policy changes?', votes: 234, status: 'pending' },
    { id: 2, user: 'Jane Smith', question: 'How will this affect local communities?', votes: 189, status: 'pending' },
    { id: 3, user: 'Mike Johnson', question: 'Timeline for implementation?', votes: 156, status: 'pending' }
  ]);

  const [reactions, setReactions] = useState([
    { emoji: '👍', count: 8234, label: 'Like' },
    { emoji: '❤️', count: 6543, label: 'Love' },
    { emoji: '🎉', count: 4321, label: 'Celebrate' },
    { emoji: '🤔', count: 2134, label: 'Thinking' },
    { emoji: '😮', count: 1876, label: 'Surprised' }
  ]);

  return (
    <div className="space-y-6">
      {/* Live Polling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="BarChart3" className="w-5 h-5 text-blue-600" />
            Live Polling During Stream
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Icon name="Plus" className="w-4 h-4" />
            Create Poll
          </button>
        </div>

        {activePolls?.map(poll => (
          <div key={poll?.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{poll?.question}</h3>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                {poll?.status?.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              {poll?.options?.map((option, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option?.text}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{option?.votes?.toLocaleString()} votes</span>
                      <span className="text-sm font-bold text-blue-600">{option?.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${option?.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Total votes: {poll?.totalVotes?.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                  End Poll
                </button>
                <button className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                  Share Results
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Q&A Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="MessageSquare" className="w-5 h-5 text-purple-600" />
            Q&A Management
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Icon name="Filter" className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {queuedQuestions?.map(question => (
            <div key={question?.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="User" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{question?.user}</span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded">
                      {question?.votes} upvotes
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white">{question?.question}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                    <Icon name="Check" className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                    <Icon name="X" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viewer Reactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Heart" className="w-5 h-5 text-pink-600" />
          Viewer Reactions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {reactions?.map((reaction, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="text-4xl mb-2">{reaction?.emoji}</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{reaction?.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{reaction?.count?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Sharing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Share2" className="w-5 h-5 text-green-600" />
          Social Sharing Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Shares</span>
              <Icon name="Share2" className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">3,456</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">+23% from last stream</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Engagement Rate</span>
              <Icon name="TrendingUp" className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">22.7%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Above average</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Icon name="Facebook" className="w-4 h-4" />
            Share on Facebook
          </button>
          <button className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
            <Icon name="Twitter" className="w-4 h-4" />
            Share on Twitter
          </button>
        </div>
      </div>
    </div>
  );
}