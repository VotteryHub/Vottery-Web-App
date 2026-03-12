import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { motion } from 'framer-motion';

const LivePresentationPanel = ({ slides, currentSlideIndex, onSlideChange, onExit, election, questions }) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const currentSlide = slides?.[currentSlideIndex];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.key === 'ArrowRight' && currentSlideIndex < slides?.length - 1) {
        onSlideChange(currentSlideIndex + 1);
      }
      if (e?.key === 'ArrowLeft' && currentSlideIndex > 0) {
        onSlideChange(currentSlideIndex - 1);
      }
      if (e?.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex, slides?.length, onSlideChange, onExit]);

  const handleNext = () => {
    if (currentSlideIndex < slides?.length - 1) {
      onSlideChange(currentSlideIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onExit}
              iconName="X"
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              Exit
            </Button>
            <span className="text-white text-sm font-medium">
              {election?.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowQuestions(!showQuestions)}
              iconName="MessageSquare"
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              Q&A ({questions?.length})
            </Button>
          </div>
        </div>
      </div>
      {/* Main Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div key={currentSlideIndex}>
          <div className="max-w-6xl w-full">
            {currentSlide?.mediaUrl && currentSlide?.mediaType === 'image' && (
              <div className="mb-8">
                <Image
                  src={currentSlide?.mediaUrl}
                  alt={`Presentation slide ${currentSlideIndex + 1} showing ${currentSlide?.title}`}
                  className="w-full max-h-96 object-contain rounded-xl"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 text-center">
              {currentSlide?.title}
            </h1>

            <div className="text-xl md:text-2xl text-muted-foreground text-center whitespace-pre-wrap leading-relaxed">
              {currentSlide?.content}
            </div>
          </div>
        </motion.div>
      </div>
      {/* Questions Sidebar */}
      {showQuestions && (
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-card border-l border-border p-6 overflow-y-auto">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4">
            Live Questions
          </h3>
          <div className="space-y-4">
            {questions?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No approved questions yet</p>
            ) : (
              questions?.map(question => (
                <div key={question?.id} className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-foreground mb-2">{question?.questionText}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {!question?.isAnonymous && (
                      <span>{question?.userProfiles?.name}</span>
                    )}
                    {question?.upvotes > 0 && (
                      <span className="flex items-center gap-1">
                        <Icon name="ThumbsUp" size={12} />
                        {question?.upvotes}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Navigation Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 z-10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            onClick={handlePrevious}
            disabled={currentSlideIndex === 0}
            iconName="ChevronLeft"
            size="lg"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {slides?.map((_, index) => (
              <button
                key={index}
                onClick={() => onSlideChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlideIndex
                    ? 'bg-white w-8' :'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentSlideIndex === slides?.length - 1}
            iconName="ChevronRight"
            iconPosition="right"
            size="lg"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            Next
          </Button>
        </div>

        <div className="text-center mt-4">
          <span className="text-white text-sm">
            Slide {currentSlideIndex + 1} of {slides?.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LivePresentationPanel;