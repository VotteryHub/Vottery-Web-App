import React from 'react';
import Icon from '../../../components/AppIcon';

const CollusionDetectionPanel = ({ collusionData, onRefresh }) => {
  if (!collusionData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No collusion detection data available</p>
      </div>
    );
  }

  const { networks } = collusionData;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} className="text-primary" />
          Detected Collusion Networks
        </h3>
        <div className="space-y-4">
          {networks?.map((network) => (
            <div key={network?.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">Network #{network?.id}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  network?.status === 'confirmed' ? 'bg-red-100 text-red-700' :
                  network?.status === 'investigating'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {network?.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Network Size</p>
                  <p className="font-medium text-foreground">{network?.size} accounts</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="font-medium text-foreground">{(network?.confidence * 100)?.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Detected At</p>
                  <p className="font-medium text-foreground">{network?.detectedAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollusionDetectionPanel;