import React from 'react';
import { Zap, Layers, Image, Code } from 'lucide-react';

const RenderingBatchingPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Rendering Batching</h2>
        <p className="text-slate-400 mb-6">
          Draw call optimization, texture atlas management, and shader compilation caching
        </p>
      </div>

      {/* Batching Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400 text-sm">Draw Calls</span>
          </div>
          <div className="text-3xl font-bold text-white">120</div>
          <div className="text-xs text-green-400 mt-1">↓ 65% reduction</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-sm">Batched Objects</span>
          </div>
          <div className="text-3xl font-bold text-white">847</div>
          <div className="text-xs text-slate-400 mt-1">Per frame</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 text-sm">Texture Atlases</span>
          </div>
          <div className="text-3xl font-bold text-white">12</div>
          <div className="text-xs text-slate-400 mt-1">Active</div>
        </div>
      </div>

      {/* Draw Call Optimization */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Draw Call Optimization</h3>
        
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Static Geometry Batching</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ENABLED</span>
            </div>
            <div className="text-sm text-slate-400 mb-2">Combining static meshes into single draw calls</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Efficiency Gain</span>
              <span className="text-green-400 font-semibold">+45%</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Dynamic Batching</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ENABLED</span>
            </div>
            <div className="text-sm text-slate-400 mb-2">Real-time batching of moving objects</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Efficiency Gain</span>
              <span className="text-green-400 font-semibold">+32%</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Instanced Rendering</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ENABLED</span>
            </div>
            <div className="text-sm text-slate-400 mb-2">GPU instancing for repeated objects</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Efficiency Gain</span>
              <span className="text-green-400 font-semibold">+58%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Texture Atlas Management */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-purple-400" />
          Texture Atlas Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'UI Elements Atlas', size: '2048x2048', textures: 45, usage: 78 },
            { name: 'Carousel Items Atlas', size: '4096x4096', textures: 120, usage: 92 },
            { name: 'Effects Atlas', size: '1024x1024', textures: 28, usage: 65 },
            { name: 'Icons Atlas', size: '512x512', textures: 67, usage: 54 }
          ]?.map((atlas, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{atlas?.name}</span>
                <span className="text-xs text-slate-400">{atlas?.size}</span>
              </div>
              <div className="text-sm text-slate-400 mb-2">{atlas?.textures} textures packed</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
                <div 
                  className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${atlas?.usage}%` }}
                />
              </div>
              <div className="text-xs text-slate-400">{atlas?.usage}% utilized</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shader Compilation Caching */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-400" />
          Shader Compilation Caching
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Cached Shaders</div>
            <div className="text-2xl font-bold text-white">24</div>
            <div className="text-xs text-green-400 mt-1">Ready to use</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Cache Hit Rate</div>
            <div className="text-2xl font-bold text-white">96%</div>
            <div className="text-xs text-green-400 mt-1">Excellent</div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Compile Time Saved</div>
            <div className="text-2xl font-bold text-white">1.2s</div>
            <div className="text-xs text-slate-400 mt-1">Per load</div>
          </div>
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Code className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="text-blue-400 font-medium mb-1">Performance Impact Analysis</div>
              <div className="text-sm text-slate-400">
                Shader caching reduces initial load time by 85% and eliminates frame stuttering during runtime compilation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderingBatchingPanel;