import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, TrendingUp, Shield, AlertTriangle, Zap, DollarSign, Activity } from 'lucide-react';
import GeminiMonitoringService from '../../services/geminiMonitoringService';
import { supabase } from '../../lib/supabase';

const GeminiFallbackOrchestrationHub = () => {
  const [automaticFallbacks, setAutomaticFallbacks] = useState([]);
  const [manualRequests, setManualRequests] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [geminiReadiness, setGeminiReadiness] = useState(null);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'automatic'

  useEffect(() => {
    loadFallbackData();
    loadGeminiReadiness();

    // Check for reportId in URL
    const params = new URLSearchParams(window.location.search);
    const reportId = params?.get('reportId');
    if (reportId) {
      loadReportDetails(reportId);
    }
  }, []);

  const loadFallbackData = async () => {
    try {
      // Load automatic fallbacks
      const { data: autoFallbacks, error: autoError } = await supabase?.from('ai_service_fallback_config')?.select('*')?.eq('is_active', true)?.eq('activation_reason', 'automatic_service_disruption')?.order('activated_at', { ascending: false });

      if (autoError) throw autoError;
      setAutomaticFallbacks(autoFallbacks || []);

      // Load manual approval requests
      const reports = await GeminiMonitoringService?.getCaseReports({ status: 'pending_review' });
      setManualRequests(reports || []);
    } catch (error) {
      console.error('Error loading fallback data:', error);
    }
  };

  const loadReportDetails = async (reportId) => {
    try {
      const { data, error } = await supabase
        ?.from('ai_service_case_reports')
        ?.select('*')
        ?.eq('id', reportId)
        ?.single();

      if (error) throw error;
      setSelectedReport(data);
    } catch (error) {
      console.error('Error loading report details:', error);
    }
  };

  const loadGeminiReadiness = async () => {
    try {
      const metrics = await GeminiMonitoringService?.getServiceMetrics('gemini');
      setGeminiReadiness({
        status: 'ready',
        responseTime: metrics?.avgResponseTime || 1200,
        errorRate: metrics?.errorRate || 0.02,
        costPerQuery: metrics?.costPerQuery || 0.0015,
        availability: metrics?.availabilityPercentage || 99.9
      });
    } catch (error) {
      console.error('Error loading Gemini readiness:', error);
      setGeminiReadiness({
        status: 'ready',
        responseTime: 1200,
        errorRate: 0.02,
        costPerQuery: 0.0015,
        availability: 99.9
      });
    }
  };

  const handleApprove = async (reportId) => {
    setProcessing(true);
    try {
      await GeminiMonitoringService?.updateTakeoverRequest(reportId, 'approved', adminNotes);
      await loadFallbackData();
      setSelectedReport(null);
      setAdminNotes('');
      alert('✅ Takeover request approved. Gemini will now handle tasks for this service.');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('❌ Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (reportId) => {
    setProcessing(true);
    try {
      await GeminiMonitoringService?.updateTakeoverRequest(reportId, 'rejected', adminNotes);
      await loadFallbackData();
      setSelectedReport(null);
      setAdminNotes('');
      alert('❌ Takeover request rejected.');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('❌ Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  const deactivateAutomaticFallback = async (configId, serviceName) => {
    if (!confirm(`Deactivate automatic fallback for ${serviceName}? The original service will resume handling requests.`)) {
      return;
    }

    try {
      const { error } = await supabase?.from('ai_service_fallback_config')?.update({
          is_active: false,
          deactivated_at: new Date()?.toISOString()
        })?.eq('id', configId);

      if (error) throw error;
      
      await loadFallbackData();
      alert(`✅ Automatic fallback deactivated for ${serviceName}`);
    } catch (error) {
      console.error('Error deactivating fallback:', error);
      alert('❌ Failed to deactivate fallback');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gemini Fallback Orchestration Hub
          </h1>
          <p className="text-gray-600">
            Intelligent service takeover with automatic fallback for disruptions and admin approval for cost/efficiency optimization
          </p>
        </div>

        {/* Gemini Readiness Status */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6 mb-6 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Gemini Readiness Status</h2>
              {geminiReadiness ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-bold text-green-600 capitalize">{geminiReadiness?.status}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Response Time</div>
                    <div className="text-lg font-bold text-gray-900">{geminiReadiness?.responseTime}ms</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Error Rate</div>
                    <div className="text-lg font-bold text-gray-900">{(geminiReadiness?.errorRate * 100)?.toFixed(2)}%</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Availability</div>
                    <div className="text-lg font-bold text-gray-900">{geminiReadiness?.availability}%</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Cost per Query</div>
                    <div className="text-lg font-bold text-gray-900">${geminiReadiness?.costPerQuery?.toFixed(4) ?? '0.0015'}</div>
                    <div className="text-xs text-green-600 mt-1">~40% vs OpenAI</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Loading readiness status...</p>
              )}
            </div>
          </div>
        </div>

        {/* Gemini Cost-Efficiency Analyzer */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-md p-6 mb-6 border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Gemini Cost-Efficiency Analyzer</h2>
              <p className="text-sm text-gray-600 mb-4">Compare AI provider costs and approve Gemini takeover for cost optimization</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="text-xs text-gray-600">Gemini Cost/1K</div>
                  <div className="text-lg font-bold text-amber-700">$0.0015</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="text-xs text-gray-600">OpenAI Cost/1K</div>
                  <div className="text-lg font-bold text-gray-700">$0.0025</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="text-xs text-gray-600">Savings Potential</div>
                  <div className="text-lg font-bold text-green-600">~40%</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="text-xs text-gray-600">Pending Cases</div>
                  <div className="text-lg font-bold text-blue-600">{manualRequests?.length ?? 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'manual' ?'border-blue-600 text-blue-600' :'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Manual Approval Required</span>
                  {manualRequests?.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {manualRequests?.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('automatic')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'automatic' ?'border-blue-600 text-blue-600' :'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>Automatic Fallbacks</span>
                  {automaticFallbacks?.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {automaticFallbacks?.length}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Manual Approval Tab */}
        {activeTab === 'manual' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Cost/Efficiency Optimization Requests</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              These requests require admin approval. Gemini has identified cost/efficiency issues and is requesting permission to take over tasks.
            </p>
            {manualRequests?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No pending manual approval requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {manualRequests?.map((request) => {
                  const caseReport = request?.case_report || {};
                  const costAnalysis = caseReport?.detailed_cost_analysis || {};
                  const savings = costAnalysis?.savings || {};

                  return (
                    <div
                      key={request?.id}
                      className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 hover:border-yellow-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-yellow-600" />
                            {request?.service_name} → Gemini Takeover Request
                          </h3>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(request?.created_at)?.toLocaleString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                          Pending Review
                        </span>
                      </div>

                      {/* Cost Savings Preview */}
                      {savings?.monthly_savings && (
                        <div className="bg-white rounded-lg p-4 mb-3 border border-yellow-200">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-gray-900">Potential Savings</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-xs text-gray-600">Monthly</div>
                              <div className="text-lg font-bold text-green-600">{savings?.monthly_savings}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Annual</div>
                              <div className="text-lg font-bold text-green-600">{savings?.annual_savings}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">Reduction</div>
                              <div className="text-lg font-bold text-green-600">{savings?.percentage_reduction}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedReport(request)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Review Full Analysis
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Automatic Fallbacks Tab */}
        {activeTab === 'automatic' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Active Automatic Fallbacks</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              These fallbacks were activated automatically due to service disruptions or API limitations. No admin approval was required.
            </p>
            {automaticFallbacks?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No active automatic fallbacks</p>
              </div>
            ) : (
              <div className="space-y-4">
                {automaticFallbacks?.map((fallback) => (
                  <div
                    key={fallback?.id}
                    className="border border-red-200 bg-red-50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          {fallback?.service_name} → Gemini (Automatic)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Activated: {new Date(fallback?.activated_at)?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Reason: {fallback?.activation_reason?.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        Active
                      </span>
                    </div>

                    {fallback?.performance_metrics && (
                      <div className="bg-white rounded-lg p-4 mb-3 border border-red-200">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-gray-600">Error Rate</div>
                            <div className="text-lg font-bold text-red-600">
                              {(fallback?.performance_metrics?.errorRate * 100)?.toFixed(2)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Response Time</div>
                            <div className="text-lg font-bold text-gray-900">
                              {fallback?.performance_metrics?.avgResponseTime}ms
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Accuracy</div>
                            <div className="text-lg font-bold text-gray-900">
                              {(fallback?.performance_metrics?.avgAccuracy * 100)?.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => deactivateAutomaticFallback(fallback?.id, fallback?.service_name)}
                      className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      Deactivate Fallback
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Approval Interface Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Admin Approval Interface</h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Executive Summary */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Summary</h3>
                  <p className="text-gray-700">
                    {selectedReport?.case_report?.executive_summary || 'No summary available'}
                  </p>
                </div>

                {/* Detailed Cost Analysis */}
                {selectedReport?.case_report?.detailed_cost_analysis && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cost-Benefit Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Current Service */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                          Current {selectedReport?.service_name} Costs
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Per 1K requests:</span>
                            <span className="font-semibold">
                              {selectedReport?.case_report?.detailed_cost_analysis?.current_service?.cost_per_1000_requests}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly cost:</span>
                            <span className="font-semibold">
                              {selectedReport?.case_report?.detailed_cost_analysis?.current_service?.monthly_cost}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Annual projection:</span>
                            <span className="font-semibold">
                              {selectedReport?.case_report?.detailed_cost_analysis?.current_service?.annual_projection}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Gemini Projection */}
                      <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Gemini Projection</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Per 1K requests:</span>
                            <span className="font-semibold text-green-600">
                              {selectedReport?.case_report?.detailed_cost_analysis?.gemini_projection?.cost_per_1000_requests}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly cost:</span>
                            <span className="font-semibold text-green-600">
                              {selectedReport?.case_report?.detailed_cost_analysis?.gemini_projection?.monthly_cost}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Annual projection:</span>
                            <span className="font-semibold text-green-600">
                              {selectedReport?.case_report?.detailed_cost_analysis?.gemini_projection?.annual_projection}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Savings */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Projected Savings</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-600">Monthly</div>
                          <div className="text-xl font-bold text-green-600">
                            {selectedReport?.case_report?.detailed_cost_analysis?.savings?.monthly_savings}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Annual</div>
                          <div className="text-xl font-bold text-green-600">
                            {selectedReport?.case_report?.detailed_cost_analysis?.savings?.annual_savings}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Reduction</div>
                          <div className="text-xl font-bold text-green-600">
                            {selectedReport?.case_report?.detailed_cost_analysis?.savings?.percentage_reduction}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Comparison */}
                {selectedReport?.case_report?.performance_comparison && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(selectedReport?.case_report?.performance_comparison)?.map(([key, value]) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 capitalize">{key?.replace(/_/g, ' ')}</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Current:</span>
                              <span className="font-semibold">{value?.current}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gemini:</span>
                              <span className="font-semibold text-blue-600">{value?.gemini}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Change:</span>
                              <span className="font-semibold text-green-600">{value?.improvement}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gemini's Justification */}
                {selectedReport?.case_report?.takeover_justification && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Takeover Justification</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {selectedReport?.case_report?.takeover_justification?.quantifiable_benefits && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Quantifiable Benefits:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {selectedReport?.case_report?.takeover_justification?.quantifiable_benefits?.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedReport?.case_report?.takeover_justification?.transition_plan && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Transition Plan:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                            {selectedReport?.case_report?.takeover_justification?.transition_plan?.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e?.target?.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any notes about your decision..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(selectedReport?.id)}
                    disabled={processing}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : '✅ Approve Takeover'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedReport?.id)}
                    disabled={processing}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : '❌ Reject Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiFallbackOrchestrationHub;