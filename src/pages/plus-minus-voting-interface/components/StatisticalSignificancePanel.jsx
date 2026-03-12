import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import { plusMinusVotingService } from '../../../services/plusMinusVotingService';

const StatisticalSignificancePanel = ({ electionId }) => {
  const [significance, setSignificance] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatisticalSignificance();
  }, [electionId]);

  const loadStatisticalSignificance = async () => {
    try {
      const { data, totalVotes: total, error } = await plusMinusVotingService?.getStatisticalSignificance(electionId);
      if (error) throw new Error(error?.message);
      setSignificance(data);
      setTotalVotes(total);
    } catch (err) {
      console.error('Load significance error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Statistical Significance Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Confidence intervals and statistical significance indicators help determine if voting patterns are meaningful or due to chance. 
              95% confidence intervals shown with margin of error calculations.
            </p>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Users" size={24} className="text-primary" />
            <h3 className="font-semibold text-foreground">Total Votes</h3>
          </div>
          <p className="text-4xl font-bold text-foreground">{totalVotes}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="CheckCircle" size={24} className="text-success" />
            <h3 className="font-semibold text-foreground">Significant Results</h3>
          </div>
          <p className="text-4xl font-bold text-success">
            {significance?.filter(s => s?.statisticallySignificant)?.length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="AlertCircle" size={24} className="text-warning" />
            <h3 className="font-semibold text-foreground">Insufficient Data</h3>
          </div>
          <p className="text-4xl font-bold text-warning">
            {significance?.filter(s => !s?.statisticallySignificant)?.length}
          </p>
        </div>
      </div>

      {/* Significance Details */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="bg-muted/50 border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">Confidence Intervals by Option</h3>
          <p className="text-sm text-muted-foreground mt-1">
            95% confidence intervals for positive vote proportion
          </p>
        </div>

        <div className="divide-y divide-border">
          {significance?.map((item, index) => (
            <div key={item?.optionId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-heading font-bold text-foreground text-lg mb-2">
                    Option {index + 1}
                  </h4>
                  <div className="flex items-center gap-2">
                    {item?.statisticallySignificant ? (
                      <>
                        <Icon name="CheckCircle" size={16} className="text-success" />
                        <span className="text-sm font-medium text-success">Statistically Significant</span>
                      </>
                    ) : (
                      <>
                        <Icon name="AlertCircle" size={16} className="text-warning" />
                        <span className="text-sm font-medium text-warning">Insufficient Sample Size</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Sample Size</p>
                  <p className="text-2xl font-bold text-foreground">{item?.sampleSize}</p>
                </div>
              </div>

              {/* Confidence Interval Visualization */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Lower Bound</span>
                  <span>Confidence Interval (95%)</span>
                  <span>Upper Bound</span>
                </div>
                <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                  <div 
                    className="absolute top-0 h-full bg-primary/20"
                    style={{ 
                      left: `${item?.confidenceInterval?.lower}%`,
                      width: `${parseFloat(item?.confidenceInterval?.upper) - parseFloat(item?.confidenceInterval?.lower)}%`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <span className="text-sm font-bold text-foreground">{item?.confidenceInterval?.lower}%</span>
                    <span className="text-sm font-bold text-foreground">{item?.confidenceInterval?.upper}%</span>
                  </div>
                </div>
              </div>

              {/* Statistical Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Lower Bound (95%)</p>
                  <p className="text-lg font-bold text-foreground">{item?.confidenceInterval?.lower}%</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Point Estimate</p>
                  <p className="text-lg font-bold text-primary">
                    {((parseFloat(item?.confidenceInterval?.lower) + parseFloat(item?.confidenceInterval?.upper)) / 2)?.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Upper Bound (95%)</p>
                  <p className="text-lg font-bold text-foreground">{item?.confidenceInterval?.upper}%</p>
                </div>
              </div>

              {/* Interpretation */}
              <div className="mt-4 bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  {item?.statisticallySignificant ? (
                    <>
                      <Icon name="Info" size={14} className="inline mr-1" />
                      With 95% confidence, the true positive vote proportion for this option lies between{' '}
                      <span className="font-bold text-foreground">{item?.confidenceInterval?.lower}%</span> and{' '}
                      <span className="font-bold text-foreground">{item?.confidenceInterval?.upper}%</span>.
                      Sample size ({item?.sampleSize}) is sufficient for reliable conclusions.
                    </>
                  ) : (
                    <>
                      <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                      Sample size ({item?.sampleSize}) is below the recommended minimum of 30 votes. 
                      Results may not be statistically reliable. More votes needed for confident conclusions.
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistical Methodology */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Statistical Methodology</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Confidence Interval Calculation</p>
              <p className="text-muted-foreground">
                95% confidence intervals calculated using standard error of proportion with normal approximation. 
                Formula: p ± 1.96 × √(p(1-p)/n)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Significance Threshold</p>
              <p className="text-muted-foreground">
                Results considered statistically significant when sample size &ge; 30 and margin of error &lt; 10%. 
                Ensures reliable conclusions from voting data.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Interpretation Guidelines</p>
              <p className="text-muted-foreground">
                Wider confidence intervals indicate more uncertainty. Narrower intervals (with larger sample sizes) 
                provide more precise estimates of true voter preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalSignificancePanel;