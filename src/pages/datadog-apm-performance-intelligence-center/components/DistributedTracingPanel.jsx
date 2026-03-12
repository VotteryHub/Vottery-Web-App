import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import { datadogAPMService } from "../../../services/datadogAPMService";

const DistributedTracingPanel = ({ slowTransactions, selectedEndpoint }) => {
    const [selectedTrace, setSelectedTrace] = useState(null);
    const [traceDetails, setTraceDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadTraceDetails = async (traceId) => {
        setLoading(true);
        try {
            const { data, error } = await datadogAPMService?.getDistributedTracing(traceId);
            if (error) throw error;
            setTraceDetails(data);
        } catch (error) {
            console.error("Error loading trace details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (statusCode) => {
        if (statusCode >= 500) return "text-red-600 dark:text-red-400";
        if (statusCode >= 400) return "text-orange-600 dark:text-orange-400";
        return "text-green-600 dark:text-green-400";
    };

    return (
        <div className="space-y-6">
            {/* Overview */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Icon name="GitBranch" size={20} />
                    Distributed Tracing for Slow Transactions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    End-to-end transaction flows with service dependency mapping and performance breakdowns
                </p>
            </div>

            {/* Slow Transactions List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Slow Transactions (&gt; 3s)
                </h3>
                <div className="space-y-3">
                    {slowTransactions?.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                            No slow transactions detected
                        </p>
                    ) : (
                        slowTransactions?.map((transaction, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedTrace(transaction);
                                    loadTraceDetails(transaction?.traceId);
                                }}
                                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-all"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {transaction?.endpoint}
                                    </span>
                                    <span
                                        className={`text-sm font-semibold ${getStatusColor(transaction?.statusCode)}`}
                                    >
                                        {transaction?.statusCode}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Icon name="Clock" size={12} />
                                        {transaction?.responseTime}ms
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Icon name="Hash" size={12} />
                                        {transaction?.traceId}
                                    </span>
                                    <span>{new Date(transaction?.timestamp)?.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Trace Details */}
            {selectedTrace && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Icon name="Search" size={20} />
                        Trace Details: {selectedTrace?.traceId}
                    </h3>
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : traceDetails ? (
                        <div className="space-y-4">
                            {/* Trace Summary */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Duration</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {traceDetails?.totalDuration}ms
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Span Count</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {traceDetails?.spanCount}
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Errors</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {traceDetails?.errorCount}
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Services</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {new Set(traceDetails?.spans?.map((s) => s?.endpoint))?.size}
                                    </div>
                                </div>
                            </div>

                            {/* Span Timeline */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    Span Timeline:
                                </h4>
                                {traceDetails?.spans?.map((span, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-32 text-xs text-gray-600 dark:text-gray-400">
                                            {span?.endpoint?.replace("/api/", "")}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-6 bg-primary rounded"
                                                    style={{
                                                        width: `${(span?.responseTime / traceDetails?.totalDuration) * 100}%`,
                                                    }}
                                                />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {span?.responseTime}ms
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                            Select a transaction to view trace details
                        </p>
                    )}
                </div>
            )}

            {/* Service Dependency Mapping */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Icon name="Network" size={20} />
                    Service Dependency Mapping
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Icon name="Server" size={16} className="text-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">API Gateway</span>
                        <Icon name="ArrowRight" size={16} className="text-gray-400" />
                        <Icon name="Database" size={16} className="text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Supabase</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Icon name="Server" size={16} className="text-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">API Gateway</span>
                        <Icon name="ArrowRight" size={16} className="text-gray-400" />
                        <Icon name="Zap" size={16} className="text-purple-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">External APIs</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistributedTracingPanel;
