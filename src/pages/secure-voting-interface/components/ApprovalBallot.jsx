import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const ApprovalBallot = ({ options, selectedOptions, onToggle }) => {
  const approvedCount = selectedOptions?.length || 0;
  const disapprovedCount = (options?.length || 0) - approvedCount;

  return (
    <div className="space-y-4" data-testid="approval-ballot">
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

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {options?.map((option, index) => {
            const isApproved = selectedOptions?.includes(option?.id);
            const approvalRating = Math.floor(Math.random() * 40) + 60; // Mock rating for UI
            
            return (
              <div
                key={option?.id}
                className={`px-4 md:px-6 py-6 transition-all duration-300 ${
                  isApproved ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-transparent'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Candidate Info */}
                  <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="relative">
                      {option?.image ? (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg">
                          <Image src={option?.image} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-xl text-gray-400">
                          {option?.title?.[0]}
                        </div>
                      )}
                      {/* Circular Progress (Spec Reference) */}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-100 dark:border-gray-700">
                        <svg className="w-8 h-8 transform -rotate-90">
                          <circle cx="16" cy="16" r="14" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-gray-700" />
                          <circle cx="16" cy="16" r="14" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDasharray={88} strokeDashoffset={88 - (88 * approvalRating) / 100} className="text-blue-500" />
                        </svg>
                        <span className="absolute text-[8px] font-black">{approvalRating}%</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{option?.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{option?.description}</p>
                    </div>
                  </div>

                  {/* YES/NO Toggle Control */}
                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-full sm:w-auto min-w-[200px]">
                    <button
                      onClick={() => !isApproved && onToggle(option?.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all duration-300 ${
                        isApproved ? 'bg-vottery-blue text-white shadow-lg scale-105' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon name="ThumbsUp" size={18} />
                      YES
                    </button>
                    <button
                      onClick={() => isApproved && onToggle(option?.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all duration-300 ${
                        !isApproved ? 'bg-white dark:bg-gray-700 text-red-500 shadow-md' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon name="ThumbsDown" size={18} />
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