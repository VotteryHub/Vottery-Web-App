import React from 'react';
import Icon from '../../../components/AppIcon';
import { Bar, Doughnut } from 'react-chartjs-2';

const CreatorPayoutPanel = ({ data, timeRange }) => {
  const zonePayoutsData = {
    labels: Object.values(data?.payouts || {})?.map(z => z?.name),
    datasets: [{
      label: 'Total Payout ($)',
      data: Object.values(data?.payouts || {})?.map(z => z?.totalPayout),
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(14, 165, 233, 0.8)'
      ]
    }]
  };

  const creatorDistributionData = {
    labels: Object.values(data?.payouts || {})?.map(z => z?.name),
    datasets: [{
      data: Object.values(data?.payouts || {})?.map(z => z?.creatorCount),
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(14, 165, 233, 0.8)'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-6">
          <Icon name="Users" size={24} className="text-purple-500" />
          Creator Payout Distribution Across Eight Purchasing Power Zones
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Payouts by Zone</h3>
            <div className="h-[300px]">
              <Bar data={zonePayoutsData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Creator Distribution</h3>
            <div className="h-[300px]">
              <Doughnut data={creatorDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(data?.payouts || {})?.slice(0, 4)?.map(([zoneKey, zoneData], index) => (
          <div key={zoneKey} className="bg-card rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">{zoneData?.name}</h3>
              <Icon name="Globe" size={18} className="text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-500 mb-2">${zoneData?.totalPayout?.toLocaleString()}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Creators</span>
                <span className="font-semibold text-foreground">{zoneData?.creatorCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Avg Payout</span>
                <span className="font-semibold text-foreground">${zoneData?.avgPayout?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Optimization</span>
                <span className={`font-semibold ${
                  parseFloat(zoneData?.optimizationScore) >= 90 ? 'text-green-500' : 
                  parseFloat(zoneData?.optimizationScore) >= 70 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {zoneData?.optimizationScore}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(data?.payouts || {})?.slice(4, 8)?.map(([zoneKey, zoneData], index) => (
          <div key={zoneKey} className="bg-card rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">{zoneData?.name}</h3>
              <Icon name="Globe" size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-500 mb-2">${zoneData?.totalPayout?.toLocaleString()}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Creators</span>
                <span className="font-semibold text-foreground">{zoneData?.creatorCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Avg Payout</span>
                <span className="font-semibold text-foreground">${zoneData?.avgPayout?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Optimization</span>
                <span className={`font-semibold ${
                  parseFloat(zoneData?.optimizationScore) >= 90 ? 'text-green-500' : 
                  parseFloat(zoneData?.optimizationScore) >= 70 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {zoneData?.optimizationScore}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Zone-Specific Currency Conversion</h3>
        <div className="space-y-2">
          {[
            { zone: 'USA', currency: 'USD', rate: 1.0, payout: '$12,450' },
            { zone: 'Western Europe', currency: 'EUR', rate: 0.92, payout: '€11,454' },
            { zone: 'India', currency: 'INR', rate: 83.0, payout: '₹1,03,335' },
            { zone: 'Latin America', currency: 'BRL', rate: 5.2, payout: 'R$64,740' }
          ]?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="DollarSign" size={18} className="text-green-500" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item?.zone}</p>
                  <p className="text-xs text-muted-foreground">{item?.currency}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Exchange Rate</p>
                  <p className="text-sm font-bold text-foreground">{item?.rate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Payout</p>
                  <p className="text-sm font-bold text-green-500">{item?.payout}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorPayoutPanel;