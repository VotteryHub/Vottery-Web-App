import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Play, FileCheck } from 'lucide-react';
import { revenueSplitSandboxService } from '../../../services/revenueSplitSandboxService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const ValidationWorkflowPanel = ({ sandboxConfigs, onRefresh }) => {
  const [validating, setValidating] = useState(false);
  const [validationResults, setValidationResults] = useState({});

  const handleValidate = async (configId) => {
    try {
      setValidating(true);
      const result = await revenueSplitSandboxService?.validateSandboxConfig(configId);
      
      setValidationResults(prev => ({
        ...prev,
        [configId]: result?.data
      }));

      analytics?.trackEvent('sandbox_validation_executed', {
        config_id: configId,
        valid: result?.data?.valid
      });
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setValidating(false);
    }
  };

  const getValidationIcon = (result) => {
    if (!result) return <FileCheck className="w-5 h-5 text-gray-400" />;
    if (result?.valid) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Sandbox Validation Workflow
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Validate sandbox configurations before migrating to production
        </p>

        <div className="space-y-4">
          {sandboxConfigs?.map((config) => {
            const result = validationResults?.[config?.id];
            return (
              <div
                key={config?.id}
                className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getValidationIcon(result)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {config?.sandboxName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {config?.creatorPercentage}% / {config?.platformPercentage}% split
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleValidate(config?.id)}
                    disabled={validating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Validate
                  </button>
                </div>

                {result && (
                  <div className="space-y-3">
                    {/* Validation Status */}
                    <div
                      className={`p-3 rounded-lg flex items-center gap-2 ${
                        result?.valid
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' :'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                      }`}
                    >
                      {result?.valid ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={`font-medium ${
                          result?.valid
                            ? 'text-green-800 dark:text-green-200' :'text-red-800 dark:text-red-200'
                        }`}
                      >
                        {result?.valid ? 'Validation Passed' : 'Validation Failed'}
                      </span>
                    </div>

                    {/* Errors */}
                    {result?.errors?.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-medium text-red-800 dark:text-red-200 text-sm">
                          Errors:
                        </div>
                        {result?.errors?.map((error, index) => (
                          <div
                            key={index}
                            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Warnings */}
                    {result?.warnings?.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
                          Warnings:
                        </div>
                        {result?.warnings?.map((warning, index) => (
                          <div
                            key={index}
                            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 flex items-center gap-2"
                          >
                            <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm text-yellow-800 dark:text-yellow-200">{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Validation Checklist */}
                    {result?.valid && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
                          Pre-Production Checklist:
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Percentage totals validated (100%)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Range validation passed (0-100%)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Configuration structure valid
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Ready for production deployment
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {sandboxConfigs?.length === 0 && (
          <div className="text-center py-12">
            <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No sandbox configurations to validate
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationWorkflowPanel;