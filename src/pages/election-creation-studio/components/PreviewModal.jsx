import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PreviewModal = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFeeDisplay = () => {
    if (formData?.feeStructure === 'free') return 'Free';
    if (formData?.feeStructure === 'paid-general') return `$${formData?.generalFee} USD`;
    if (formData?.feeStructure === 'paid-regional') return `$${formData?.baseFee} USD (Regional pricing)`;
    return 'Not set';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-democratic-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between z-10">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">
            Election Preview
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {formData?.coverImage && (
            <div className="rounded-xl overflow-hidden">
              <Image
                src={formData?.coverImage}
                alt="Election cover image preview showing the visual representation of the election topic"
                className="w-full h-48 md:h-64 object-cover"
              />
            </div>
          )}

          <div className="flex items-start gap-4">
            {formData?.brandingLogo && (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                <Image
                  src={formData?.brandingLogo}
                  alt="Organization branding logo displayed on election preview"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                {formData?.title || 'Untitled Election'}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs md:text-sm font-medium rounded-full">
                  {formData?.category || 'Uncategorized'}
                </span>
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs md:text-sm font-medium rounded-full">
                  {formData?.votingType?.replace('-', ' ') || 'No voting type'}
                </span>
                {formData?.enableGamification && (
                  <span className="px-3 py-1 bg-accent/10 text-accent text-xs md:text-sm font-medium rounded-full flex items-center gap-1">
                    <Icon name="Trophy" size={14} />
                    Lotterized
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="prose prose-sm md:prose-base max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {formData?.description || 'No description provided'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Calendar" size={18} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Voting Period</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(formData?.startDate)} - {formatDate(formData?.endDate)}
              </p>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="DollarSign" size={18} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Participation Fee</span>
              </div>
              <p className="text-sm text-muted-foreground">{getFeeDisplay()}</p>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Eye" size={18} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Visibility</span>
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {formData?.visibility || 'Not set'}
              </p>
            </div>

            {formData?.enableGamification && (
              <div className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Trophy" size={18} className="text-accent" />
                  <span className="text-sm font-medium text-foreground">Prize Pool</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${formData?.prizeAmount || 0} for {formData?.numberOfWinners || 0} winners
                </p>
              </div>
            )}
          </div>

          {formData?.questions?.length > 0 && (
            <div>
              <h4 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                Questions & Options
              </h4>
              <div className="space-y-4">
                {formData?.questions?.map((question, index) => (
                  <div key={question?.id} className="card p-4">
                    <p className="font-medium text-foreground mb-3">
                      {index + 1}. {question?.text || 'Untitled question'}
                    </p>
                    <div className={`grid gap-3 ${['mcq-image', 'comparison'].includes(formData?.votingType) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {question?.options?.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className="flex flex-col gap-3 p-3 rounded-lg border border-border bg-muted/20"
                        >
                          {['mcq-image', 'comparison'].includes(formData?.votingType) && question?.optionImages?.[oIndex] && (
                             <img src={question?.optionImages[oIndex]} className="w-full aspect-video object-cover rounded-md mb-1" alt={`Option ${oIndex + 1} Preview`} />
                          )}
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border-2 border-primary flex-shrink-0" />
                            <span className="text-sm font-semibold text-foreground">
                              {option || `Option ${oIndex + 1}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {formData?.requireVideo && (
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
              <div className="flex gap-3">
                <Icon name="Video" size={18} className="text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Video Requirement Enabled
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData?.watchTimeType === 'percentage'
                      ? `Voters must watch at least ${formData?.minWatchPercentage || 0}% of the video before voting`
                      : `Voters must watch at least ${formData?.minWatchTime || 0} seconds before voting`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 md:p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;