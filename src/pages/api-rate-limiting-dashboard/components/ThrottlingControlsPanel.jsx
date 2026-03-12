import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { apiRateLimitingService } from '../../../services/apiRateLimitingService';

const ThrottlingControlsPanel = ({ rateLimits, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState(null);

  const handleToggleThrottling = async (id, currentState) => {
    try {
      setUpdating(true);
      await apiRateLimitingService?.toggleThrottling(id, !currentState);
      await onUpdate();
    } catch (error) {
      console.error('Toggle throttling error:', error);
      alert('Failed to toggle throttling: ' + error?.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateQuota = async (id, updates) => {
    try {
      setUpdating(true);
      await apiRateLimitingService?.updateRateLimit(id, updates);
      await onUpdate();
      setEditingEndpoint(null);
    } catch (error) {
      console.error('Update quota error:', error);
      alert('Failed to update quota: ' + error?.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Throttling Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Endpoints</span>
            <Icon name="Globe" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{rateLimits?.length}</div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Throttled</span>
            <Icon name="Sliders" size={20} className="text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {rateLimits?.filter(r => r?.throttleEnabled)?.length}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Active</span>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">
            {rateLimits?.filter(r => !r?.throttleEnabled)?.length}
          </div>
        </div>
      </div>

      {/* Throttling Controls */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Sliders" size={20} className="text-primary" />
          Throttling Configuration
        </h3>
        <div className="space-y-3">
          {rateLimits?.map((endpoint, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                    {endpoint?.method}
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">{endpoint?.endpoint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={endpoint?.throttleEnabled}
                      onChange={() => handleToggleThrottling(endpoint?.id, endpoint?.throttleEnabled)}
                      disabled={updating}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Enable Throttling</span>
                  </label>
                  <Button
                    onClick={() => setEditingEndpoint(editingEndpoint === endpoint?.id ? null : endpoint?.id)}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    <Icon name="Settings" size={14} />
                  </Button>
                </div>
              </div>

              {editingEndpoint === endpoint?.id && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Quota Configuration</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Per Minute</label>
                      <input
                        type="number"
                        defaultValue={endpoint?.quotaPerMinute}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        id={`quota-minute-${endpoint?.id}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Per Hour</label>
                      <input
                        type="number"
                        defaultValue={endpoint?.quotaPerHour}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        id={`quota-hour-${endpoint?.id}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Per Day</label>
                      <input
                        type="number"
                        defaultValue={endpoint?.quotaPerDay}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        id={`quota-day-${endpoint?.id}`}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      onClick={() => {
                        const quotaPerMinute = parseInt(document.getElementById(`quota-minute-${endpoint?.id}`)?.value);
                        const quotaPerHour = parseInt(document.getElementById(`quota-hour-${endpoint?.id}`)?.value);
                        const quotaPerDay = parseInt(document.getElementById(`quota-day-${endpoint?.id}`)?.value);
                        handleUpdateQuota(endpoint?.id, { quotaPerMinute, quotaPerHour, quotaPerDay });
                      }}
                      disabled={updating}
                      size="sm"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setEditingEndpoint(null)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <div className="text-xs text-muted-foreground">Quota/Minute</div>
                  <div className="text-sm font-semibold text-foreground">{endpoint?.quotaPerMinute}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Quota/Hour</div>
                  <div className="text-sm font-semibold text-foreground">{endpoint?.quotaPerHour}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Quota/Day</div>
                  <div className="text-sm font-semibold text-foreground">{endpoint?.quotaPerDay}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThrottlingControlsPanel;