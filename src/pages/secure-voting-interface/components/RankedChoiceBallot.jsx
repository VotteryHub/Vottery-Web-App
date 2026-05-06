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
    <div className="space-y-6" data-testid="ranked-choice-ballot">
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
                      <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-all duration-500 ${
                        index === 0 
                          ? 'bg-gradient-to-br from-vottery-blue to-blue-700 text-white scale-110' 
                          : 'bg-white dark:bg-gray-800 text-vottery-blue border border-gray-100 dark:border-gray-700'
                      }`}>
                        <span className="text-xl font-black leading-none">
                          {index + 1}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80">
                          {getRankSuffix(index + 1)}
                        </span>
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 bg-vottery-yellow text-gray-900 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                            TOP
                          </div>
                        )}
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
                        <h4 className="font-heading font-bold text-foreground text-base md:text-lg mb-1 line-clamp-1">
                          {option?.title}
                        </h4>
                        {option?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {option?.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="md:hidden relative">
                        <select
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'none') {
                              handleRemoveFromRanking(option?.id);
                            } else {
                              const newRank = parseInt(val);
                              const newChoices = [...rankedChoices];
                              const oldIdx = newChoices.indexOf(option?.id);
                              if (oldIdx !== -1) newChoices.splice(oldIdx, 1);
                              newChoices.splice(newRank - 1, 0, option?.id);
                              onRank(newChoices);
                            }
                          }}
                          value={rankedChoices.indexOf(option?.id) + 1 || 'none'}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        >
                          <option value="none">Unranked</option>
                          {options.map((_, i) => (
                            <option key={i} value={i + 1}>Rank {i + 1}</option>
                          ))}
                        </select>
                        <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold flex items-center gap-1 min-h-[44px]">
                          {rankedChoices.indexOf(option?.id) !== -1 
                            ? `Rank ${rankedChoices.indexOf(option?.id) + 1}` 
                            : 'Rank'}
                          <Icon name="ChevronDown" size={12} />
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFromRanking(option?.id)}
                        className="w-11 h-11 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-all duration-200"
                      >
                        <Icon name="X" size={20} color="var(--color-destructive)" />
                      </button>
                    </div>
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
              Select or rank candidates
            </p>
          </div>

          <div className="divide-y divide-border">
            {unrankedOptions?.map((option, index) => {
              return (
                <div
                  key={option?.id}
                  className="w-full text-left px-4 md:px-6 py-5 transition-all duration-200 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-data font-bold text-muted-foreground w-6 flex-shrink-0">
                      {index + 1}.
                    </span>

                    <div className="flex-1 min-w-0 flex items-center gap-4" onClick={() => handleAddToRanking(option?.id)}>
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
                        <h4 className="font-heading font-bold text-foreground text-base md:text-lg mb-1 line-clamp-1">
                          {option?.title}
                        </h4>
                        {option?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {option?.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="md:hidden relative">
                        <select
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== 'none') {
                              const newRank = parseInt(val);
                              const newChoices = [...rankedChoices];
                              newChoices.splice(newRank - 1, 0, option?.id);
                              onRank(newChoices);
                            }
                          }}
                          value="none"
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        >
                          <option value="none">Select Rank</option>
                          {options.map((_, i) => (
                            <option key={i} value={i + 1}>Rank {i + 1}</option>
                          ))}
                        </select>
                        <div className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold flex items-center gap-1 min-h-[44px]">
                          Rank
                          <Icon name="ChevronDown" size={12} />
                        </div>
                      </div>

                      <button 
                        onClick={() => handleAddToRanking(option?.id)}
                        className="w-11 h-11 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-200"
                      >
                        <Icon name="Plus" size={20} color="var(--color-primary)" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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