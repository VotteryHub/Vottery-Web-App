import React from 'react';


const JurisdictionStatusPanel = ({ jurisdictions }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Jurisdiction-Specific Filing Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jurisdictions?.map((jurisdiction) => (
          <div key={jurisdiction?.id} className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{jurisdiction?.jurisdiction}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                jurisdiction?.complianceStatus === 'compliant' ? 'bg-green-100 text-green-700' :
                jurisdiction?.complianceStatus === 'warning'? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {jurisdiction?.complianceStatus}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Compliance Score</span>
                <span className="text-foreground font-medium">{jurisdiction?.complianceScore || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Issues Identified</span>
                <span className="text-foreground font-medium">{jurisdiction?.issuesIdentified || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Audit</span>
                <span className="text-foreground font-medium">
                  {jurisdiction?.lastAuditDate ? new Date(jurisdiction?.lastAuditDate)?.toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JurisdictionStatusPanel;