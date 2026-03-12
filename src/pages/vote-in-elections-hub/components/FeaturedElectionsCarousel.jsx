import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedElectionsCarousel = ({ elections }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? elections?.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === elections?.length - 1 ? 0 : prev + 1));
  };

  const currentElection = elections?.[currentIndex];

  if (!currentElection) return null;

  return (
    <div className="card overflow-hidden">
      <div className="relative">
        <div className="relative h-64 md:h-80 lg:h-96">
          <Image
            src={currentElection?.coverImage}
            alt={currentElection?.coverImageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-accent/90 text-accent-foreground backdrop-blur-sm">
              <Icon name="Trophy" size={16} className="inline mr-2" />
              Featured Lottery Election
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              {currentElection?.category && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/90 text-secondary-foreground backdrop-blur-sm">
                  {currentElection?.category}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
                {currentElection?.votingType}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-3">
              {currentElection?.title}
            </h2>
            <p className="text-sm md:text-base text-white/90 mb-4 line-clamp-2">
              {currentElection?.description}
            </p>
            
            <div className="flex items-center gap-4 md:gap-6 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="Trophy" size={20} className="text-accent" />
                <div>
                  <p className="text-xs text-white/70">Prize Pool</p>
                  <p className="text-lg font-data font-bold text-accent">{currentElection?.prizePool}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Users" size={20} className="text-white" />
                <div>
                  <p className="text-xs text-white/70">Winners</p>
                  <p className="text-lg font-data font-bold text-white">{currentElection?.numberOfWinners}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={20} className="text-white" />
                <div>
                  <p className="text-xs text-white/70">Ends</p>
                  <p className="text-sm font-medium text-white">{currentElection?.endDate}</p>
                </div>
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              iconName="Vote"
              iconPosition="left"
              onClick={() => navigate(`/secure-voting-interface?election=${currentElection?.id}`)}
            >
              Participate & Win
            </Button>
          </div>
        </div>

        {elections?.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-250"
            >
              <Icon name="ChevronLeft" size={24} className="text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-250"
            >
              <Icon name="ChevronRight" size={24} className="text-white" />
            </button>
          </>
        )}
      </div>

      {elections?.length > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 bg-muted/50">
          {elections?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-250 ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedElectionsCarousel;