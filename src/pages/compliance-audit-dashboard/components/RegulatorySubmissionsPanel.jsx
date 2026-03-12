import React from 'react';

import Button from '../../../components/ui/Button';

const RegulatorySubmissionsPanel = ({ filings, onRefresh }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Regulatory Submissions</h3>
        <Button size="sm" iconName="Plus">
          New Submission
        </Button>
      </div>
      <div className="space-y-4">
        {filings?.map((filing) => (
          <div key={filing?.id} className="p-4 rounded-lg border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  {filing?.filingType?.replace(/_/g, ' ')?.toUpperCase()}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {filing?.jurisdiction} - {filing?.regulatoryAuthority}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                filing?.status === 'approved' ? 'bg-green-100 text-green-700' :
                filing?.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                filing?.status === 'pending'? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {filing?.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Submission Date</p>
                <p className="text-foreground font-medium">
                  {filing?.submissionDate ? new Date(filing?.submissionDate)?.toLocaleDateString() : 'Not submitted'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="text-foreground font-medium">
                  {filing?.dueDate ? new Date(filing?.dueDate)?.toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegulatorySubmissionsPanel;