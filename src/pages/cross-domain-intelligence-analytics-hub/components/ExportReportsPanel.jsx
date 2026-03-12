import React from 'react';
import Icon from '../../../components/AppIcon';

const ExportReportsPanel = ({ intelligence }) => {
  const handleExport = (format) => {
    console.log(`Exporting intelligence report in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Download" size={20} />
          Export Intelligence Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('pdf')}
            className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <Icon name="FileText" size={24} className="text-red-600 dark:text-red-400 mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">PDF Report</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Executive summary format</p>
          </button>

          <button
            onClick={() => handleExport('json')}
            className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Icon name="Code" size={24} className="text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">JSON Data</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Raw intelligence data</p>
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
          >
            <Icon name="Table" size={24} className="text-green-600 dark:text-green-400 mb-2" />
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">CSV Export</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Spreadsheet format</p>
          </button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Report Templates</h3>
        <div className="space-y-3">
          {[
            { name: 'Executive Intelligence Briefing', description: 'High-level strategic insights for leadership', icon: 'Briefcase' },
            { name: 'Technical Threat Analysis', description: 'Detailed technical analysis for security teams', icon: 'Shield' },
            { name: 'Compliance Intelligence Report', description: 'Regulatory and compliance-focused intelligence', icon: 'FileText' },
            { name: 'Performance Optimization Report', description: 'AI model performance and optimization recommendations', icon: 'TrendingUp' },
          ]?.map((template, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name={template?.icon} size={20} className="text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{template?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{template?.description}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors">
                Generate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Intelligence Alert Configuration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Significant Pattern Changes</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Threat Convergence Alerts</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Strategic Opportunity Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReportsPanel;