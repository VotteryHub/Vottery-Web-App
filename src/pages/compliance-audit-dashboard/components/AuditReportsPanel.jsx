import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuditReportsPanel = ({ filings, violations }) => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Regulatory Filings</h3>
          <Button size="sm" variant="outline" iconName="Download">
            Export Report
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Filing Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Jurisdiction</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filings?.slice(0, 10)?.map((filing) => (
                <tr key={filing?.id} className="border-b border-border hover:bg-muted/30">
                  <td className="py-3 px-4 text-sm text-foreground">{filing?.filingType?.replace(/_/g, ' ')}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{filing?.jurisdiction}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      filing?.status === 'approved' ? 'bg-green-100 text-green-700' :
                      filing?.status === 'pending'? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {filing?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {new Date(filing?.submissionDate)?.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Policy Violations</h3>
          <Button size="sm" variant="outline" iconName="Download">
            Export Report
          </Button>
        </div>
        <div className="space-y-3">
          {violations?.slice(0, 5)?.map((violation) => (
            <div key={violation?.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="AlertTriangle" size={16} className="text-red-500" />
                    <h4 className="font-semibold text-foreground">{violation?.violationType?.replace(/_/g, ' ')}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{violation?.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Detected: {new Date(violation?.detectedAt)?.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  violation?.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  violation?.severity === 'high'? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {violation?.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditReportsPanel;