import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreateElectionSection = ({ templates, recentDrafts }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
            Create New Election
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Start from a template or create from scratch
          </p>
        </div>
        <Link to="/election-creation-studio">
          <Button variant="default" size="lg" iconName="Plus" iconPosition="left">
            New Election
          </Button>
        </Link>
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
          Quick Start Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {templates?.map((template) => (
            <div
              key={template?.id}
              className="card p-4 md:p-6 hover:shadow-democratic-md transition-all duration-250 cursor-pointer"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-4 ${template?.bgColor}`}>
                <Icon name={template?.icon} size={24} color={template?.iconColor} />
              </div>
              <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
                {template?.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {template?.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {template?.estimatedTime}
                </span>
                <Button variant="ghost" size="sm" iconName="ArrowRight">
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {recentDrafts?.length > 0 && (
        <div>
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
            Recent Drafts
          </h3>
          <div className="space-y-3">
            {recentDrafts?.map((draft) => (
              <div
                key={draft?.id}
                className="card p-4 hover:shadow-democratic-md transition-all duration-250"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-heading font-semibold text-foreground mb-1 truncate">
                      {draft?.title}
                    </h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        Last edited: {draft?.lastEdited}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                        {draft?.completionPercentage}% Complete
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" iconName="Edit">
                      Continue
                    </Button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-all duration-250">
                      <Icon name="Trash2" size={16} className="text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateElectionSection;