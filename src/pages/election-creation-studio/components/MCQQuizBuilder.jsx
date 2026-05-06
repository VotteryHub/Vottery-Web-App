import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import mcqService from '../../../services/mcqService';
import { aiOrchestrationService } from '../../../services/aiOrchestrationService';

const CHAR_LIMITS = [50, 500, 2000];
const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'];
const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'free_text', label: 'Free Text' }
];

const MCQQuizBuilder = ({ formData, onChange, errors }) => {
  const [questions, setQuestions] = useState(formData?.mcqQuestions || []);
  const [enforceBeforeVoting, setEnforceBeforeVoting] = useState(formData?.mcqEnforceBeforeVoting || false);
  const [passingScore, setPassingScore] = useState(formData?.mcqPassingScorePercentage ?? 70);
  const [maxAttempts, setMaxAttempts] = useState(formData?.mcqMaxAttempts ?? 3);
  const [uploadingImage, setUploadingImage] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const questionImageRefs = useRef({});
  const optionImageRefs = useRef({});

  const notifyChange = (updatedQuestions, extra = {}) => {
    onChange('mcqQuestions', updatedQuestions);
    if (extra?.passingScore !== undefined) onChange('mcqPassingScorePercentage', extra?.passingScore);
    if (extra?.maxAttempts !== undefined) onChange('mcqMaxAttempts', extra?.maxAttempts);
    if (extra?.enforce !== undefined) onChange('mcqEnforceBeforeVoting', extra?.enforce);
  };

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
    const updated = [...questions, newQ];
    setQuestions(updated);
    notifyChange(updated);
  };

  const removeQuestion = (id) => {
    const updated = questions?.filter(q => q?.id !== id);
    setQuestions(updated);
    notifyChange(updated);
  };

  const updateQuestion = (id, field, value) => {
    const updated = questions?.map(q => q?.id === id ? { ...q, [field]: value } : q);
    setQuestions(updated);
    notifyChange(updated);
  };

  const updateOption = (questionId, optionIndex, value) => {
    const updated = questions?.map(q => {
      if (q?.id !== questionId) return q;
      const newOptions = [...(q?.options || [])];
      newOptions[optionIndex] = value;
      const newCorrectAnswer = q?.correctAnswerIndex === optionIndex ? value : q?.correctAnswer;
      return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
    });
    setQuestions(updated);
    notifyChange(updated);
  };

  const setCorrectAnswer = (questionId, optionIndex) => {
    const updated = questions?.map(q => {
      if (q?.id !== questionId) return q;
      const correctAnswerValue = q?.options?.[optionIndex] || '';
      return { ...q, correctAnswerIndex: optionIndex, correctAnswer: correctAnswerValue };
    });
    setQuestions(updated);
    notifyChange(updated);
  };

  const addOption = (questionId) => {
    const updated = questions?.map(q => {
      if (q?.id !== questionId) return q;
      if ((q?.options?.length || 0) >= 10) return q;
      return { ...q, options: [...(q?.options || []), ''] };
    });
    setQuestions(updated);
    notifyChange(updated);
  };

  const removeOption = (questionId, optionIndex) => {
    const updated = questions?.map(q => {
      if (q?.id !== questionId) return q;
      if ((q?.options?.length || 0) <= 2) return q;
      const newOptions = q?.options?.filter((_, i) => i !== optionIndex);
      const newCorrectIndex = q?.correctAnswerIndex >= optionIndex && q?.correctAnswerIndex > 0
        ? q?.correctAnswerIndex - 1 : q?.correctAnswerIndex;
      const newCorrectAnswer = newOptions?.[newCorrectIndex] || '';
      return { ...q, options: newOptions, correctAnswerIndex: newCorrectIndex, correctAnswer: newCorrectAnswer };
    });
    setQuestions(updated);
    notifyChange(updated);
  };

  const handleEnforceToggle = (checked) => {
    setEnforceBeforeVoting(checked);
    onChange('mcqEnforceBeforeVoting', checked);
  };

  const handlePassingScoreChange = (val) => {
    const v = Number(val);
    setPassingScore(v);
    onChange('mcqPassingScorePercentage', v);
  };

  const handleMaxAttemptsChange = (val) => {
    const v = Number(val);
    setMaxAttempts(v);
    onChange('mcqMaxAttempts', v);
  };

  const handleQuestionImageUpload = async (questionId, file) => {
    if (!file) return;
    setUploadingImage(prev => ({ ...prev, [`q_${questionId}`]: true }));
    try {
      const { data, error } = await mcqService?.uploadQuestionImage(file, 'draft', String(questionId));
      if (!error && data?.publicUrl) {
        updateQuestion(questionId, 'questionImageUrl', data?.publicUrl);
      }
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
        const updated = questions?.map(q => {
          if (q?.id !== questionId) return q;
          return { ...q, optionImages: { ...(q?.optionImages || {}), [optionIndex]: data?.publicUrl } };
        });
        setQuestions(updated);
        notifyChange(updated);
      }
    } finally {
      setUploadingImage(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleGenerateAI = async () => {
    if ((!formData?.title?.trim() && !formData?.description?.trim()) || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const generated = await aiOrchestrationService.generateQuizFromContent(
        formData.title,
        formData.description
      );
      if (generated?.length > 0) {
        const mapped = generated.map((q, i) => ({
          ...q,
          id: Date.now() + i,
          isRequired: true,
          questionImageUrl: null,
          optionImages: {}
        }));
        setQuestions(mapped);
        setEnforceBeforeVoting(true);
        notifyChange(mapped, { enforce: true });
      }
    } catch (err) {
      console.error('Failed to generate AI quiz:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">MCQ Quiz Builder</h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Configure multiple choice questions with advanced settings for voter knowledge checks
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-all disabled:opacity-50"
        >
          <Icon name={isGenerating ? 'RotateCw' : 'Sparkles'} size={16} className={isGenerating ? 'animate-spin' : ''} />
          {isGenerating ? 'Generating...' : 'AI Smart Quiz'}
        </button>
      </div>
      {/* Enforce Before Voting Toggle */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="ShieldCheck" size={20} className="text-blue-600" />
            <div>
              <p className="font-semibold text-foreground">Enforce Quiz Before Voting</p>
              <p className="text-sm text-muted-foreground">Voters must complete the quiz before casting their vote</p>
            </div>
          </div>
          <button
            onClick={() => handleEnforceToggle(!enforceBeforeVoting)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enforceBeforeVoting ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enforceBeforeVoting ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
      {/* Passing Score & Max Attempts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="Target" size={16} className="text-green-600" />
              Passing Score
            </label>
            <span className="text-lg font-bold text-green-600">{passingScore}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={passingScore}
            onChange={e => handlePassingScoreChange(e?.target?.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="RefreshCw" size={16} className="text-orange-600" />
              Max Attempts
            </label>
            <span className="text-lg font-bold text-orange-600">{maxAttempts}</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={maxAttempts}
            onChange={e => handleMaxAttemptsChange(e?.target?.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            {[1,2,3,4,5]?.map(n => <span key={n}>{n}</span>)}
          </div>
        </div>
      </div>
      {/* Questions List */}
      <div className="space-y-6">
        {questions?.map((question, qIndex) => (
          <div key={question?.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {qIndex + 1}
                </div>
                <span className="font-semibold text-foreground">Question {qIndex + 1}</span>
              </div>
              <button
                onClick={() => removeQuestion(question?.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Icon name="Trash2" size={16} className="text-red-500" />
              </button>
            </div>

            {/* Question Type + Difficulty Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Question Type</label>
                <select
                  value={question?.questionType || 'multiple_choice'}
                  onChange={e => updateQuestion(question?.id, 'questionType', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {QUESTION_TYPES?.map(t => (
                    <option key={t?.value} value={t?.value}>{t?.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Difficulty</label>
                <select
                  value={question?.difficulty || 'medium'}
                  onChange={e => updateQuestion(question?.id, 'difficulty', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {DIFFICULTY_OPTIONS?.map(d => (
                    <option key={d} value={d}>{d?.charAt(0)?.toUpperCase() + d?.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <span className="text-sm text-foreground">Required</span>
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

            {/* Question Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Question Text *</label>
              <textarea
                value={question?.questionText}
                onChange={e => updateQuestion(question?.id, 'questionText', e?.target?.value)}
                placeholder="Enter your question here..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
            </div>

            {/* Question Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Question Image (optional)</label>
              {question?.questionImageUrl ? (
                <div className="relative inline-block">
                  <img src={question?.questionImageUrl} alt="Question visual" className="h-24 w-auto rounded-lg border border-gray-200 object-cover" />
                  <button
                    onClick={() => updateQuestion(question?.id, 'questionImageUrl', null)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <Icon name="X" size={10} className="text-white" />
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => questionImageRefs.current[question?.id] = el}
                    onChange={e => handleQuestionImageUpload(question?.id, e?.target?.files?.[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => questionImageRefs?.current?.[question?.id]?.click()}
                    disabled={uploadingImage?.[`q_${question?.id}`]}
                    className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {uploadingImage?.[`q_${question?.id}`] ? (
                      <><Icon name="Loader" size={14} className="animate-spin" /> Uploading...</>
                    ) : (
                      <><Icon name="Image" size={14} /> Upload Question Image</>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Free Text Config */}
            {question?.questionType === 'free_text' && (
              <div className="mb-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <label className="block text-sm font-medium text-foreground mb-2">Character Limit</label>
                <div className="flex gap-2">
                  {CHAR_LIMITS?.map(limit => (
                    <button
                      key={limit}
                      onClick={() => updateQuestion(question?.id, 'charLimit', limit)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        question?.charLimit === limit
                          ? 'bg-purple-600 text-white' :'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-foreground hover:border-purple-400'
                      }`}
                    >
                      {limit} chars
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Multiple Choice Options */}
            {question?.questionType !== 'free_text' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Answer Options</label>
                <div className="space-y-2">
                  {question?.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <button
                        onClick={() => setCorrectAnswer(question?.id, optIndex)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          question?.correctAnswerIndex === optIndex
                            ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-500 hover:border-green-400'
                        }`}
                        title="Set as correct answer"
                      >
                        {question?.correctAnswerIndex === optIndex && (
                          <Icon name="Check" size={12} className="text-white" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={option}
                        onChange={e => updateOption(question?.id, optIndex, e?.target?.value)}
                        placeholder={`Option ${optIndex + 1}`}
                        className={`flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none text-sm ${
                          question?.correctAnswerIndex === optIndex
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {/* Option Image Upload */}
                      <div className="flex-shrink-0">
                        {question?.optionImages?.[optIndex] ? (
                          <div className="relative">
                            <img src={question?.optionImages?.[optIndex]} alt={`Option ${optIndex + 1}`} className="w-8 h-8 rounded object-cover border border-gray-200" />
                            <button
                              onClick={() => {
                                const updated = questions?.map(q => {
                                  if (q?.id !== question?.id) return q;
                                  const imgs = { ...(q?.optionImages || {}) };
                                  delete imgs?.[optIndex];
                                  return { ...q, optionImages: imgs };
                                });
                                setQuestions(updated);
                                notifyChange(updated);
                              }}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                            >
                              <Icon name="X" size={8} className="text-white" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              ref={el => {
                                if (!optionImageRefs?.current?.[question?.id]) optionImageRefs.current[question?.id] = {};
                                optionImageRefs.current[question?.id][optIndex] = el;
                              }}
                              onChange={e => handleOptionImageUpload(question?.id, optIndex, e?.target?.files?.[0])}
                              className="hidden"
                            />
                            <button
                              onClick={() => optionImageRefs?.current?.[question?.id]?.[optIndex]?.click()}
                              disabled={uploadingImage?.[`opt_${question?.id}_${optIndex}`]}
                              className="w-8 h-8 flex items-center justify-center border border-dashed border-gray-300 rounded hover:border-primary transition-colors"
                              title="Upload option image"
                            >
                              {uploadingImage?.[`opt_${question?.id}_${optIndex}`] ? (
                                <Icon name="Loader" size={12} className="animate-spin text-muted-foreground" />
                              ) : (
                                <Icon name="Image" size={12} className="text-muted-foreground" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                      {(question?.options?.length || 0) > 2 && (
                        <button
                          onClick={() => removeOption(question?.id, optIndex)}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors flex-shrink-0"
                        >
                          <Icon name="X" size={14} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {(question?.options?.length || 0) < 10 && (
                  <button
                    onClick={() => addOption(question?.id)}
                    className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Icon name="Plus" size={14} />
                    Add Option
                  </button>
                )}

                {/* Correct Answer Indicator */}
                <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-400">
                      Correct answer: <strong>Option {(question?.correctAnswerIndex ?? 0) + 1}</strong>
                      {question?.correctAnswer && ` — "${question?.correctAnswer}"`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-foreground mb-1">Explanation (optional)</label>
              <input
                type="text"
                value={question?.explanation || ''}
                onChange={e => updateQuestion(question?.id, 'explanation', e?.target?.value)}
                placeholder="Explain why this is the correct answer..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none text-sm"
              />
            </div>
          </div>
        ))}
      </div>
      {/* Add Question Button */}
      <button
        onClick={addQuestion}
        className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
      >
        <Icon name="Plus" size={20} />
        Add MCQ Question
      </button>
      {questions?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="HelpCircle" size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-muted-foreground">No questions added yet. Click above to add your first MCQ question.</p>
        </div>
      )}
      {questions?.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Icon name="HelpCircle" size={14} />{questions?.length} question{questions?.length !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1"><Icon name="Target" size={14} />Pass: {passingScore}%</span>
            <span className="flex items-center gap-1"><Icon name="RefreshCw" size={14} />Max {maxAttempts} attempt{maxAttempts !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1"><Icon name="ShieldCheck" size={14} />{enforceBeforeVoting ? 'Required before voting' : 'Optional'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCQQuizBuilder;
