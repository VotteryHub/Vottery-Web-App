import React from 'react';
import { Helmet } from 'react-helmet';
import { Coins } from 'lucide-react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import VPEconomyManagement from '../comprehensive-gamification-admin-control-center/components/VPEconomyManagement';

const VPEconomyHealthMonitorDashboard = () => {
  return (
    <GeneralPageLayout title="VP Economy Health Monitor">
      <div className="w-full bg-white dark:bg-slate-900/40 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 mb-8 p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VP Economy Health Monitor</h1>
              <p className="text-sm text-gray-500">Real-time VP circulation, velocity, zone redemptions & deviation alerts</p>
            </div>
          </div>
          <VPEconomyManagement />
      </div>
    </GeneralPageLayout>
  );
};

export default VPEconomyHealthMonitorDashboard;
