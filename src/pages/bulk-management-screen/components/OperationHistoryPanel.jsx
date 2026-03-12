import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OperationHistoryPanel = ({ operations, onSelectOperation }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperations = operations?.filter((op) => {
    const matchesFilter = filter === 'all' || op?.status === filter;
    const matchesSearch = op?.operationName?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      rolled_back: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      partially_completed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return badges?.[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="History" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Operation History</h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="rolled_back">Rolled Back</option>
            <option value="partially_completed">Partially Completed</option>
          </select>
        </div>
      </div>
      {filteredOperations?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No operations found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Operation Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Progress</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Items</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Created</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperations?.map((operation) => (
                <tr
                  key={operation?.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{operation?.operationName}</p>
                    <p className="text-xs text-muted-foreground">
                      Created by {operation?.createdByProfile?.name || 'Unknown'}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {operation?.operationType?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(operation?.status)}`}>
                      {operation?.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${operation?.progressPercentage || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {operation?.progressPercentage || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <p className="text-foreground">{operation?.processedItems} / {operation?.totalItems}</p>
                      <p className="text-xs text-green-500">{operation?.successfulItems} success</p>
                      {operation?.failedItems > 0 && (
                        <p className="text-xs text-red-500">{operation?.failedItems} failed</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(operation?.createdAt)?.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      iconName="Eye"
                      onClick={() => onSelectOperation(operation)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OperationHistoryPanel;