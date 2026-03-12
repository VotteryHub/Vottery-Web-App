import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PluralityBallot = ({ options, selectedOption, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Icon name="Vote" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-1">
              Official Ballot - Plurality Voting
            </h3>
            <p className="text-sm text-muted-foreground">
              Select ONE candidate by clicking the circle next to their name
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 border-b-2 border-border px-6 py-4">
          <h4 className="font-heading font-bold text-foreground text-lg">
            Ballot Listing - All Candidates
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Total Candidates: {options?.length}
          </p>
        </div>

        <div className="divide-y divide-border">
          {options?.map((option, index) => {
            const isSelected = selectedOption === option?.id;
            
            return (
              <button
                key={option?.id}
                onClick={() => onSelect(option?.id)}
                className={`w-full text-left px-6 py-5 transition-all duration-200 hover:bg-muted/50 ${
                  isSelected ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-lg font-data font-bold text-muted-foreground w-8">
                      {index + 1}.
                    </span>
                    <div className={`w-8 h-8 rounded-full border-3 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary' :'border-muted-foreground/40 hover:border-primary/50'
                    }`}>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-white" />
                      )}
                    </div>
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
                      <h3 className="font-heading font-bold text-foreground text-base md:text-lg mb-1">
                        {option?.title}
                      </h3>
                      {option?.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {option?.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm">
                        SELECTED
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Voting Instructions
            </p>
            <p className="text-xs text-muted-foreground">
              Mark your choice by selecting the circle next to ONE candidate's name. The candidate with the most votes wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluralityBallot;