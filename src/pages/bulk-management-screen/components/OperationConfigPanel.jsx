import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OperationConfigPanel = ({ onCreateOperation }) => {
  const [formData, setFormData] = useState({
    operationName: '',
    operationType: 'election_approval',
    targetEntityType: 'elections',
    targetEntityIds: [],
    batchSize: 50,
    rollbackEnabled: true
  });
  const [entityIdsInput, setEntityIdsInput] = useState('');

  const operationTypes = [
    { value: 'election_approval', label: 'Approve Elections' },
    { value: 'election_rejection', label: 'Reject Elections' },
    { value: 'user_suspension', label: 'Suspend Users' },
    { value: 'user_activation', label: 'Activate Users' },
    { value: 'compliance_submission', label: 'Submit Compliance Reports' },
    { value: 'data_export', label: 'Export Data' },
    { value: 'batch_update', label: 'Batch Update' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    const entityIds = entityIdsInput
      ?.split('\n')
      ?.map(id => id?.trim())
      ?.filter(id => id?.length > 0);

    onCreateOperation({
      ...formData,
      targetEntityIds: entityIds
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Settings" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Configure Bulk Operation</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Operation Name
          </label>
          <Input
            type="text"
            value={formData?.operationName}
            onChange={(e) => setFormData({ ...formData, operationName: e?.target?.value })}
            placeholder="Enter operation name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Operation Type
          </label>
          <Select
            value={formData?.operationType}
            onChange={(e) => setFormData({ ...formData, operationType: e?.target?.value })}
            options={operationTypes}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Target Entity IDs (one per line)
          </label>
          <textarea
            value={entityIdsInput}
            onChange={(e) => setEntityIdsInput(e?.target?.value)}
            placeholder="Paste entity IDs here, one per line"
            className="w-full h-40 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Total entities: {entityIdsInput?.split('\n')?.filter(id => id?.trim()?.length > 0)?.length}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Batch Size
            </label>
            <Input
              type="number"
              value={formData?.batchSize}
              onChange={(e) => setFormData({ ...formData, batchSize: parseInt(e?.target?.value) })}
              min="1"
              max="100"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="rollbackEnabled"
              checked={formData?.rollbackEnabled}
              onChange={(e) => setFormData({ ...formData, rollbackEnabled: e?.target?.checked })}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="rollbackEnabled" className="text-sm font-medium text-foreground">
              Enable Rollback
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button type="submit" iconName="Play">
            Create Operation
          </Button>
          <Button
            type="button"
            variant="outline"
            iconName="X"
            onClick={() => {
              setFormData({
                operationName: '',
                operationType: 'election_approval',
                targetEntityType: 'elections',
                targetEntityIds: [],
                batchSize: 50,
                rollbackEnabled: true
              });
              setEntityIdsInput('');
            }}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OperationConfigPanel;