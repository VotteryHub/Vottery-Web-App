import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { smsAlertTemplatesService } from '../../../services/smsAlertTemplatesService';

const SMSAlertTemplatesPanel = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = smsAlertTemplatesService?.getTemplateCategories();

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const { data } = await smsAlertTemplatesService?.getAllTemplates(filters);
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all' ?'bg-primary text-primary-foreground' :'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            All Templates
          </button>
          {categories?.map((cat) => (
            <button
              key={cat?.id}
              onClick={() => setSelectedCategory(cat?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={cat?.icon} size={16} />
              <span>{cat?.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      {loading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        </div>
      ) : templates?.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No templates found</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {templates?.map((template) => {
            const category = categories?.find(c => c?.id === template?.category);
            return (
              <div key={template?.templateId} className="card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.bgColor || 'bg-gray-50'}`}>
                      <Icon name={category?.icon || 'FileText'} size={20} className={category?.color || 'text-gray-600'} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{template?.templateName}</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium capitalize">
                          {template?.provider}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {template?.variables?.length || 0} variables
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Max {template?.maxLength || 160} chars
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" iconName="Edit" />
                    <Button variant="ghost" size="sm" iconName="Copy" />
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {template?.variables?.map((variable) => (
                      <code key={variable} className="px-2 py-1 bg-muted rounded text-xs font-mono text-foreground">
                        {`{{${variable}}}`}
                      </code>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Template Content:</p>
                  <div className="p-3 bg-background border border-border rounded font-mono text-xs text-foreground whitespace-pre-wrap">
                    {template?.messageBody}
                  </div>
                </div>
              </div>
            );
          })}
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
                <span>Keep SMS templates under 160 characters for single-message delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Use clear, concise language with severity indicators (🚨, ⚠️, ✅)</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Include timestamp and reference ID for tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Test templates with sample data before deployment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSAlertTemplatesPanel;
