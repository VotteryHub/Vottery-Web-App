import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import MCQConfigPanel from './components/MCQConfigPanel';
import QuestionBuilderPanel from './components/QuestionBuilderPanel';
import LiveQuestionInjectionPanel from './components/LiveQuestionInjectionPanel';
import PreviewPanel from './components/PreviewPanel';
import mcqService from '../../services/mcqService';

const TABS = [
  { id: 'config', label: 'Quiz Config', icon: 'Settings' },
  { id: 'questions', label: 'Questions', icon: 'HelpCircle' },
  { id: 'live', label: 'Live Injection', icon: 'Zap' },
  { id: 'preview', label: 'Preview', icon: 'Eye' },
];

const EnhancedMCQCreationStudio = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState({
    passingScore: 70,
    maxAttempts: 3,
    enforceBeforeVoting: true,
  });
  const [questions, setQuestions] = useState([]);
  const [electionId] = useState('demo-election-id');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      // In real usage, electionId would come from route params
      const { error } = await mcqService?.createMCQQuestions(electionId, questions);
      setSaveStatus(error ? 'error' : 'success');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleExportFreeText = async (format) => {
    setExportLoading(true);
    try {
      if (format === 'csv') await mcqService?.exportFreeTextAnswersToCSV(electionId);
      else await mcqService?.exportFreeTextAnswersToJSON(electionId);
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportImageGallery = async () => {
    setExportLoading(true);
    try {
      await mcqService?.exportImageGallery(electionId);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Enhanced MCQ Creation Studio</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Full-parity MCQ builder with advanced configuration, multimedia support, and live injection
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Export buttons */}
            <div className="relative group">
              <button
                disabled={exportLoading}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Icon name="Download" size={16} />
                Export
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg hidden group-hover:block z-10">
                <button onClick={() => handleExportFreeText('csv')} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">
                  Free Text → CSV
                </button>
                <button onClick={() => handleExportFreeText('json')} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">
                  Free Text → JSON
                </button>
                <button onClick={handleExportImageGallery} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">
                  Image Gallery Export
                </button>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? <><Icon name="Loader" size={16} className="animate-spin" />Saving...</> : <><Icon name="Save" size={16} />Save Quiz</>}
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className={`max-w-7xl mx-auto mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
            saveStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <Icon name={saveStatus === 'success' ? 'CheckCircle' : 'AlertCircle'} size={14} />
            {saveStatus === 'success' ? 'Quiz saved successfully!' : 'Failed to save. Please try again.'}
          </div>
        )}
      </div>
      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {TABS?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
                {tab?.id === 'questions' && questions?.length > 0 && (
                  <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {questions?.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main panel */}
          <div className="lg:col-span-2">
            {activeTab === 'config' && (
              <MCQConfigPanel config={config} onChange={handleConfigChange} />
            )}
            {activeTab === 'questions' && (
              <QuestionBuilderPanel questions={questions} onChange={setQuestions} />
            )}
            {activeTab === 'live' && (
              <LiveQuestionInjectionPanel electionId={electionId} />
            )}
            {activeTab === 'preview' && (
              <PreviewPanel questions={questions} config={config} />
            )}
          </div>

          {/* Sidebar summary */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Quiz Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium text-foreground">{questions?.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Passing Score</span>
                  <span className="font-medium text-green-600">{config?.passingScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Attempts</span>
                  <span className="font-medium text-orange-600">{config?.maxAttempts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Enforce Before Vote</span>
                  <span className={`font-medium ${config?.enforceBeforeVoting ? 'text-primary' : 'text-muted-foreground'}`}>
                    {config?.enforceBeforeVoting ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Multiple Choice</span>
                  <span className="font-medium text-foreground">
                    {questions?.filter(q => q?.questionType !== 'free_text')?.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Free Text</span>
                  <span className="font-medium text-foreground">
                    {questions?.filter(q => q?.questionType === 'free_text')?.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">With Images</span>
                  <span className="font-medium text-foreground">
                    {questions?.filter(q => q?.questionImageUrl)?.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <p className="font-medium">Flutter Parity Features</p>
                  <ul className="space-y-0.5 text-blue-600 dark:text-blue-300">
                    <li>✓ Passing score slider (0-100%)</li>
                    <li>✓ Max attempts slider (1-5)</li>
                    <li>✓ Multiple choice + free text</li>
                    <li>✓ Difficulty levels</li>
                    <li>✓ is_required per question</li>
                    <li>✓ Question image upload</li>
                    <li>✓ Option image upload</li>
                    <li>✓ Live question injection</li>
                    <li>✓ Free text export (CSV/JSON)</li>
                    <li>✓ Image gallery export</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMCQCreationStudio;
