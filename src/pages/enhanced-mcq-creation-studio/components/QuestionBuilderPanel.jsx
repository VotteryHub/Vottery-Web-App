import React, { useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';
import mcqService from '../../../services/mcqService';
import ClaudeSuggestionsPanel from './ClaudeSuggestionsPanel';

const CHAR_LIMITS = [50, 500, 2000];
const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'];
const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'free_text', label: 'Free Text' }
];

const QuestionBuilderPanel = ({ questions, onChange }) => {
  const [uploadingImage, setUploadingImage] = useState({});
  const [expandedSuggestions, setExpandedSuggestions] = useState({});
  const questionImageRefs = useRef({});
  const optionImageRefs = useRef({});

  const addQuestion = () => {
    const newQ = {
      id: Date.now(),
      questionText: '',
      questionType: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      correctAnswerIndex: 0,
      explanation: '',
      difficulty: 'medium',
      isRequired: true,
      charLimit: 500,
      questionImageUrl: null,
      optionImages: {}
    };
    onChange([...questions, newQ]);
  };

  const removeQuestion = (id) => onChange(questions?.filter(q => q?.id !== id));

  const updateQuestion = (id, field, value) =>
    onChange(questions?.map(q => q?.id === id ? { ...q, [field]: value } : q));

  const updateOption = (questionId, optionIndex, value) =>
    onChange(questions?.map(q => {
      if (q?.id !== questionId) return q;
      const newOptions = [...(q?.options || [])];
      newOptions[optionIndex] = value;
      const newCorrectAnswer = q?.correctAnswerIndex === optionIndex ? value : q?.correctAnswer;
      return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
    }));

  const setCorrectAnswer = (questionId, optionIndex) =>
    onChange(questions?.map(q => {
      if (q?.id !== questionId) return q;
      return { ...q, correctAnswerIndex: optionIndex, correctAnswer: q?.options?.[optionIndex] || '' };
    }));

  const addOption = (questionId) =>
    onChange(questions?.map(q => {
      if (q?.id !== questionId || (q?.options?.length || 0) >= 10) return q;
      return { ...q, options: [...(q?.options || []), ''] };
    }));

  const removeOption = (questionId, optionIndex) =>
    onChange(questions?.map(q => {
      if (q?.id !== questionId || (q?.options?.length || 0) <= 2) return q;
      const newOptions = q?.options?.filter((_, i) => i !== optionIndex);
      const newIdx = q?.correctAnswerIndex >= optionIndex && q?.correctAnswerIndex > 0 ? q?.correctAnswerIndex - 1 : q?.correctAnswerIndex;
      return { ...q, options: newOptions, correctAnswerIndex: newIdx, correctAnswer: newOptions?.[newIdx] || '' };
    }));

  const handleQuestionImageUpload = async (questionId, file) => {
    if (!file) return;
    setUploadingImage(prev => ({ ...prev, [`q_${questionId}`]: true }));
    try {
      const { data, error } = await mcqService?.uploadQuestionImage(file, 'draft', String(questionId));
      if (!error && data?.publicUrl) updateQuestion(questionId, 'questionImageUrl', data?.publicUrl);
    } finally {
      setUploadingImage(prev => ({ ...prev, [`q_${questionId}`]: false }));
    }
  };

  const handleOptionImageUpload = async (questionId, optionIndex, file) => {
    if (!file) return;
    const key = `opt_${questionId}_${optionIndex}`;
    setUploadingImage(prev => ({ ...prev, [key]: true }));
    try {
      const { data, error } = await mcqService?.uploadOptionImage(file, 'draft', String(questionId), optionIndex, '');
      if (!error && data?.publicUrl) {
        onChange(questions?.map(q => {
          if (q?.id !== questionId) return q;
          return { ...q, optionImages: { ...(q?.optionImages || {}), [optionIndex]: data?.publicUrl } };
        }));
      }
    } finally {
      setUploadingImage(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleApplyClaudeSuggestion = (questionId, updates) => {
    onChange(questions?.map(q => q?.id === questionId ? { ...q, ...updates } : q));
  };

  const toggleSuggestions = (questionId) => {
    setExpandedSuggestions(prev => ({ ...prev, [questionId]: !prev?.[questionId] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Questions ({questions?.length || 0})</h3>
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Icon name="Plus" size={16} />
          Add Question
        </button>
      </div>
      {questions?.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <Icon name="HelpCircle" size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-muted-foreground">No questions yet. Click "Add Question" to start building.</p>
        </div>
      )}
      {questions?.map((question, qIndex) => (
        <div key={question?.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">{qIndex + 1}</div>
              <span className="font-medium text-foreground">Question {qIndex + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSuggestions(question?.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  expandedSuggestions?.[question?.id]
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <Icon name="Sparkles" size={13} />
                AI Suggestions
              </button>
              <button onClick={() => removeQuestion(question?.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg">
                <Icon name="Trash2" size={14} className="text-red-500" />
              </button>
            </div>
          </div>

          {/* Claude Suggestions Panel */}
          {expandedSuggestions?.[question?.id] && (
            <div className="mb-4">
              <ClaudeSuggestionsPanel
                question={question}
                onApply={(updates) => handleApplyClaudeSuggestion(question?.id, updates)}
              />
            </div>
          )}

          {/* Type / Difficulty / Required row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Type</label>
              <select
                value={question?.questionType || 'multiple_choice'}
                onChange={e => updateQuestion(question?.id, 'questionType', e?.target?.value)}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-xs focus:outline-none"
              >
                {QUESTION_TYPES?.map(t => <option key={t?.value} value={t?.value}>{t?.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Difficulty</label>
              <select
                value={question?.difficulty || 'medium'}
                onChange={e => updateQuestion(question?.id, 'difficulty', e?.target?.value)}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-xs focus:outline-none"
              >
                {DIFFICULTY_OPTIONS?.map(d => <option key={d} value={d}>{d?.charAt(0)?.toUpperCase() + d?.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Required</label>
              <div className="flex items-center h-[30px]">
                <button
                  onClick={() => updateQuestion(question?.id, 'isRequired', !question?.isRequired)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    question?.isRequired !== false ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    question?.isRequired !== false ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Question text */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-foreground mb-1">Question Text *</label>
            <textarea
              value={question?.questionText}
              onChange={e => updateQuestion(question?.id, 'questionText', e?.target?.value)}
              placeholder="Enter question..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          {/* Question image */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-foreground mb-1">Question Image</label>
            {question?.questionImageUrl ? (
              <div className="relative inline-block">
                <img src={question?.questionImageUrl} alt="Question" className="h-20 w-auto rounded-lg border border-gray-200 object-cover" />
                <button onClick={() => updateQuestion(question?.id, 'questionImageUrl', null)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Icon name="X" size={10} className="text-white" />
                </button>
              </div>
            ) : (
              <>
                <input type="file" accept="image/*"
                  ref={el => questionImageRefs.current[question?.id] = el}
                  onChange={e => handleQuestionImageUpload(question?.id, e?.target?.files?.[0])}
                  className="hidden"
                />
                <button
                  onClick={() => questionImageRefs?.current?.[question?.id]?.click()}
                  disabled={uploadingImage?.[`q_${question?.id}`]}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {uploadingImage?.[`q_${question?.id}`] ? <><Icon name="Loader" size={12} className="animate-spin" />Uploading...</> : <><Icon name="Image" size={12} />Upload Image</>}
                </button>
              </>
            )}
          </div>

          {/* Free text char limit */}
          {question?.questionType === 'free_text' && (
            <div className="mb-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
              <label className="block text-xs font-medium text-foreground mb-2">Character Limit</label>
              <div className="flex gap-2">
                {CHAR_LIMITS?.map(limit => (
                  <button key={limit}
                    onClick={() => updateQuestion(question?.id, 'charLimit', limit)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      question?.charLimit === limit ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-foreground hover:border-purple-400'
                    }`}
                  >{limit}</button>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          {question?.questionType !== 'free_text' && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">Options</label>
              <div className="space-y-2">
                {question?.options?.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <button
                      onClick={() => setCorrectAnswer(question?.id, optIndex)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        question?.correctAnswerIndex === optIndex ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {question?.correctAnswerIndex === optIndex && <Icon name="Check" size={10} className="text-white" />}
                    </button>
                    <input
                      type="text" value={option}
                      onChange={e => updateOption(question?.id, optIndex, e?.target?.value)}
                      placeholder={`Option ${optIndex + 1}`}
                      className={`flex-1 px-2 py-1.5 border rounded-lg bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none ${
                        question?.correctAnswerIndex === optIndex ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {/* Option image */}
                    {question?.optionImages?.[optIndex] ? (
                      <div className="relative flex-shrink-0">
                        <img src={question?.optionImages?.[optIndex]} alt={`Opt ${optIndex+1}`} className="w-7 h-7 rounded object-cover border" />
                        <button
                          onClick={() => {
                            const updated = questions?.map(q => {
                              if (q?.id !== question?.id) return q;
                              const imgs = { ...(q?.optionImages || {}) }; delete imgs?.[optIndex];
                              return { ...q, optionImages: imgs };
                            });
                            onChange(updated);
                          }}
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <Icon name="X" size={7} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input type="file" accept="image/*"
                          ref={el => { if (!optionImageRefs?.current?.[question?.id]) optionImageRefs.current[question?.id] = {}; optionImageRefs.current[question?.id][optIndex] = el; }}
                          onChange={e => handleOptionImageUpload(question?.id, optIndex, e?.target?.files?.[0])}
                          className="hidden"
                        />
                        <button
                          onClick={() => optionImageRefs?.current?.[question?.id]?.[optIndex]?.click()}
                          disabled={uploadingImage?.[`opt_${question?.id}_${optIndex}`]}
                          className="w-7 h-7 flex items-center justify-center border border-dashed border-gray-300 rounded hover:border-primary flex-shrink-0"
                        >
                          {uploadingImage?.[`opt_${question?.id}_${optIndex}`] ? <Icon name="Loader" size={10} className="animate-spin text-muted-foreground" /> : <Icon name="Image" size={10} className="text-muted-foreground" />}
                        </button>
                      </>
                    )}
                    {(question?.options?.length || 0) > 2 && (
                      <button onClick={() => removeOption(question?.id, optIndex)} className="p-1 hover:bg-red-100 rounded flex-shrink-0">
                        <Icon name="X" size={12} className="text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {(question?.options?.length || 0) < 10 && (
                <button onClick={() => addOption(question?.id)} className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline">
                  <Icon name="Plus" size={12} />Add Option
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionBuilderPanel;
