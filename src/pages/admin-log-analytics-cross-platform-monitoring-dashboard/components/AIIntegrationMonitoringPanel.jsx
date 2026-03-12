import React from 'react';
import { Cpu, Zap, Shield, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const AIIntegrationMonitoringPanel = () => {
  const aiServices = [
    {
      name: 'Claude Dispute Resolution',
      status: 'active',
      health: 'healthy',
      logsToday: 1250,
      avgConfidence: 0.94,
      decisions: 342,
      icon: Shield,
      color: 'purple'
    },
    {
      name: 'Perplexity Threat Analysis',
      status: 'active',
      health: 'healthy',
      logsToday: 890,
      avgConfidence: 0.91,
      decisions: 156,
      icon: AlertCircle,
      color: 'red'
    },
    {
      name: 'OpenAI Content Moderation',
      status: 'active',
      health: 'healthy',
      logsToday: 2340,
      avgConfidence: 0.88,
      decisions: 1890,
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'Fraud Detection AI',
      status: 'active',
      health: 'healthy',
      logsToday: 560,
      avgConfidence: 0.96,
      decisions: 89,
      icon: Shield,
      color: 'orange'
    },
    {
      name: 'Payment Processing AI',
      status: 'active',
      health: 'healthy',
      logsToday: 1120,
      avgConfidence: 0.92,
      decisions: 445,
      icon: DollarSign,
      color: 'blue'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      blue: 'bg-blue-100 text-blue-600'
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <Cpu className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-slate-900">AI Integration Monitoring</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {aiServices?.map((service, idx) => {
          const Icon = service?.icon;
          return (
            <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getColorClasses(service?.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{service?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">{service?.health?.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Logs Today</p>
                  <p className="text-lg font-bold text-slate-900">{service?.logsToday?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Avg Confidence</p>
                  <p className="text-lg font-bold text-slate-900">{(service?.avgConfidence * 100)?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Decisions</p>
                  <p className="text-lg font-bold text-slate-900">{service?.decisions}</p>
                </div>
              </div>

              {/* Confidence Scoring */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Confidence Score</span>
                  <span>{(service?.avgConfidence * 100)?.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${service?.avgConfidence >= 0.9 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${service?.avgConfidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reasoning Chain Visibility */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Reasoning Chain Visibility</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 mb-1">Automated Decision Workflows</p>
              <p className="text-xs text-slate-600">
                All AI decisions include full reasoning chains with confidence scoring, allowing admins to audit 
                and understand automated moderation, fraud detection, and content analysis decisions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 mb-1">Confidence Scoring</p>
              <p className="text-xs text-slate-600">
                Each AI decision includes a confidence score (0-1) indicating the model's certainty. 
                Low confidence decisions are automatically flagged for human review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIntegrationMonitoringPanel;