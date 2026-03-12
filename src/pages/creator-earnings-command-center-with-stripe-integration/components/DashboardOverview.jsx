import React, { useState, useEffect } from 'react';
import { DollarSign, Globe, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { creatorEarningsService } from '../../../services/creatorEarningsService';

const DashboardOverview = ({ data }) => {
  const [countryEarnings, setCountryEarnings] = useState([]);
  const [taxObligations, setTaxObligations] = useState([]);
  const [projections, setProjections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnhancedData();
  }, []);

  const loadEnhancedData = async () => {
    try {
      setLoading(true);
      const [countryResult, taxResult, projectionResult] = await Promise.all([
        creatorEarningsService?.getEarningsByCountry(),
        creatorEarningsService?.getTaxObligationsByJurisdiction(),
        creatorEarningsService?.getProjectedAnnualEarnings()
      ]);

      if (countryResult?.data) setCountryEarnings(countryResult?.data);
      if (taxResult?.data) setTaxObligations(taxResult?.data);
      if (projectionResult?.data) setProjections(projectionResult?.data);
    } catch (error) {
      console.error('Error loading enhanced data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Total Earnings</span>
            <Icon icon={DollarSign} className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900">
            ${(data?.totalEarnings || 0)?.toLocaleString()}
          </div>
          <p className="text-xs text-green-600 mt-2">Lifetime earnings</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-700">Pending Payouts</span>
            <Icon icon={DollarSign} className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-900">
            ${(data?.pendingPayouts || 0)?.toLocaleString()}
          </div>
          <p className="text-xs text-orange-600 mt-2">Awaiting processing</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Elections Revenue</span>
            <Icon icon={TrendingUp} className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">
            ${(data?.successfulElectionsRevenue || 0)?.toLocaleString()}
          </div>
          <p className="text-xs text-blue-600 mt-2">From completed elections</p>
        </div>
      </div>

      {/* Country-Based Earnings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={Globe} className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Earnings by Country</h3>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading country data...</div>
        ) : (
          <div className="space-y-3">
            {countryEarnings?.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">{country?.countryCode}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{country?.countryCode}</p>
                    <p className="text-sm text-gray-500">{country?.transactionCount} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${country?.totalEarnings?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tax Obligations */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={FileText} className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tax Obligations by Jurisdiction</h3>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading tax data...</div>
        ) : (
          <div className="space-y-3">
            {taxObligations?.map((tax, index) => (
              <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon icon={AlertCircle} className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">{tax?.countryCode}</span>
                  </div>
                  <span className="text-sm text-gray-600">{tax?.formType}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-600">Total Earnings</p>
                    <p className="text-sm font-semibold text-gray-900">${tax?.totalEarnings?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Tax Rate</p>
                    <p className="text-sm font-semibold text-gray-900">{tax?.taxRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Estimated Tax</p>
                    <p className="text-sm font-semibold text-red-600">${tax?.estimatedTax?.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Filing Deadline: {tax?.filingDeadline}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projected Annual Earnings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={TrendingUp} className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Projected Annual Earnings</h3>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Calculating projections...</div>
        ) : projections ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Projection</p>
                <p className="text-2xl font-bold text-blue-600">${projections?.projectedAnnual?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Based on 90-day average</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">With Growth</p>
                <p className="text-2xl font-bold text-green-600">${projections?.projectedWithGrowth?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Including {projections?.growthRate?.toFixed(1)}% growth</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Daily Average</p>
                <p className="text-2xl font-bold text-purple-600">${projections?.currentDailyAverage?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Confidence: {projections?.confidence}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                  <p className="text-lg font-semibold text-gray-900">${projections?.last30DaysTotal?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last 90 Days</p>
                  <p className="text-lg font-semibold text-gray-900">${projections?.last90DaysTotal?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                  <p className={`text-lg font-semibold ${projections?.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {projections?.growthRate >= 0 ? '+' : ''}{projections?.growthRate?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No projection data available</div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
