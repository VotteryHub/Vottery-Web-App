import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TemplateManagementPanel = ({ templates, onRefresh }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const typeOptions = [
    { value: 'all', label: 'All Templates' },
    { value: 'compliance_audit', label: 'Compliance Reports' },
    { value: 'roi_breakdown', label: 'ROI Breakdown' },
    { value: 'campaign_performance', label: 'Campaign Performance' },
    { value: 'analytics_export', label: 'Analytics Export' }
  ];

  const filteredTemplates = templates
    ?.filter(t => selectedType === 'all' || t?.reportType === selectedType)
    ?.filter(t => !searchQuery || t?.templateName?.toLowerCase()?.includes(searchQuery?.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              icon="Search"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e?.target?.value)}
              options={typeOptions}
            />
          </div>
          <Button iconName="Plus">New Template</Button>
        </div>
      </div>

      {/* Template List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates?.map((template) => (
          <div key={template?.id} className="card">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{template?.templateName}</h3>
                <p className="text-xs text-muted-foreground capitalize">
                  {template?.reportType?.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${template?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs text-muted-foreground">
                  {template?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Subject:</p>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-foreground font-medium">{template?.subjectTemplate}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Variables ({Object.keys(template?.variables || {})?.length}):</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(template?.variables || {})?.slice(0, 5)?.map((variable) => (
                  <code key={variable} className="px-2 py-1 bg-muted rounded text-xs font-mono text-foreground">
                    {`{{${variable}}}`}
                  </code>
                ))}
                {Object.keys(template?.variables || {})?.length > 5 && (
                  <span className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
                    +{Object.keys(template?.variables || {})?.length - 5} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                iconName="Eye"
                onClick={() => setPreviewTemplate(template)}
                className="flex-1"
              >
                Preview
              </Button>
              <Button size="sm" variant="ghost" iconName="Edit" />
              <Button size="sm" variant="ghost" iconName="Copy" />
            </div>
          </div>
        ))}
      </div>

      {/* A/B Testing Section */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">A/B Testing</h3>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Subject Line Test - Compliance Reports</h4>
                <p className="text-sm text-muted-foreground">Testing two subject line variations for open rate optimization</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                Active
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-background border border-border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Variant A (50%)</p>
                <p className="text-sm font-medium text-foreground mb-2">&quot;Compliance Audit Report - {'{{date}}'}&quot;</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">Open Rate: <span className="font-bold text-foreground">42.3%</span></span>
                  <span className="text-muted-foreground">Sent: <span className="font-bold text-foreground">1,247</span></span>
                </div>
              </div>
              <div className="p-3 bg-background border border-border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Variant B (50%)</p>
                <p className="text-sm font-medium text-foreground mb-2">&quot;Your Compliance Report is Ready - {'{{date}}'}&quot;</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">Open Rate: <span className="font-bold text-foreground">48.7%</span></span>
                  <span className="text-muted-foreground">Sent: <span className="font-bold text-foreground">1,253</span></span>
                </div>
              </div>
            </div>
            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="text-xs text-green-700 dark:text-green-400">
                <Icon name="TrendingUp" size={12} className="inline mr-1" />
                Variant B performing 15% better - Consider making it the default
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Design Preview */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Responsive Design</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-full aspect-[9/16] bg-muted/30 rounded-lg mb-2 flex items-center justify-center">
              <Icon name="Smartphone" size={48} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Mobile</p>
            <p className="text-xs text-muted-foreground">320px - 480px</p>
          </div>
          <div className="text-center">
            <div className="w-full aspect-[4/3] bg-muted/30 rounded-lg mb-2 flex items-center justify-center">
              <Icon name="Tablet" size={48} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Tablet</p>
            <p className="text-xs text-muted-foreground">481px - 768px</p>
          </div>
          <div className="text-center">
            <div className="w-full aspect-[16/9] bg-muted/30 rounded-lg mb-2 flex items-center justify-center">
              <Icon name="Monitor" size={48} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Desktop</p>
            <p className="text-xs text-muted-foreground">769px+</p>
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  {previewTemplate?.templateName}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setPreviewTemplate(null)}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Subject:</p>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground">{previewTemplate?.subjectTemplate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Body:</p>
                  <div className="p-4 bg-muted/30 rounded-lg max-h-96 overflow-y-auto">
                    <div className="text-sm text-foreground whitespace-pre-wrap">
                      {previewTemplate?.bodyTemplate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Guidelines */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Template Best Practices</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Use dynamic variables for personalization ({'{{userName}}'}, {'{{date}}'}, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Keep subject lines under 50 characters for mobile optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Include clear call-to-action buttons with contrasting colors</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Test templates across different email clients before deployment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateManagementPanel;