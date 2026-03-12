import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RankedChoiceBallot = ({ options, rankedChoices, onRank }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, optionId) => {
    setDraggedItem(optionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e?.preventDefault();
    if (!draggedItem) return;

    const newRankedChoices = [...rankedChoices];
    const draggedIndex = newRankedChoices?.indexOf(draggedItem);

    if (draggedIndex !== -1) {
      newRankedChoices?.splice(draggedIndex, 1);
    }

    newRankedChoices?.splice(targetIndex, 0, draggedItem);
    onRank(newRankedChoices);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleAddToRanking = (optionId) => {
    if (!rankedChoices?.includes(optionId)) {
      onRank([...rankedChoices, optionId]);
    }
  };

  const handleRemoveFromRanking = (optionId) => {
    onRank(rankedChoices?.filter(id => id !== optionId));
  };

  const unrankedOptions = options?.filter(opt => !rankedChoices?.includes(opt?.id));

  const getRankSuffix = (rank) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary/10 border-2 border-secondary/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Icon name="ListOrdered" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-1">
              Official Ballot - Ranked Choice Voting
            </h3>
            <p className="text-sm text-muted-foreground">
              Rank candidates in order of preference (1st choice, 2nd choice, etc.)
            </p>
          </div>
        </div>
      </div>

      {rankedChoices?.length > 0 && (
        <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
          <div className="bg-secondary/10 border-b-2 border-border px-6 py-4">
            <h4 className="font-heading font-bold text-foreground text-lg">
              Your Ranked Choices
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Drag to reorder your preferences
            </p>
          </div>

          <div className="divide-y divide-border">
            {rankedChoices?.map((optionId, index) => {
              const option = options?.find(opt => opt?.id === optionId);
              if (!option) return null;

              return (
                <div
                  key={option?.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, option?.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`px-6 py-5 cursor-move transition-all duration-200 hover:bg-muted/50 ${
                    draggedItem === option?.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/70 text-white rounded-lg flex flex-col items-center justify-center shadow-democratic-md">
                        <span className="text-2xl font-data font-bold leading-none">
                          {index + 1}
                        </span>
                        <span className="text-[10px] font-medium leading-none">
                          {getRankSuffix(index + 1)}
                        </span>
                      </div>
                      <Icon name="GripVertical" size={20} className="text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0 flex items-center gap-4">
                      {option?.image && (
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-border">
                          <Image
                            src={option?.image}
                            alt={option?.imageAlt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-foreground text-base md:text-lg mb-1">
                          {option?.title}
                        </h4>
                        {option?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {option?.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFromRanking(option?.id)}
                      className="w-10 h-10 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                    >
                      <Icon name="X" size={20} color="var(--color-destructive)" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {unrankedOptions?.length > 0 && (
        <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
          <div className="bg-muted/50 border-b-2 border-border px-6 py-4">
            <h4 className="font-heading font-bold text-foreground text-lg">
              Available Candidates
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Click to add to your rankings
            </p>
          </div>

          <div className="divide-y divide-border">
            {unrankedOptions?.map((option, index) => (
              <button
                key={option?.id}
                onClick={() => handleAddToRanking(option?.id)}
                className="w-full text-left px-6 py-5 transition-all duration-200 hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-data font-bold text-muted-foreground w-8 flex-shrink-0">
                    {index + 1}.
                  </span>

                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    {option?.image && (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-border">
                        <Image
                          src={option?.image}
                          alt={option?.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-foreground text-base md:text-lg mb-1">
                        {option?.title}
                      </h4>
                      {option?.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {option?.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-200">
                      <Icon name="Plus" size={20} color="var(--color-primary)" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Voting Instructions
            </p>
            <p className="text-xs text-muted-foreground">
              Rank candidates in order of preference. If your first choice doesn't win, your vote transfers to your next choice. Continue ranking until you've ordered all candidates you support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankedChoiceBallot;