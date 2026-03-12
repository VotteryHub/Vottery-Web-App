import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import mcqService from '../../../services/mcqService';

const ImageOptionBuilderTab = ({ questions, onQuestionsChange, electionId }) => {
  const [uploadingKey, setUploadingKey] = useState(null);
  const [altTexts, setAltTexts] = useState({});
  const fileRefs = useRef({});

  const handleOptionImageUpload = async (questionId, optionIndex, file) => {
    if (!file) return;
    const key = `${questionId}_${optionIndex}`;
    setUploadingKey(key);
    try {
      const altText = altTexts?.[key] || '';
      const { data, error } = await mcqService?.uploadOptionImage(
        file,
        electionId || 'preview',
        String(questionId),
        optionIndex,
        altText
      );
      if (!error && data?.publicUrl) {
        const updated = questions?.map(q => {
          if (q?.id !== questionId) return q;
          return { ...q, optionImages: { ...(q?.optionImages || {}), [optionIndex]: data?.publicUrl } };
        });
        onQuestionsChange?.(updated);
      }
    } finally {
      setUploadingKey(null);
    }
  };

  const handleQuestionImageUpload = async (questionId, file) => {
    if (!file) return;
    const key = `q_${questionId}`;
    setUploadingKey(key);
    try {
      const { data, error } = await mcqService?.uploadQuestionImage(file, electionId || 'preview', String(questionId));
      if (!error && data?.publicUrl) {
        const updated = questions?.map(q =>
          q?.id === questionId ? { ...q, questionImageUrl: data?.publicUrl } : q
        );
        onQuestionsChange?.(updated);
      }
    } finally {
      setUploadingKey(null);
    }
  };

  const removeOptionImage = (questionId, optionIndex) => {
    const updated = questions?.map(q => {
      if (q?.id !== questionId) return q;
      const imgs = { ...(q?.optionImages || {}) };
      delete imgs?.[optionIndex];
      return { ...q, optionImages: imgs };
    });
    onQuestionsChange?.(updated);
  };

  if (!questions?.length) {
    return (
      <div className="text-center py-16">
        <Icon name="ImagePlus" size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-muted-foreground">No questions available</p>
        <p className="text-sm text-muted-foreground mt-1">Questions will appear here from the MCQ Quiz Builder</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions?.map((question, qIdx) => (
        <div key={question?.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {qIdx + 1}
            </div>
            <h4 className="font-semibold text-foreground truncate">{question?.questionText || 'Untitled Question'}</h4>
          </div>

          {/* Question Image */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-2">Question Header Image</label>
            {question?.questionImageUrl ? (
              <div className="relative inline-block">
                <img src={question?.questionImageUrl} alt="Question" className="h-32 w-auto rounded-xl border border-gray-200 object-cover" />
                <button
                  onClick={() => {
                    const updated = questions?.map(q => q?.id === question?.id ? { ...q, questionImageUrl: null } : q);
                    onQuestionsChange?.(updated);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <Icon name="X" size={12} className="text-white" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={el => { fileRefs.current[`q_${question?.id}`] = el; }}
                  onChange={e => handleQuestionImageUpload(question?.id, e?.target?.files?.[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileRefs?.current?.[`q_${question?.id}`]?.click()}
                  disabled={uploadingKey === `q_${question?.id}`}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {uploadingKey === `q_${question?.id}` ? (
                    <><Icon name="Loader" size={14} className="animate-spin" /> Uploading...</>
                  ) : (
                    <><Icon name="Upload" size={14} /> Upload Question Image</>  
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Option Images */}
          {question?.questionType !== 'free_text' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Option Images</label>
              <div className="grid grid-cols-2 gap-3">
                {question?.options?.map((opt, optIdx) => {
                  const imgKey = `${question?.id}_${optIdx}`;
                  const imgUrl = question?.optionImages?.[optIdx];
                  return (
                    <div key={optIdx} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Option {optIdx + 1}: {opt || '(empty)'}</p>
                      {imgUrl ? (
                        <div className="relative">
                          <img src={imgUrl} alt={`Option ${optIdx + 1}`} className="w-full h-24 rounded-lg object-cover border border-gray-200" />
                          <button
                            onClick={() => removeOptionImage(question?.id, optIdx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                          >
                            <Icon name="X" size={10} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            ref={el => { fileRefs.current[imgKey] = el; }}
                            onChange={e => handleOptionImageUpload(question?.id, optIdx, e?.target?.files?.[0])}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileRefs?.current?.[imgKey]?.click()}
                            disabled={uploadingKey === imgKey}
                            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors"
                          >
                            {uploadingKey === imgKey ? (
                              <Icon name="Loader" size={20} className="animate-spin text-muted-foreground" />
                            ) : (
                              <><Icon name="ImagePlus" size={20} className="text-gray-400" /><span className="text-xs text-muted-foreground">Upload</span></>
                            )}
                          </button>
                        </div>
                      )}
                      {/* Alt Text */}
                      <input
                        type="text"
                        value={altTexts?.[imgKey] || ''}
                        onChange={e => setAltTexts(prev => ({ ...prev, [imgKey]: e?.target?.value }))}
                        placeholder="Alt text for accessibility..."
                        className="mt-2 w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-xs bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageOptionBuilderTab;
