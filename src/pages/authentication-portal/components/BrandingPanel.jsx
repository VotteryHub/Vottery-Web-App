import React from 'react';
import Icon from '../../../components/AppIcon';


const BrandingPanel = () => {
  const platformBenefits = [
    {
      icon: 'Vote',
      title: 'Secure Voting',
      description: 'End-to-end encrypted voting with blockchain verification for complete transparency and security'
    },
    {
      icon: 'Trophy',
      title: 'Gamified Elections',
      description: 'Turn your votes into lottery tickets and win exciting prizes while participating in democracy'
    },
    {
      icon: 'Shield',
      title: 'Blockchain Transparency',
      description: 'Every vote is recorded on an immutable blockchain ledger that you can audit anytime'
    },
    {
      icon: 'Users',
      title: 'Social Democracy',
      description: 'Connect with like-minded voters, join groups, and engage in meaningful political discussions'
    }
  ];

  const trustSignals = [
    {
      icon: 'ShieldCheck',
      label: 'SSL Secured',
      description: 'Bank-grade encryption'
    },
    {
      icon: 'Lock',
      label: 'Blockchain Verified',
      description: 'Immutable audit trail'
    },
    {
      icon: 'Award',
      label: 'Democratic Certified',
      description: 'Trusted by organizations'
    }
  ];

  return (
    <div className="space-y-8 md:space-y-10 lg:space-y-12">
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 md:mb-5 lg:mb-6">
          <img
            src="/assets/images/Adobe_Express_-_file-1769630175687.png"
            alt="Vottery Logo"
            className="h-16 md:h-20 lg:h-24 w-auto object-contain"
          />
        </div>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
          Where Democracy Meets Innovation - Secure Voting, Gamified Participation, Blockchain Transparency
        </p>
      </div>
      <div className="space-y-4 md:space-y-5 lg:space-y-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground text-center lg:text-left">
          Why Choose Vottery?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-5 lg:gap-6">
          {platformBenefits?.map((benefit, index) => (
            <div
              key={index}
              className="p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-250 hover:shadow-democratic-md"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name={benefit?.icon} size={20} color="var(--color-primary)" className="md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1 md:mb-2">
                    {benefit?.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {benefit?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 md:space-y-5 lg:space-y-6">
        <h3 className="text-base md:text-lg lg:text-xl font-heading font-semibold text-foreground text-center lg:text-left">
          Trusted & Secure Platform
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 md:gap-4">
          {trustSignals?.map((signal, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-success/10 border border-success/20"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={signal?.icon} size={18} color="var(--color-success)" className="md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-foreground">
                  {signal?.label}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {signal?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="Sparkles" size={20} color="var(--color-primary)" className="md:w-6 md:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
              Join 12,847+ Active Voters
            </h4>
            <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
              Be part of the democratic revolution. Your voice matters, and now it can win you rewards too!
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm text-primary font-medium">
              <Icon name="TrendingUp" size={16} className="md:w-4 md:h-4" />
              <span>89,234 votes cast this month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPanel;