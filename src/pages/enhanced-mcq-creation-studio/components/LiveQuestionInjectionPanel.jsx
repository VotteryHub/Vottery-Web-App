import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import mcqService from '../../../services/mcqService';

const LiveQuestionInjectionPanel = ({ electionId }) => {
  const [queue, setQueue] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ questionText: '', options: ['', ''], correctAnswer: '', questionType: 'multiple_choice', scheduledFor: '' });
  const [loading, setLoading] = useState(false);
  const [broadcasting, setBroadcasting] = useState({});

  useEffect(() => {
    if (!electionId) return;
    loadQueue();
    loadAnalytics();
  }, [electionId]);

  const loadQueue = async () => {
    const { data } = await mcqService?.getLiveQuestionInjectionQueue(electionId);
    setQueue(data || []);
  };

  const loadAnalytics = async () => {
    const { data } = await mcqService?.getLiveQuestionBroadcastAnalytics(electionId);
    setAnalytics(data || []);
  };

  const handleInject = async () => {
    if (!newQuestion?.questionText?.trim()) return;
    setLoading(true);
    try {
      const { error } = await mcqService?.createLiveQuestionInjection(
        electionId,
        newQuestion,
        newQuestion?.scheduledFor || new Date()?.toISOString()
      );
      if (!error) {
        setNewQuestion({ questionText: '', options: ['', ''], correctAnswer: '', questionType: 'multiple_choice', scheduledFor: '' });
        await loadQueue();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (injectionId) => {
    setBroadcasting(prev => ({ ...prev, [injectionId]: true }));
    try {
      await mcqService?.broadcastLiveQuestion(injectionId);
      await loadQueue();
    } finally {
      setBroadcasting(prev => ({ ...prev, [injectionId]: false }));
    }
  };

  const statusColor = (status) => {
    if (status === 'broadcasted') return 'bg-green-100 text-green-700';
    if (status === 'scheduled') return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Live Question Injection</h3>
        <p className="text-sm text-muted-foreground">Inject new questions to active voters in real-time</p>
      </div>
      {/* New injection form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h4 className="font-medium text-foreground mb-3">Create Injection</h4>
        <div className="space-y-3">
          <textarea
            value={newQuestion?.questionText}
            onChange={e => setNewQuestion(prev => ({ ...prev, questionText: e?.target?.value }))}
            placeholder="Question text..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            {newQuestion?.options?.map((opt, i) => (
              <input key={i} type="text" value={opt}
                onChange={e => {
                  const opts = [...newQuestion?.options];
                  opts[i] = e?.target?.value;
                  setNewQuestion(prev => ({ ...prev, options: opts }));
                }}
                placeholder={`Option ${i + 1}`}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:outline-none"
              />
            ))}
          </div>
          <input
            type="datetime-local"
            value={newQuestion?.scheduledFor}
            onChange={e => setNewQuestion(prev => ({ ...prev, scheduledFor: e?.target?.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:outline-none"
          />
          <button
            onClick={handleInject}
            disabled={loading || !newQuestion?.questionText?.trim()}
            className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Icon name="Loader" size={14} className="animate-spin" />Creating...</> : <><Icon name="Zap" size={14} />Queue Injection</>}
          </button>
        </div>
      </div>
      {/* Queue */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h4 className="font-medium text-foreground mb-3">Injection Queue ({queue?.length})</h4>
        {queue?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No injections queued</p>
        ) : (
          <div className="space-y-2">
            {queue?.map(item => (
              <div key={item?.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item?.questionText}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(item?.status)}`}>{item?.status}</span>
                    {item?.scheduledFor && <span className="text-xs text-muted-foreground">{new Date(item?.scheduledFor)?.toLocaleString()}</span>}
                  </div>
                </div>
                {item?.status === 'pending' && (
                  <button
                    onClick={() => handleBroadcast(item?.id)}
                    disabled={broadcasting?.[item?.id]}
                    className="ml-3 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {broadcasting?.[item?.id] ? <Icon name="Loader" size={12} className="animate-spin" /> : <Icon name="Radio" size={12} />}
                    Broadcast
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Analytics */}
      {analytics?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <h4 className="font-medium text-foreground mb-3">Broadcast Analytics</h4>
          <div className="space-y-2">
            {analytics?.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-foreground">Question {i + 1}</span>
                <span className="text-sm font-medium text-primary">{item?.responseRate ?? 0}% response rate</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveQuestionInjectionPanel;
