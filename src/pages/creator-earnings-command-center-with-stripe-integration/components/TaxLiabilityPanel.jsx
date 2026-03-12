import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const TaxLiabilityPanel = () => {
  const { user } = useAuth();
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taxYear, setTaxYear] = useState(new Date()?.getFullYear());

  useEffect(() => {
    loadTaxData();
  }, [taxYear]);

  const loadTaxData = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const grossEarnings = 28450.00;
      const platformFee = grossEarnings * 0.30;
      const netEarnings = grossEarnings - platformFee;
      const estimatedTaxRate = 0.22; // 22% bracket
      const estimatedTax = netEarnings * estimatedTaxRate;
      const quarterlyPayment = estimatedTax / 4;

      setTaxData({
        taxYear,
        grossEarnings,
        platformFee,
        netEarnings,
        estimatedTaxRate: estimatedTaxRate * 100,
        estimatedTax,
        quarterlyPayment,
        withholdingToDate: estimatedTax * 0.5,
        remainingLiability: estimatedTax * 0.5,
        documents: [
          { type: '1099-K', year: taxYear - 1, status: 'available', amount: 22100.00 },
          { type: '1099-NEC', year: taxYear - 1, status: 'available', amount: 4200.00 },
          { type: '1099-K', year: taxYear, status: 'pending', amount: null },
        ],
        quarterlySchedule: [
          { quarter: 'Q1', dueDate: `Apr 15, ${taxYear}`, amount: quarterlyPayment, status: 'paid' },
          { quarter: 'Q2', dueDate: `Jun 15, ${taxYear}`, amount: quarterlyPayment, status: 'paid' },
          { quarter: 'Q3', dueDate: `Sep 15, ${taxYear}`, amount: quarterlyPayment, status: 'due' },
          { quarter: 'Q4', dueDate: `Jan 15, ${taxYear + 1}`, amount: quarterlyPayment, status: 'upcoming' },
        ]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Tax Year Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Tax Liability Preview
        </h3>
        <select
          value={taxYear}
          onChange={e => setTaxYear(Number(e?.target?.value))}
          className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
        >
          {[new Date()?.getFullYear(), new Date()?.getFullYear() - 1]?.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {/* Earnings Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross Earnings', value: `$${taxData?.grossEarnings?.toLocaleString()}`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Platform Fee (30%)', value: `-$${taxData?.platformFee?.toLocaleString()}`, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Net Taxable Income', value: `$${taxData?.netEarnings?.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Est. Tax Liability', value: `$${taxData?.estimatedTax?.toLocaleString()}`, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ]?.map((item, i) => (
          <div key={i} className={`${item?.bg} rounded-xl p-4`}>
            <p className="text-xs text-gray-500 mb-1">{item?.label}</p>
            <p className={`text-xl font-bold ${item?.color}`}>{item?.value}</p>
          </div>
        ))}
      </div>
      {/* Tax Withholding Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Withholding Progress</h4>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Withheld to Date</span>
            <span className="font-medium">${taxData?.withholdingToDate?.toLocaleString()} / ${taxData?.estimatedTax?.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${(taxData?.withholdingToDate / taxData?.estimatedTax) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            Remaining liability: <strong>${taxData?.remainingLiability?.toLocaleString()}</strong> · Tax rate: {taxData?.estimatedTaxRate}%
          </span>
        </div>
      </div>
      {/* Quarterly Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quarterly Payment Schedule</h4>
        <div className="space-y-2">
          {taxData?.quarterlySchedule?.map((q, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{q?.quarter}</span>
                <span className="text-xs text-gray-500">{q?.dueDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">${q?.amount?.toLocaleString()}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                  q?.status === 'paid' ? 'bg-green-100 text-green-700' :
                  q?.status === 'due' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {q?.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tax Documents */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tax Documents</h4>
        <div className="space-y-2">
          {taxData?.documents?.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{doc?.type} — {doc?.year}</p>
                  {doc?.amount && <p className="text-xs text-gray-500">${doc?.amount?.toLocaleString()}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  doc?.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {doc?.status}
                </span>
                {doc?.status === 'available' && (
                  <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Download className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxLiabilityPanel;
