import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const BroadcastEnginePanel = ({ electionId, onInject, loading }) => {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [scheduleMode, setScheduleMode] = useState('immediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const addOption = () => {
    if (options?.length < 6) setOptions(prev => [...prev, '']);
  };

  const removeOption = (idx) => {
    if (options?.length > 2) setOptions(prev => prev?.filter((_, i) => i !== idx));
  };

  const updateOption = (idx, val) => {
    setOptions(prev => prev?.map((o, i) => i === idx ? val : o));
  };

  const handleSubmit = async () => {
    if (!questionText?.trim()) return;
    setIsSubmitting(true);
    try {
      const question = {
        questionText: questionText?.trim(),
        questionType,
        options: questionType === 'multiple_choice' ? options?.filter(o => o?.trim()) : [],
        correctAnswer: correctAnswer?.trim()
      };
      const scheduled = scheduleMode === 'scheduled' && scheduledFor ? scheduledFor : null;
      await onInject?.(question, scheduled);
      setSuccessMsg('Question injected successfully!');
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      setScheduledFor('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
          <Icon name="Zap" size={20} className="text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Live Broadcasting Engine</h3>
          <p className="text-xs text-muted-foreground">Create and inject questions in real-time</p>
        </div>
      </div>
      {successMsg && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
          <Icon name="CheckCircle" size={16} />
          {successMsg}
        </div>
      )}
      <div className="space-y-4">
        {/* Question Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Question Type</label>
          <div className="flex gap-2">
            {['multiple_choice', 'free_text']?.map(type => (
              <button
                key={type}
                onClick={() => setQuestionType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  questionType === type
                    ? 'bg-green-600 text-white' :'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200'
                }`}
              >
                {type === 'multiple_choice' ? 'Multiple Choice' : 'Free Text'}
              </button>
            ))}
          </div>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Question Text *</label>
          <textarea
            value={questionText}
            onChange={e => setQuestionText(e?.target?.value)}
            placeholder="Enter your live question..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
          />
        </div>

        {/* Options for multiple choice */}
        {questionType === 'multiple_choice' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Answer Options</label>
            <div className="space-y-2">
              {options?.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === opt && opt !== ''}
                    onChange={() => setCorrectAnswer(opt)}
                    className="accent-green-600"
                    title="Mark as correct"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={e => updateOption(idx, e?.target?.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  {options?.length > 2 && (
                    <button onClick={() => removeOption(idx)} className="p-1 hover:bg-red-100 rounded">
                      <Icon name="X" size={14} className="text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options?.length < 6 && (
              <button onClick={addOption} className="mt-2 text-sm text-green-600 hover:underline flex items-center gap-1">
                <Icon name="Plus" size={14} /> Add Option
              </button>
            )}
            <p className="text-xs text-muted-foreground mt-1">Select radio button to mark correct answer</p>
          </div>
        )}

        {/* Schedule Mode */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Broadcast Timing</label>
          <div className="flex gap-2 mb-2">
            {['immediate', 'scheduled']?.map(mode => (
              <button
                key={mode}
                onClick={() => setScheduleMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  scheduleMode === mode
                    ? 'bg-blue-600 text-white' :'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200'
                }`}
              >
                {mode === 'immediate' ? '⚡ Immediate' : '📅 Scheduled'}
              </button>
            ))}
          </div>
          {scheduleMode === 'scheduled' && (
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={e => setScheduledFor(e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!questionText?.trim() || isSubmitting || loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <><Icon name="Loader" size={18} className="animate-spin" /> Injecting...</>
          ) : (
            <><Icon name="Send" size={18} /> {scheduleMode === 'scheduled' ? 'Schedule Injection' : 'Broadcast Now'}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default BroadcastEnginePanel;
