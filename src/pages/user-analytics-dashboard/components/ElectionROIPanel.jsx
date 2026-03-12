import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { stripeService } from '../../../services/stripeService';

const ElectionROIPanel = ({ electionROI, timeRange }) => {
  const [sortBy, setSortBy] = useState('roi'); // 'roi' or 'winnings'

  const sortedElections = [...(electionROI || [])]
    ?.sort((a, b) => {
      if (sortBy === 'roi') {
        return parseFloat(b?.roi) - parseFloat(a?.roi);
      }
      return b?.winnings - a?.winnings;
    })
    ?.slice(0, 10);

  const totalInvested = electionROI?.reduce((sum, e) => sum + e?.entryFee, 0) || 0;
  const totalWinnings = electionROI?.reduce((sum, e) => sum + e?.winnings, 0) || 0;
  const overallROI = totalInvested > 0 ? ((totalWinnings - totalInvested) / totalInvested) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">ROI Per Election</h2>
        <Icon name="TrendingUp" size={20} className="text-accent" />
      </div>

      <div className="space-y-6">
        {/* Overall ROI Summary */}
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
              <p className="text-lg font-bold text-foreground">
                {stripeService?.formatCurrency(totalInvested)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Winnings</p>
              <p className="text-lg font-bold text-success">
                {stripeService?.formatCurrency(totalWinnings)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Overall ROI</p>
              <p className={`text-lg font-bold ${overallROI >= 0 ? 'text-success' : 'text-red-600'}`}>
                {overallROI?.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <button
            onClick={() => setSortBy('roi')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              sortBy === 'roi' ?'bg-primary text-white' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            ROI %
          </button>
          <button
            onClick={() => setSortBy('winnings')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              sortBy === 'winnings' ?'bg-primary text-white' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Winnings
          </button>
        </div>

        {/* Election ROI List */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Top Elections</h3>
          {sortedElections?.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {sortedElections?.map((election, index) => (
                <div
                  key={election?.electionId}
                  className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {election?.electionTitle || 'Election'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Zone {election?.zone || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <p className={`text-lg font-bold ${
                        parseFloat(election?.roi) >= 0 ? 'text-success' : 'text-red-600'
                      }`}>
                        {election?.roi}%
                      </p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Entry: {stripeService?.formatCurrency(election?.entryFee)}
                    </span>
                    <span className="text-success font-medium">
                      Won: {stripeService?.formatCurrency(election?.winnings)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="TrendingUp" size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No ROI data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionROIPanel;