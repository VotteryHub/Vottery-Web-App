import React, { useState, useEffect } from 'react';
import { Globe, TrendingUp, AlertCircle, RefreshCw, ExternalLink, BarChart3 } from 'lucide-react';
import { countryRevenueShareService } from '../../../services/countryRevenueShareService';
import { Link } from 'react-router-dom';

const CountrySpecificSplitsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [countrySplits, setCountrySplits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [splitsResult, summaryResult] = await Promise.all([
        countryRevenueShareService?.getActiveCountrySplits(),
        countryRevenueShareService?.getCountrySplitSummary()
      ]);

      if (splitsResult?.data) setCountrySplits(splitsResult?.data);
      if (summaryResult?.data) setSummary(summaryResult?.data);
    } catch (error) {
      console.error('Error loading country splits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (countryCode) => {
    const split = countrySplits?.find((s) => s?.countryCode === countryCode);
    if (!split) return;

    try {
      const result = await countryRevenueShareService?.previewRevenueImpact(
        countryCode,
        split?.creatorPercentage,
        split?.platformPercentage
      );

      if (result?.data) {
        setPreviewData(result?.data);
        setSelectedCountry(countryCode);
      }
    } catch (error) {
      console.error('Error previewing impact:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Country-Specific Revenue Splits
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Different revenue sharing percentages for creators in different countries
          </p>
        </div>
        <Link
          to="/country-revenue-share-management-center"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Manage Countries
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 text-sm">Priority System</h4>
            <p className="text-sm text-blue-800 mt-1">
              Revenue splits are applied in this order: <strong>1) Per-Creator Override</strong> →{' '}
              <strong>2) Active Campaign</strong> → <strong>3) Country-Specific Split</strong> →{' '}
              <strong>4) Global Default</strong>
            </p>
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Active Countries</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{summary?.activeCountries}</p>
              </div>
              <Globe className="w-10 h-10 text-blue-600 opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Highest Creator %</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {summary?.highestCreatorSplit?.percentage}%
                </p>
                <p className="text-xs text-green-700 mt-1">{summary?.highestCreatorSplit?.country}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Average Split</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {summary?.averageCreatorPercentage}%
                </p>
                <p className="text-xs text-purple-700 mt-1">Creator Average</p>
              </div>
              <BarChart3 className="w-10 h-10 text-purple-600 opacity-30" />
            </div>
          </div>
        </div>
      )}
      {/* Country Splits Grid */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Country Configurations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {countrySplits?.slice(0, 12)?.map((split) => (
            <div
              key={split?.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handlePreview(split?.countryCode)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{split?.countryCode}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{split?.countryName}</p>
                    {split?.zone && (
                      <p className="text-xs text-gray-500">{split?.zone?.replace('zone_', 'Zone ')}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Creator:</span>
                  <span className="font-bold text-blue-600">{split?.creatorPercentage}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-bold text-gray-600">{split?.platformPercentage}%</span>
                </div>

                {/* Visual Bar */}
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${split?.creatorPercentage}%` }}
                  />
                </div>
              </div>

              {split?.description && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{split?.description}</p>
              )}
            </div>
          ))}
        </div>

        {countrySplits?.length > 12 && (
          <div className="mt-4 text-center">
            <Link
              to="/country-revenue-share-management-center"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all {countrySplits?.length} countries →
            </Link>
          </div>
        )}
      </div>
      {/* Preview Modal */}
      {previewData && selectedCountry && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setPreviewData(null);
            setSelectedCountry(null);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
            onClick={(e) => e?.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Revenue Impact Preview - {selectedCountry}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium">Current Split</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {previewData?.currentSplit?.creatorPercentage}% /{' '}
                    {previewData?.currentSplit?.platformPercentage}%
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-medium">New Split</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {previewData?.newSplit?.creatorPercentage}% /{' '}
                    {previewData?.newSplit?.platformPercentage}%
                  </p>
                </div>
              </div>

              {previewData?.historicalData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Historical Data (Last 30 Days)</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Revenue</p>
                      <p className="font-bold text-gray-900">
                        ${previewData?.historicalData?.totalRevenue}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Creator Earnings</p>
                      <p className="font-bold text-blue-600">
                        ${previewData?.historicalData?.currentCreatorEarnings}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Platform Earnings</p>
                      <p className="font-bold text-gray-600">
                        ${previewData?.historicalData?.currentPlatformEarnings}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {previewData?.projectedData && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Projected Impact</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Creator Difference</p>
                      <p
                        className={`font-bold ${
                          parseFloat(previewData?.projectedData?.creatorDifference) >= 0
                            ? 'text-green-600' :'text-red-600'
                        }`}
                      >
                        ${previewData?.projectedData?.creatorDifference} (
                        {previewData?.projectedData?.creatorDifferencePercent}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Platform Difference</p>
                      <p
                        className={`font-bold ${
                          parseFloat(previewData?.projectedData?.platformDifference) >= 0
                            ? 'text-green-600' :'text-red-600'
                        }`}
                      >
                        ${previewData?.projectedData?.platformDifference} (
                        {previewData?.projectedData?.platformDifferencePercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {previewData?.warning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">{previewData?.warning}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setPreviewData(null);
                  setSelectedCountry(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySpecificSplitsPanel;
