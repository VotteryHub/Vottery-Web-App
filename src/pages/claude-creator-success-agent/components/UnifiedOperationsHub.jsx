import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Server, Zap } from 'lucide-react';

import { useRealtimeMonitoring } from '../../../hooks/useRealtimeMonitoring';
import { carouselSecurityAuditService } from '../../../services/carouselSecurityAuditService';
import { carouselHealthAlertingService } from '../../../services/carouselHealthAlertingService';

const UnifiedOperationsHub = () => {
  const [systemsHealth, setSystemsHealth] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOperationsData = async () => {
    try {
      const [healthResult, incidentsResult, violationsResult] = await Promise.all([
        carouselSecurityAuditService?.getAllSystemsHealth(),
        carouselHealthAlertingService?.getActiveIncidents(),
        carouselSecurityAuditService?.getComplianceViolations({ status: 'pending' })
      ]);

      if (healthResult?.data) setSystemsHealth(healthResult?.data);
      if (incidentsResult?.data) setIncidents(incidentsResult?.data);
      if (violationsResult?.data) setViolations(violationsResult?.data);
    } catch (error) {
      console.error('Error loading operations data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperationsData();
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadOperationsData,
    enabled: true,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'offline':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleResolveIncident = async (incidentId) => {
    try {
      await carouselHealthAlertingService?.resolveIncident(incidentId, 'Resolved from Operations Hub');
      await loadOperationsData();
    } catch (error) {
      console.error('Error resolving incident:', error);
    }
  };

  const handleToggleSystem = async (systemName, currentStatus) => {
    try {
      await carouselSecurityAuditService?.toggleSystemEnabled(systemName, !currentStatus);
      await loadOperationsData();
    } catch (error) {
      console.error('Error toggling system:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading operations hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 12-System Status Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">12 Carousel Systems Status</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Monitoring</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {systemsHealth?.map((system) => (
            <div
              key={system?.id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                system?.isEnabled ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(system?.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(system?.status)}`}>
                    {system?.status?.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleSystem(system?.systemName, system?.isEnabled)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    system?.isEnabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {system?.isEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-2">{system?.systemName}</h3>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Health Score</span>
                <span className="font-bold text-lg">{system?.healthScore}/100</span>
              </div>

              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    system?.healthScore >= 80 ? 'bg-green-600' :
                    system?.healthScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${system?.healthScore}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Response Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Active Incidents</h2>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {incidents?.length}
          </span>
        </div>

        {incidents?.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600">No active incidents</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents?.map((incident) => (
              <div key={incident?.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident?.severity)}`}>
                      {incident?.severity?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{incident?.carouselType}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{incident?.title}</h3>
                  <p className="text-sm text-gray-600">{incident?.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Detected: {new Date(incident?.detectedAt)?.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleResolveIncident(incident?.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Anomaly Detection Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Anomaly Detection Feed</h2>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            {violations?.length}
          </span>
        </div>

        {violations?.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600">No anomalies detected</p>
          </div>
        ) : (
          <div className="space-y-3">
            {violations?.slice(0, 10)?.map((violation) => (
              <div key={violation?.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(violation?.severity)}`}>
                      {violation?.severity?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{violation?.systemName}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{violation?.violationType?.replace('_', ' ')?.toUpperCase()}</h3>
                  <p className="text-sm text-gray-600">{violation?.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Anomaly Score: {violation?.anomalyScore}/100</span>
                    <span>Detected: {new Date(violation?.detectedAt)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedOperationsHub;