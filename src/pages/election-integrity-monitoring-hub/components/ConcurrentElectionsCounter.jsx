import React, { useState, useEffect } from 'react';
import { Vote, Play, Clock, CheckCircle, ChevronRight } from 'lucide-react';

const MOCK_ELECTIONS = [
  { id: 1, title: 'US Presidential Primary 2026', status: 'active', votes: 2847293, participants: 4200000, category: 'Political' },
  { id: 2, title: 'EU Parliament Technology Policy Vote', status: 'active', votes: 1234567, participants: 2100000, category: 'Policy' },
  { id: 3, title: 'Global Climate Action Survey', status: 'active', votes: 987654, participants: 1500000, category: 'Survey' },
  { id: 4, title: 'Tech Industry Best Practices Poll', status: 'active', votes: 456789, participants: 800000, category: 'Industry' },
  { id: 5, title: 'City Council Budget Allocation', status: 'active', votes: 234567, participants: 450000, category: 'Local' },
  { id: 6, title: 'University Student Council Election', status: 'scheduled', votes: 0, participants: 25000, category: 'Education', startsIn: '2h 15m' },
  { id: 7, title: 'Corporate Board Member Vote', status: 'scheduled', votes: 0, participants: 1200, category: 'Corporate', startsIn: '4h 30m' },
  { id: 8, title: 'Community Park Renovation Survey', status: 'completed', votes: 8934, participants: 12000, category: 'Community' },
  { id: 9, title: 'Sports Team MVP Selection', status: 'completed', votes: 45678, participants: 60000, category: 'Sports' },
];

const ConcurrentElectionsCounter = () => {
  const [selectedElection, setSelectedElection] = useState(null);
  const [filter, setFilter] = useState('all');
  const [liveVotes, setLiveVotes] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const updates = {};
      MOCK_ELECTIONS?.filter(e => e?.status === 'active')?.forEach(e => {
        updates[e.id] = (liveVotes?.[e?.id] || e?.votes) + Math.floor(Math.random() * 50);
      });
      setLiveVotes(prev => ({ ...prev, ...updates }));
    }, 2000);
    return () => clearInterval(interval);
  }, [liveVotes]);

  const active = MOCK_ELECTIONS?.filter(e => e?.status === 'active');
  const scheduled = MOCK_ELECTIONS?.filter(e => e?.status === 'scheduled');
  const completed = MOCK_ELECTIONS?.filter(e => e?.status === 'completed');

  const filtered = filter === 'all' ? MOCK_ELECTIONS : MOCK_ELECTIONS?.filter(e => e?.status === filter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-3.5 h-3.5 text-green-400" />;
      case 'scheduled': return <Clock className="w-3.5 h-3.5 text-blue-400" />;
      case 'completed': return <CheckCircle className="w-3.5 h-3.5 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Vote className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Concurrent Elections Monitor</h3>
            <p className="text-gray-400 text-sm">Real-time election status with drill-down analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs">5s refresh</span>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setFilter(filter === 'active' ? 'all' : 'active')}
          className={`rounded-lg p-4 cursor-pointer border transition-colors ${filter === 'active' ? 'bg-green-500/20 border-green-500/50' : 'bg-gray-800 border-gray-700 hover:border-green-500/30'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">Active</span>
          </div>
          <p className="text-green-400 text-3xl font-bold">{active?.length}</p>
          <p className="text-gray-500 text-xs mt-1">{active?.reduce((s, e) => s + (liveVotes?.[e?.id] || e?.votes), 0)?.toLocaleString()} total votes</p>
        </div>
        <div
          onClick={() => setFilter(filter === 'scheduled' ? 'all' : 'scheduled')}
          className={`rounded-lg p-4 cursor-pointer border transition-colors ${filter === 'scheduled' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-gray-800 border-gray-700 hover:border-blue-500/30'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-sm">Scheduled</span>
          </div>
          <p className="text-blue-400 text-3xl font-bold">{scheduled?.length}</p>
          <p className="text-gray-500 text-xs mt-1">Upcoming elections</p>
        </div>
        <div
          onClick={() => setFilter(filter === 'completed' ? 'all' : 'completed')}
          className={`rounded-lg p-4 cursor-pointer border transition-colors ${filter === 'completed' ? 'bg-gray-600/20 border-gray-500/50' : 'bg-gray-800 border-gray-700 hover:border-gray-500/30'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Completed</span>
          </div>
          <p className="text-gray-300 text-3xl font-bold">{completed?.length}</p>
          <p className="text-gray-500 text-xs mt-1">Today</p>
        </div>
      </div>
      {/* Election List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filtered?.map((election) => (
          <div
            key={election?.id}
            onClick={() => setSelectedElection(selectedElection?.id === election?.id ? null : election)}
            className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-750 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                {getStatusIcon(election?.status)}
                <span className="text-white text-sm font-medium truncate">{election?.title}</span>
                <span className="text-gray-600 text-xs bg-gray-700 px-2 py-0.5 rounded flex-shrink-0">{election?.category}</span>
              </div>
              <div className="flex items-center gap-3 ml-3">
                {election?.status === 'active' && (
                  <span className="text-green-400 text-sm font-medium">{(liveVotes?.[election?.id] || election?.votes)?.toLocaleString()}</span>
                )}
                {election?.status === 'scheduled' && (
                  <span className="text-blue-400 text-xs">Starts in {election?.startsIn}</span>
                )}
                <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${selectedElection?.id === election?.id ? 'rotate-90' : ''}`} />
              </div>
            </div>
            {selectedElection?.id === election?.id && (
              <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Participants</p>
                  <p className="text-white font-medium">{election?.participants?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Votes Cast</p>
                  <p className="text-white font-medium">{(liveVotes?.[election?.id] || election?.votes)?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Participation</p>
                  <p className="text-white font-medium">{election?.participants > 0 ? (((liveVotes?.[election?.id] || election?.votes) / election?.participants) * 100)?.toFixed(1) : 0}%</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcurrentElectionsCounter;
