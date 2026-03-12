import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeOptionsPanel = ({ options, onUpdate }) => {
  const [editingOption, setEditingOption] = useState(null);
  const [newOptionTitle, setNewOptionTitle] = useState('');

  const handleUpdateOption = async (optionId) => {
    try {
      // Simulate option update
      await new Promise(resolve => setTimeout(resolve, 300));
      onUpdate?.();
      setEditingOption(null);
    } catch (error) {
      console.error('Failed to update option:', error);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <Icon name="Edit" size={20} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Option Updates</h2>
          <p className="text-xs text-muted-foreground">
            Real-time collaborative refinement
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {options?.map((option) => (
          <div key={option?.id} className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {option?.title}
              </span>
              <button
                onClick={() => setEditingOption(option?.id)}
                className="text-xs text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Users" size={12} />
              <span>{option?.votes} supporters</span>
              <span>•</span>
              <span className="text-primary font-medium">{option?.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-2 mb-3">
          <Icon name="Lightbulb" size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
              Suggest New Option
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Collaborative refinement based on discussion outcomes
            </p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Enter new option title..."
          value={newOptionTitle}
          onChange={(e) => setNewOptionTitle(e?.target?.value)}
          className="w-full px-3 py-2 text-sm border border-green-300 dark:border-green-700 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
        />
        <Button
          size="sm"
          variant="outline"
          iconName="Plus"
          onClick={() => {
            if (newOptionTitle?.trim()) {
              onUpdate?.();
              setNewOptionTitle('');
            }
          }}
          disabled={!newOptionTitle?.trim()}
          className="w-full"
        >
          Propose Option
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Version Tracking</span>
          <span className="text-primary font-medium">v2.3</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Last Update</span>
          <span className="text-foreground">2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeOptionsPanel;