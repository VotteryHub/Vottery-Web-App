import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileInfoSection = ({ user }) => {
  const infoItems = [
    {
      icon: 'Mail',
      label: 'Email',
      value: user?.email,
      verified: true,
    },
    {
      icon: 'Phone',
      label: 'Phone',
      value: user?.phone,
      verified: false,
    },
    {
      icon: 'MapPin',
      label: 'Location',
      value: user?.location,
    },
    {
      icon: 'Calendar',
      label: 'Date of Birth',
      value: user?.dateOfBirth,
    },
    {
      icon: 'Briefcase',
      label: 'Occupation',
      value: user?.occupation,
    },
    {
      icon: 'Link',
      label: 'Website',
      value: user?.website,
      isLink: true,
    },
  ];

  const interests = user?.interests || [];
  const languages = user?.languages || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
          Personal Information
        </h3>
        <div className="space-y-3">
          {infoItems?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={item?.icon} size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{item?.label}</p>
                  {item?.isLink ? (
                    <a
                      href={item?.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline truncate block"
                    >
                      {item?.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-foreground truncate">{item?.value}</p>
                  )}
                </div>
              </div>
              {item?.verified !== undefined && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    item?.verified ? 'bg-success/10' : 'bg-warning/10'
                  }`}
                >
                  <Icon
                    name={item?.verified ? 'ShieldCheck' : 'AlertCircle'}
                    size={14}
                    className={item?.verified ? 'text-success' : 'text-warning'}
                  />
                  <span
                    className={`text-xs font-medium ${
                      item?.verified ? 'text-success' : 'text-warning'
                    }`}
                  >
                    {item?.verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {interests?.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {interest}
            </span>
          ))}
          <Button variant="ghost" size="sm" iconName="Plus">
            Add Interest
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
          Languages
        </h3>
        <div className="space-y-2">
          {languages?.map((language, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{language?.name}</span>
              <span className="text-xs text-muted-foreground">{language?.proficiency}</span>
            </div>
          ))}
          <Button variant="ghost" size="sm" iconName="Plus" className="mt-2">
            Add Language
          </Button>
        </div>
      </div>
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
          Account Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="ShieldCheck" size={20} className="text-success" />
              <span className="text-sm font-medium text-success">Identity Verified</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your identity has been verified through our secure process
            </p>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Key" size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary">Encryption Active</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your votes are protected with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSection;