import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmailAnalyticsPanel = ({ reports, schedules }) => {
  const analyticsOverview = [
    { label: 'Total Sent', value: '8,542', change: '+12.3%', icon: 'Send', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Open Rate', value: '42.3%', change: '+5.7%', icon: 'Eye', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Click Rate', value: '18.7%', change: '+3.2%', icon: 'MousePointer', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Conversion Rate', value: '8.4%', change: '+1.8%', icon: 'Target', color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
  ];

  const reportPerformance = [
    { type: 'Compliance Reports', sent: 2347, opened: 1124, clicked: 487, converted: 234, openRate: 47.9, clickRate: 20.7 },
    { type: 'Settlement Confirmations', sent: 1893, opened: 1567, clicked: 892, converted: 456, openRate: 82.8, clickRate: 47.1 },
    { type: 'Campaign Analytics', sent: 3124, opened: 1249, clicked: 534, converted: 187, openRate: 40.0, clickRate: 17.1 },
    { type: 'Billing Summaries', sent: 1178, opened: 896, clicked: 423, converted: 298, openRate: 76.1, clickRate: 35.9 }
  ];

  const timeSeriesData = [
    { date: 'Jan 15', sent: 1247, opened: 534, clicked: 187 },
    { date: 'Jan 16', sent: 1389, opened: 612, clicked: 234 },
    { date: 'Jan 17', sent: 1156, opened: 498, clicked: 176 },
    { date: 'Jan 18', sent: 1523, opened: 687, clicked: 289 },
    { date: 'Jan 19', sent: 1678, opened: 745, clicked: 312 },
    { date: 'Jan 20', sent: 1421, opened: 623, clicked: 245 },
    { date: 'Jan 21', sent: 1128, opened: 487, clicked: 167 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsOverview?.map((metric, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric?.bgColor}`}>
                <Icon name={metric?.icon} size={20} className={metric?.color} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{metric?.label}</p>
                <p className="text-2xl font-heading font-bold text-foreground font-data">{metric?.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="TrendingUp" size={14} className="text-green-600" />
              <span className="text-sm font-bold text-green-600">{metric?.change}</span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Performance */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Report Performance by Type</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Report Type</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Sent</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Opened</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Clicked</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Converted</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Open Rate</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Click Rate</th>
              </tr>
            </thead>
            <tbody>
              {reportPerformance?.map((report, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{report?.type}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right font-data">{report?.sent?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right font-data">{report?.opened?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right font-data">{report?.clicked?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-foreground text-right font-data">{report?.converted?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-bold text-foreground text-right font-data">{report?.openRate}%</td>
                  <td className="py-3 px-4 text-sm font-bold text-foreground text-right font-data">{report?.clickRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">7-Day Trend Analysis</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex items-end justify-between gap-2 h-64 mb-4">
              {timeSeriesData?.map((day, index) => {
                const maxValue = Math.max(...timeSeriesData?.map(d => d?.sent));
                const sentHeight = (day?.sent / maxValue) * 100;
                const openedHeight = (day?.opened / maxValue) * 100;
                const clickedHeight = (day?.clicked / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-48">
                      <div 
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                        style={{ height: `${sentHeight}%` }}
                        title={`Sent: ${day?.sent}`}
                      />
                      <div 
                        className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                        style={{ height: `${openedHeight}%` }}
                        title={`Opened: ${day?.opened}`}
                      />
                      <div 
                        className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer"
                        style={{ height: `${clickedHeight}%` }}
                        title={`Clicked: ${day?.clicked}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{day?.date}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-sm text-muted-foreground">Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-sm text-muted-foreground">Opened</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-sm text-muted-foreground">Clicked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Tracking */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Conversion Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Top Converting Reports</h4>
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Settlement Confirmations</span>
                  <span className="text-sm font-bold text-green-600 font-data">24.1%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '24.1%' }} />
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Billing Summaries</span>
                  <span className="text-sm font-bold text-green-600 font-data">25.3%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '25.3%' }} />
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Compliance Reports</span>
                  <span className="text-sm font-bold text-blue-600 font-data">10.0%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Conversion Goals</h4>
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Report Downloads</span>
                  <span className="text-sm font-bold text-foreground font-data">1,247</span>
                </div>
                <p className="text-xs text-muted-foreground">Users who downloaded the full report</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Action Taken</span>
                  <span className="text-sm font-bold text-foreground font-data">892</span>
                </div>
                <p className="text-xs text-muted-foreground">Users who took recommended action</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Portal Visits</span>
                  <span className="text-sm font-bold text-foreground font-data">2,134</span>
                </div>
                <p className="text-xs text-muted-foreground">Users who visited the dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Export Analytics Report</h4>
            <p className="text-sm text-muted-foreground">Download comprehensive email analytics and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" iconName="FileText">CSV</Button>
            <Button variant="outline" iconName="FileJson">JSON</Button>
            <Button iconName="FileSpreadsheet">Excel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAnalyticsPanel;