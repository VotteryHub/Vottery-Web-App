import React, { useState } from 'react';
import { Cpu, Database, RefreshCw, AlertTriangle } from 'lucide-react';

const MemoryPoolingEnginePanel = () => {
  const [poolStats, setPoolStats] = useState({
    objectsPooled: 1247,
    reuseRate: 87,
    gcCollections: 12,
    memoryLeaks: 0
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Memory Pooling Engine</h2>
        <p className="text-slate-400 mb-6">
          Object reuse statistics, garbage collection optimization, and memory leak detection
        </p>
      </div>

      {/* Pool Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-sm">Objects Pooled</span>
          </div>
          <div className="text-3xl font-bold text-white">{poolStats?.objectsPooled?.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Active in memory</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 text-green-400" />
            <span className="text-slate-400 text-sm">Reuse Rate</span>
          </div>
          <div className="text-3xl font-bold text-white">{poolStats?.reuseRate}%</div>
          <div className="text-xs text-green-400 mt-1">Excellent efficiency</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400 text-sm">GC Collections</span>
          </div>
          <div className="text-3xl font-bold text-white">{poolStats?.gcCollections}</div>
          <div className="text-xs text-slate-400 mt-1">Last hour</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-slate-400 text-sm">Memory Leaks</span>
          </div>
          <div className="text-3xl font-bold text-white">{poolStats?.memoryLeaks}</div>
          <div className="text-xs text-green-400 mt-1">None detected</div>
        </div>
      </div>

      {/* Object Pool Details */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Object Pool Details</h3>
        
        <div className="space-y-4">
          {[
            { name: 'Carousel Items', pooled: 450, active: 120, reuse: 92 },
            { name: '3D Meshes', pooled: 320, active: 85, reuse: 88 },
            { name: 'Textures', pooled: 280, active: 180, reuse: 75 },
            { name: 'Animation Frames', pooled: 197, active: 45, reuse: 95 }
          ]?.map((pool, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{pool?.name}</span>
                <span className="text-slate-400 text-sm">{pool?.pooled} pooled / {pool?.active} active</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(pool?.active / pool?.pooled) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Reuse Rate</span>
                <span className="text-green-400 font-semibold">{pool?.reuse}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Garbage Collection Optimization */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Garbage Collection Optimization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">GC Pause Time</div>
            <div className="text-2xl font-bold text-white mb-1">2.3ms</div>
            <div className="text-xs text-green-400">Minimal impact</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Memory Freed</div>
            <div className="text-2xl font-bold text-white mb-1">45.2 MB</div>
            <div className="text-xs text-slate-400">Last collection</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <RefreshCw className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <div className="text-green-400 font-medium mb-1">Automated Cleanup Active</div>
              <div className="text-sm text-slate-400">
                Memory pooling is automatically managing object lifecycle and preventing memory leaks
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Leak Detection */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Memory Leak Detection</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">Event Listeners</span>
            </div>
            <span className="text-green-400 text-sm font-semibold">Clean</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">DOM References</span>
            </div>
            <span className="text-green-400 text-sm font-semibold">Clean</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">Circular References</span>
            </div>
            <span className="text-green-400 text-sm font-semibold">Clean</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">Detached Nodes</span>
            </div>
            <span className="text-green-400 text-sm font-semibold">Clean</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryPoolingEnginePanel;