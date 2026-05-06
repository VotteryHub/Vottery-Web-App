import React, { useState } from 'react';
import NavIcon from '../../../components/ui/NavIcon';

const ElectionVotingInterface = ({ type = 'approval', choices = [] }) => {
  const [votes, setVotes] = useState({}); // { choiceId: 'yes' | 'no' } for approval, { choiceId: rank } for ranked

  const handleApprovalVote = (id, value) => {
    setVotes(prev => ({ ...prev, [id]: value }));
  };

  const handleRankedVote = (id, rank) => {
    // Ensure rank is unique
    const existingChoiceWithRank = Object.keys(votes).find(key => votes[key] === rank);
    const newVotes = { ...votes };
    if (existingChoiceWithRank) {
      delete newVotes[existingChoiceWithRank];
    }
    newVotes[id] = rank;
    setVotes(newVotes);
  };

  if (type === 'approval') {
    return (
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800/50">
              <th className="p-4 font-black text-xs uppercase tracking-widest text-gray-500">Candidate / Choice</th>
              <th className="p-4 font-black text-xs uppercase tracking-widest text-gray-500 text-center">Your Vote</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {choices.map(choice => (
              <tr key={choice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{choice.label}</p>
                      <p className="text-xs text-gray-500">{choice.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handleApprovalVote(choice.id, 'yes')}
                      className={`p-2 rounded-full transition-all ${votes[choice.id] === 'yes' ? 'bg-vottery-yellow scale-110 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 grayscale'}`}
                    >
                      <NavIcon name="Plus" active={votes[choice.id] === 'yes'} size={24} />
                    </button>
                    <button 
                      onClick={() => handleApprovalVote(choice.id, 'no')}
                      className={`p-2 rounded-full transition-all ${votes[choice.id] === 'no' ? 'bg-vottery-blue scale-110 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 grayscale'}`}
                    >
                      <NavIcon name="X" active={votes[choice.id] === 'no'} size={24} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'ranked') {
    const ranks = Array.from({ length: choices.length }, (_, i) => i + 1);
    return (
      <div className="glass-card p-6 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[1fr_repeat(auto-fill,minmax(60px,1fr))] gap-4 mb-6">
            <div className="font-black text-xs uppercase tracking-widest text-gray-500">Choice</div>
            {ranks.map(r => (
              <div key={r} className="text-center font-black text-xs uppercase tracking-widest text-gray-500">Rank {r}</div>
            ))}
          </div>
          
          <div className="space-y-4">
            {choices.map(choice => (
              <div key={choice.id} className="grid grid-cols-[1fr_repeat(auto-fill,minmax(60px,1fr))] gap-4 items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <span className="font-bold text-gray-900 dark:text-white">{choice.label}</span>
                </div>
                {ranks.map(r => (
                  <div key={r} className="flex justify-center">
                    <button
                      onClick={() => handleRankedVote(choice.id, r)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${
                        votes[choice.id] === r 
                          ? 'bg-vottery-blue border-vottery-yellow text-white scale-110 shadow-lg' 
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-vottery-blue'
                      }`}
                    >
                      {r}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ElectionVotingInterface;
