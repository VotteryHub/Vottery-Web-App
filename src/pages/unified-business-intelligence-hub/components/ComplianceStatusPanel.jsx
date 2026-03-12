import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceStatusPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Compliance Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Score</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.complianceScore || 0}%
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Jurisdictions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalJurisdictions || 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Compliant</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.compliantJurisdictions || 0}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
              {data?.pendingReviews || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Standards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Regulatory Standards Compliance
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">GDPR Compliance</span>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
              {data?.gdprCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">PCI-DSS Compliance</span>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
              {data?.pciDssCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
            </span>
          </div>
        </div>
      </div>

      {/* Policy Violations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-orange-500" />
          Policy Violations (30d)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Violations</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalViolations || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
              {data?.criticalViolations || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.resolvedViolations || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Filings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="FileText" size={20} className="text-blue-500" />
          Regulatory Filings (90d)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Filings</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalFilings || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.submittedFilings || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStatusPanel;