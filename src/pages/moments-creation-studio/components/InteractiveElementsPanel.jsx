import React, { useState } from 'react';
import { Type, MessageCircle, BarChart2, Clock, Plus, Trash2 } from 'lucide-react';

const InteractiveElementsPanel = ({ onTextStickerAdded, onInteractiveElementAdded }) => {
  const [activeSection, setActiveSection] = useState('text');
  const [textStickers, setTextStickers] = useState([]);
  const [polls, setPolls] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [countdowns, setCountdowns] = useState([]);

  // Text Sticker State
  const [stickerText, setStickerText] = useState('');
  const [stickerFont, setStickerFont] = useState('bold');
  const [stickerColor, setStickerColor] = useState('#FFFFFF');
  const [stickerAnimation, setStickerAnimation] = useState('none');

  // Poll State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Question State
  const [questionText, setQuestionText] = useState('');

  // Countdown State
  const [countdownTitle, setCountdownTitle] = useState('');
  const [countdownDate, setCountdownDate] = useState('');

  const fonts = [
    { id: 'bold', name: 'Bold', style: 'font-bold' },
    { id: 'script', name: 'Script', style: 'font-serif italic' },
    { id: 'modern', name: 'Modern', style: 'font-sans' },
    { id: 'typewriter', name: 'Typewriter', style: 'font-mono' },
  ];

  const animations = [
    { id: 'none', name: 'None' },
    { id: 'fade', name: 'Fade In' },
    { id: 'slide', name: 'Slide Up' },
    { id: 'bounce', name: 'Bounce' },
    { id: 'pulse', name: 'Pulse' },
  ];

  const handleAddTextSticker = () => {
    if (stickerText?.trim()) {
      const sticker = {
        id: Date.now(),
        text: stickerText,
        font: stickerFont,
        color: stickerColor,
        animation: stickerAnimation,
      };
      setTextStickers([...textStickers, sticker]);
      onTextStickerAdded(sticker);
      setStickerText('');
    }
  };

  const handleAddPoll = () => {
    if (pollQuestion?.trim() && pollOptions?.every((opt) => opt?.trim())) {
      const poll = {
        id: Date.now(),
        type: 'poll',
        question: pollQuestion,
        options: pollOptions?.filter((opt) => opt?.trim()),
      };
      setPolls([...polls, poll]);
      onInteractiveElementAdded(poll);
      setPollQuestion('');
      setPollOptions(['', '']);
    }
  };

  const handleAddQuestion = () => {
    if (questionText?.trim()) {
      const question = {
        id: Date.now(),
        type: 'question',
        text: questionText,
      };
      setQuestions([...questions, question]);
      onInteractiveElementAdded(question);
      setQuestionText('');
    }
  };

  const handleAddCountdown = () => {
    if (countdownTitle?.trim() && countdownDate) {
      const countdown = {
        id: Date.now(),
        type: 'countdown',
        title: countdownTitle,
        date: countdownDate,
      };
      setCountdowns([...countdowns, countdown]);
      onInteractiveElementAdded(countdown);
      setCountdownTitle('');
      setCountdownDate('');
    }
  };

  const handleRemoveItem = (type, id) => {
    switch (type) {
      case 'text':
        setTextStickers(textStickers?.filter((s) => s?.id !== id));
        break;
      case 'poll':
        setPolls(polls?.filter((p) => p?.id !== id));
        break;
      case 'question':
        setQuestions(questions?.filter((q) => q?.id !== id));
        break;
      case 'countdown':
        setCountdowns(countdowns?.filter((c) => c?.id !== id));
        break;
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Type className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-bold text-white">Interactive Elements</h3>
      </div>
      {/* Section Tabs */}
      <div className="flex space-x-2 mb-6 bg-black/30 rounded-lg p-1">
        <button
          onClick={() => setActiveSection('text')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeSection === 'text' ?'bg-pink-400 text-white' :'text-gray-400 hover:text-white'
          }`}
        >
          <Type className="w-4 h-4 inline-block mr-2" />
          Text
        </button>
        <button
          onClick={() => setActiveSection('poll')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeSection === 'poll' ?'bg-pink-400 text-white' :'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4 inline-block mr-2" />
          Poll
        </button>
        <button
          onClick={() => setActiveSection('question')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeSection === 'question' ?'bg-pink-400 text-white' :'text-gray-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline-block mr-2" />
          Q&A
        </button>
        <button
          onClick={() => setActiveSection('countdown')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            activeSection === 'countdown'
              ? 'bg-pink-400 text-white' :'text-gray-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 inline-block mr-2" />
          Timer
        </button>
      </div>
      {/* Text Stickers Section */}
      {activeSection === 'text' && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <input
              type="text"
              placeholder="Enter text..."
              value={stickerText}
              onChange={(e) => setStickerText(e?.target?.value)}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Font Style</label>
                <select
                  value={stickerFont}
                  onChange={(e) => setStickerFont(e?.target?.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-400"
                >
                  {fonts?.map((font) => (
                    <option key={font?.id} value={font?.id}>
                      {font?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Animation</label>
                <select
                  value={stickerAnimation}
                  onChange={(e) => setStickerAnimation(e?.target?.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-400"
                >
                  {animations?.map((anim) => (
                    <option key={anim?.id} value={anim?.id}>
                      {anim?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Color</label>
              <div className="flex space-x-2">
                {['#FFFFFF', '#000000', '#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#F87171']?.map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setStickerColor(color)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        stickerColor === color ? 'ring-2 ring-pink-400 scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
            </div>

            <button
              onClick={handleAddTextSticker}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 inline-block mr-2" />
              Add Text Sticker
            </button>
          </div>

          {/* Added Text Stickers */}
          {textStickers?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Added Stickers</h4>
              {textStickers?.map((sticker) => (
                <div
                  key={sticker?.id}
                  className="bg-white/5 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-white" style={{ color: sticker?.color }}>
                    {sticker?.text}
                  </span>
                  <button
                    onClick={() => handleRemoveItem('text', sticker?.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Poll Section */}
      {activeSection === 'poll' && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <input
              type="text"
              placeholder="Poll question..."
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e?.target?.value)}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
            />

            {pollOptions?.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...pollOptions];
                  newOptions[index] = e?.target?.value;
                  setPollOptions(newOptions);
                }}
                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
              />
            ))}

            {pollOptions?.length < 4 && (
              <button
                onClick={() => setPollOptions([...pollOptions, ''])}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                <Plus className="w-4 h-4 inline-block mr-2" />
                Add Option
              </button>
            )}

            <button
              onClick={handleAddPoll}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Create Poll
            </button>
          </div>

          {polls?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Added Polls</h4>
              {polls?.map((poll) => (
                <div
                  key={poll?.id}
                  className="bg-white/5 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white font-medium">{poll?.question}</p>
                    <button
                      onClick={() => handleRemoveItem('poll', poll?.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {poll?.options?.map((opt, idx) => (
                      <p key={idx} className="text-sm text-gray-400">
                        • {opt}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Question Section */}
      {activeSection === 'question' && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <input
              type="text"
              placeholder="Ask a question..."
              value={questionText}
              onChange={(e) => setQuestionText(e?.target?.value)}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
            />
            <button
              onClick={handleAddQuestion}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Add Question Sticker
            </button>
          </div>

          {questions?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Added Questions</h4>
              {questions?.map((question) => (
                <div
                  key={question?.id}
                  className="bg-white/5 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="text-white">{question?.text}</span>
                  <button
                    onClick={() => handleRemoveItem('question', question?.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Countdown Section */}
      {activeSection === 'countdown' && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <input
              type="text"
              placeholder="Countdown title..."
              value={countdownTitle}
              onChange={(e) => setCountdownTitle(e?.target?.value)}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
            />
            <input
              type="datetime-local"
              value={countdownDate}
              onChange={(e) => setCountdownDate(e?.target?.value)}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-400"
            />
            <button
              onClick={handleAddCountdown}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Add Countdown Timer
            </button>
          </div>

          {countdowns?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Added Countdowns</h4>
              {countdowns?.map((countdown) => (
                <div
                  key={countdown?.id}
                  className="bg-white/5 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-medium">{countdown?.title}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(countdown.date)?.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem('countdown', countdown?.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveElementsPanel;