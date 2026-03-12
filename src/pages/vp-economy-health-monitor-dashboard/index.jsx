import React from 'react';
import { Helmet } from 'react-helmet';
import { Coins } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import VPEconomyManagement from '../comprehensive-gamification-admin-control-center/components/VPEconomyManagement';

const VPEconomyHealthMonitorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>VP Economy Health Monitor | Vottery</title></Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VP Economy Health Monitor</h1>
              <p className="text-sm text-gray-500">Real-time VP circulation, velocity, zone redemptions & deviation alerts</p>
            </div>
          </div>
          <VPEconomyManagement />
        </main>
      </div>
    </div>
  );
};

export default VPEconomyHealthMonitorDashboard;
