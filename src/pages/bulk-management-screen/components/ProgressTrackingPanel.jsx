import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { bulkManagementService } from '../../../services/bulkManagementService';

const ProgressTrackingPanel = ({ operations, onExecute, onRefresh }) => {
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [operationDetails, setOperationDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedOperation) {
      loadOperationDetails(selectedOperation?.id);
      const channel = bulkManagementService?.subscribeToOperationUpdates(
        selectedOperation?.id,
        (payload) => {
          if (payload?.data) {
            setSelectedOperation(payload?.data);
            loadOperationDetails(payload?.data?.id);
          }
        }
      );

      return () => {
        bulkManagementService?.unsubscribeFromOperationUpdates(channel);
      };
    }
  }, [selectedOperation?.id]);

  const loadOperationDetails = async (operationId) => {
    setLoading(true);
    try {
      const result = await bulkManagementService?.getBulkOperationDetails(operationId);
      if (result?.data) {
        setOperationDetails(result?.data);
      }
    } catch (error) {
      console.error('Failed to load operation details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'processing':
        return 'text-blue-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle2';
      case 'processing':
        return 'Loader';
      case 'failed':
        return 'XCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Activity" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Active Operations</h2>
        </div>

        {operations?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active operations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {operations?.map((operation) => (
              <div
                key={operation?.id}
                onClick={() => setSelectedOperation(operation)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedOperation?.id === operation?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {operation?.operationName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {operation?.operationType?.replace(/_/g, ' ')?.toUpperCase()}
                    </p>
                  </div>
                  <Icon
                    name={getStatusIcon(operation?.status)}
                    size={20}
                    className={`${getStatusColor(operation?.status)} ${
                      operation?.status === 'processing' ? 'animate-spin' : ''
                    }`}
                  />
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{operation?.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${operation?.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {operation?.processedItems || 0} / {operation?.totalItems || 0} items
                  </span>
                  {operation?.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      iconName="Play"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onExecute(operation?.id);
                      }}
                    >
                      Execute
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Info" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Operation Details</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader" size={32} className="text-primary animate-spin" />
          </div>
        ) : selectedOperation ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Total Items</p>
                <p className="text-2xl font-bold text-foreground">{selectedOperation?.totalItems}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Processed</p>
                <p className="text-2xl font-bold text-foreground">{selectedOperation?.processedItems}</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Successful</p>
                <p className="text-2xl font-bold text-green-500">{selectedOperation?.successfulItems}</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-500">{selectedOperation?.failedItems}</p>
              </div>
            </div>

            {operationDetails?.logs && operationDetails?.logs?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Recent Logs</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {operationDetails?.logs?.slice(0, 10)?.map((log) => (
                    <div
                      key={log?.id}
                      className="flex items-start gap-2 p-2 rounded bg-muted/30 text-xs"
                    >
                      <Icon
                        name={log?.logLevel === 'error' ? 'AlertCircle' : 'Info'}
                        size={14}
                        className={log?.logLevel === 'error' ? 'text-red-500' : 'text-blue-500'}
                      />
                      <div className="flex-1">
                        <p className="text-foreground">{log?.message}</p>
                        <p className="text-muted-foreground mt-1">
                          {new Date(log?.createdAt)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              iconName="RefreshCw"
              onClick={() => loadOperationDetails(selectedOperation?.id)}
              className="w-full"
            >
              Refresh Details
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="MousePointer" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select an operation to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTrackingPanel;