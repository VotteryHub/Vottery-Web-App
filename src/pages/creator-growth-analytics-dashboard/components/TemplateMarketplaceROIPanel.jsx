import React from 'react';
import { ShoppingBag, Download, Star, Package } from 'lucide-react';

export default function TemplateMarketplaceROIPanel({ marketplaceData, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          <div className="h-40 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  const data = marketplaceData || {};

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-purple-400" />
          Template Marketplace ROI
        </h2>
        <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full">{data?.monthlyGrowth} this month</span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">${data?.totalRevenue?.toLocaleString() || '0'}</div>
          <div className="text-xs text-slate-400 mt-1">Total Revenue</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{data?.totalDownloads || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Total Downloads</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{data?.activeTemplates || 0}</div>
          <div className="text-xs text-slate-400 mt-1">Active Templates</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">#{data?.marketplaceRank || 'N/A'}</div>
          <div className="text-xs text-slate-400 mt-1">Marketplace Rank</div>
        </div>
      </div>

      {/* Template List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Top Performing Templates</h3>
        {data?.templates?.slice(0, 5)?.map((template, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-900/40 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white truncate max-w-[140px]">{template?.name || `Template ${idx + 1}`}</div>
                <div className="text-xs text-slate-500">{template?.type}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-emerald-400">${template?.revenue?.toFixed(2) || '0'}</div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Download className="w-3 h-3" />
                <span>{template?.downloads || 0}</span>
                <Star className="w-3 h-3 text-yellow-400 ml-1" />
                <span className="text-yellow-400">{template?.rating || 4.5}</span>
              </div>
            </div>
          </div>
        ))}
        {(!data?.templates || data?.templates?.length === 0) && (
          <div className="text-center py-6 text-slate-500">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No templates published yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
