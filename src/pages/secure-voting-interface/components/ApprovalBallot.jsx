import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const ApprovalBallot = ({ options, selectedOptions, onToggle }) => {
  const approvedCount = selectedOptions?.length || 0;
  const disapprovedCount = (options?.length || 0) - approvedCount;

  return (
    <div className="space-y-4">
      <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <Icon name="CheckSquare" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-1">
              Official Ballot - Approval Voting
            </h3>
            <p className="text-sm text-muted-foreground">
              Vote YES for all candidates you approve, or NO for those you don't approve
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 border-b-2 border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-foreground text-lg">
                Ballot Listing - All Candidates
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Total Candidates: {options?.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-data font-bold text-success">{approvedCount}</div>
                <div className="text-xs text-muted-foreground">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-data font-bold text-destructive">{disapprovedCount}</div>
                <div className="text-xs text-muted-foreground">Disapproved</div>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {options?.map((option, index) => {
            const isApproved = selectedOptions?.includes(option?.id);
            
            return (
              <div
                key={option?.id}
                className={`px-6 py-5 transition-all duration-200 ${
                  isApproved ? 'bg-success/5' : 'bg-destructive/5'
                }`}
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

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => !isApproved && onToggle(option?.id)}
                      className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 border-2 ${
                        isApproved
                          ? 'bg-success border-success text-white' :'bg-white border-success/30 text-success hover:bg-success/10'
                      }`}
                    >
                      <Icon name="ThumbsUp" size={18} className="inline mr-2" />
                      YES
                    </button>
                    <button
                      onClick={() => isApproved && onToggle(option?.id)}
                      className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 border-2 ${
                        !isApproved
                          ? 'bg-destructive border-destructive text-white' :'bg-white border-destructive/30 text-destructive hover:bg-destructive/10'
                      }`}
                    >
                      <Icon name="ThumbsDown" size={18} className="inline mr-2" />
                      NO
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Voting Instructions
            </p>
            <p className="text-xs text-muted-foreground">
              Vote YES for every candidate you approve of, or NO for candidates you don't approve. You can approve multiple candidates. The candidate with the most YES votes wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalBallot;