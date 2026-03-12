import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RollbackManagementPanel = ({ operations, onRollback }) => {
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [confirmRollback, setConfirmRollback] = useState(false);

  const handleRollback = async () => {
    if (selectedOperation) {
      await onRollback(selectedOperation?.id);
      setSelectedOperation(null);
      setConfirmRollback(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="RotateCcw" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Rollback Management</h2>
      </div>

      {operations?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No operations available for rollback</p>
        </div>
      ) : (
        <div className="space-y-4">
          {operations?.map((operation) => (
            <div
              key={operation?.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {operation?.operationName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {operation?.operationType?.replace(/_/g, ' ')?.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed: {new Date(operation?.completedAt)?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {operation?.rollbackEnabled ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Rollback Enabled
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
                      Rollback Disabled
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Total Items</p>
                  <p className="text-lg font-bold text-foreground">{operation?.totalItems}</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Successful</p>
                  <p className="text-lg font-bold text-green-500">{operation?.successfulItems}</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Failed</p>
                  <p className="text-lg font-bold text-red-500">{operation?.failedItems}</p>
                </div>
              </div>

              {operation?.rollbackEnabled && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    iconName="RotateCcw"
                    onClick={() => {
                      setSelectedOperation(operation);
                      setConfirmRollback(true);
                    }}
                    className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    Rollback Operation
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmRollback && selectedOperation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-orange-500" />
              <h3 className="text-lg font-semibold text-foreground">Confirm Rollback</h3>
            </div>

            <p className="text-muted-foreground mb-6">
              Are you sure you want to rollback the operation "{selectedOperation?.operationName}"? 
              This will revert all {selectedOperation?.successfulItems} successful changes.
            </p>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-800 dark:text-orange-400">
                <strong>Warning:</strong> This action cannot be undone. All processed items will be reverted to their previous state.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                iconName="X"
                onClick={() => {
                  setSelectedOperation(null);
                  setConfirmRollback(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                iconName="RotateCcw"
                onClick={handleRollback}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Confirm Rollback
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RollbackManagementPanel;