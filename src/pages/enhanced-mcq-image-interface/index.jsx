import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import VisualVotingPreviewTab from './components/VisualVotingPreviewTab';
import ImageOptionBuilderTab from './components/ImageOptionBuilderTab';
import ImageGalleryExportTab from './components/ImageGalleryExportTab';

const TABS = [
  { id: 'preview', label: 'Visual Voting Preview', icon: 'Eye' },
  { id: 'builder', label: 'Image Option Builder', icon: 'ImagePlus' },
  { id: 'gallery', label: 'Image Gallery Export', icon: 'Download' }
];

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    questionText: 'Which candidate do you prefer for the position?',
    questionType: 'multiple_choice',
    options: ['Candidate A', 'Candidate B', 'Candidate C', 'Candidate D'],
    correctAnswer: 'Candidate A',
    correctAnswerIndex: 0,
    difficulty: 'easy',
    isRequired: true,
    questionImageUrl: null,
    optionImages: {}
  }
];

const EnhancedMCQImageInterface = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [electionId, setElectionId] = useState('');

  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now(),
      questionText: '',
      questionType: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      correctAnswerIndex: 0,
      difficulty: 'medium',
      isRequired: true,
      questionImageUrl: null,
      optionImages: {}
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(prev => prev?.filter(q => q?.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="ImagePlus" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Enhanced Image MCQ Interface</h1>
                <p className="text-sm text-muted-foreground">Visual MCQ builder with image options and gallery export</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <input
                  type="text"
                  value={electionId}
                  onChange={e => setElectionId(e?.target?.value)}
                  placeholder="Election ID (for uploads)"
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-52"
                />
              </div>
              <span className="text-sm text-muted-foreground">{questions?.length} question{questions?.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
          {TABS?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab?.id
                  ? 'bg-white dark:bg-gray-700 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Question Management Bar (for builder tab) */}
        {activeTab === 'builder' && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Manage images for each question and option</p>
            <div className="flex gap-2">
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Icon name="Plus" size={14} /> Add Question
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'preview' && (
          <VisualVotingPreviewTab questions={questions} />
        )}
        {activeTab === 'builder' && (
          <ImageOptionBuilderTab
            questions={questions}
            onQuestionsChange={setQuestions}
            electionId={electionId}
          />
        )}
        {activeTab === 'gallery' && (
          <ImageGalleryExportTab
            electionId={electionId}
            questions={questions}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedMCQImageInterface;
