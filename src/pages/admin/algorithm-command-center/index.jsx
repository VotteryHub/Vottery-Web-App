import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import Icon from '../../../components/AppIcon';
import HeaderNavigation from '../../../components/ui/HeaderNavigation';
import Button from '../../../components/ui/Button';
import { feedRankingService } from '../../../services/feedRankingService';
import { geminiChatService } from '../../../services/geminiChatService';

// --- 3D Globe Component ---
const GlobeHeatmap = () => {
  const globeRef = useRef();
  const [dataPoints] = useState(() => 
    Array.from({ length: 20 }, () => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ],
      color: Math.random() > 0.7 ? '#ff00ff' : '#00ffff'
    }))
  );

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#1a1a2e"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.5}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </Sphere>
      {dataPoints.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
      <OrbitControls enableZoom={false} autoRotate />
    </group>
  );
};

// --- Main Page ---
const AlgorithmCommandCenter = () => {
  const [directives, setDirectives] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tuning, setTuning] = useState({
    viq_amplification: 1.2,
    reach_penalty_cp: 0.8,
    discovery_split: 30, // 30% discovery, 70% personalization
    weekly_budget_cap_usd: 5000,
    efficiency_mode: true
  });

  const handleTerminalSubmit = async (e) => {
    if (e.key === 'Enter' && terminalInput.trim()) {
      setIsProcessing(true);
      const command = terminalInput;
      setTerminalInput('');
      
      try {
        // Use Gemini to parse directive to JSON
        const response = await geminiChatService.parseAlgorithmicDirective(command);
        if (response.success) {
          const newDirective = {
            id: Date.now(),
            text: command,
            timestamp: new Date().toLocaleTimeString(),
            parsed: response.data
          };
          setDirectives([newDirective, ...directives]);
          // Apply changes to tuning state if applicable
          if (response.data.updates) {
            setTuning(prev => ({ ...prev, ...response.data.updates }));
          }
        }
      } catch (err) {
        console.error('Directive parsing failed', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#05050a] text-white selection:bg-primary/30">
      <Helmet>
        <title>Algorithm Command Center | Vottery V1</title>
      </Helmet>
      <HeaderNavigation />

      <main className="container mx-auto px-4 py-8">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-black bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
              ALGORITHM COMMAND CENTER
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
              V1 Core Infrastructure // Merit Control // Commercial Neutrality
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              Logic Audit Logs
            </Button>
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Deploy Changes
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Quadrant 1: Feed Merit Distribution */}
          <div className="lg:col-span-6">
            <QuadrantCard title="FEED MERIT DISTRIBUTION" icon="Target">
              <div className="flex gap-8 items-center h-[200px]">
                {/* Visual Representation of Algorithm Formula */}
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Personalized (vIQ) */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0F5FFF" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * (tuning.discovery_split / 100)} />
                    {/* Discovery */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#FFC629" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset={251.2 * ((100 - tuning.discovery_split) / 100)} className="opacity-80" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-black">{100 - tuning.discovery_split}%</span>
                    <span className="text-[8px] text-muted-foreground uppercase">Merit</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <SliderField 
                    label="vIQ Weight (A)" 
                    value={tuning.viq_amplification} 
                    min={0.5} max={2.5} step={0.1}
                    onChange={(v) => setTuning({...tuning, viq_amplification: v})}
                  />
                  <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-muted-foreground uppercase">Reach Penalty (Cp)</span>
                    <span className="font-bold text-vottery-yellow">{tuning.reach_penalty_cp}</span>
                  </div>
                </div>
              </div>
            </QuadrantCard>
          </div>

          {/* Quadrant 2: Reach Penalty Controls */}
          <div className="lg:col-span-6">
            <QuadrantCard title="REACH PENALTY CONTROLS" icon="Activity">
              <div className="space-y-6 py-2">
                <SliderField 
                  label="Network Neutrality Offset" 
                  value={tuning.reach_penalty_cp} 
                  min={0} max={1} step={0.05}
                  onChange={(v) => setTuning({...tuning, reach_penalty_cp: v})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">Bot Suppression</div>
                    <div className="text-lg font-black text-green-500">99.8%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">Reach Efficiency</div>
                    <div className="text-lg font-black text-vottery-blue">1.4x</div>
                  </div>
                </div>
              </div>
            </QuadrantCard>
          </div>

          {/* Quadrant 3: Global Ad Management */}
          <div className="lg:col-span-6">
            <QuadrantCard title="GLOBAL AD MANAGEMENT" icon="Megaphone">
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-sm font-bold">Monetization Engine</div>
                    <div className="text-xs text-muted-foreground">Toggle all feed-injected ad slots</div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-green-500 p-1 flex justify-end transition-all">
                    <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-sm font-bold">CPM Cap Enforcement</div>
                    <div className="text-xs text-muted-foreground">Limit ad frequency to 1:10 posts</div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-vottery-blue p-1 flex justify-end transition-all">
                    <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            </QuadrantCard>
          </div>

          {/* Quadrant 4: Real-time Logic Audit */}
          <div className="lg:col-span-6">
            <QuadrantCard title="LOGIC AUDIT FLOW" icon="Shield">
              <div className="font-mono text-[10px] space-y-2 h-[160px] overflow-y-auto custom-scrollbar bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="text-primary">[SYSTEM] Initializing Constitutional Middleware v1.0.4</div>
                <div className="text-green-500">[AUDIT] Merit normalization check passed for Cluster 7</div>
                <div className="text-white/40">[CACHE] Hydrating feed ranking weights for user sessions</div>
                <div className="text-vottery-yellow">[WARN] CPM fluctuation detected in UK-South region</div>
                <div className="text-primary">[INFO] Reach Penalty Cp=0.85 applied globally</div>
              </div>
            </QuadrantCard>
          </div>
        </div>

        {/* Directive Terminal (Bottom) */}
        <div className="mt-12">
          <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Icon name="Terminal" size={20} />
              <h2 className="text-sm font-bold tracking-widest uppercase">Directive Terminal</h2>
            </div>
            <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus-within:border-primary/50 transition-all">
              <span className="text-primary font-bold">$</span>
              <input 
                type="text" 
                className="flex-1 bg-transparent border-none outline-none text-sm font-mono placeholder:text-white/20"
                placeholder="Type algorithmic directive (e.g., 'Increase vIQ weights for consensus by 10%')..."
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalSubmit}
                disabled={isProcessing}
              />
              {isProcessing && <Icon name="Loader2" size={16} className="animate-spin text-primary" />}
            </div>
            {directives.length > 0 && (
              <div className="mt-4 space-y-3">
                {directives.map(d => (
                  <div key={d.id} className="p-3 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] font-mono text-muted-foreground">{d.timestamp}</span>
                      <span className="text-xs font-mono">{d.text}</span>
                    </div>
                    <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Applied</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .bg-radial-gradient {
          background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
};

const QuadrantCard = ({ title, icon, children }) => (
  <div className="bg-card/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group shadow-lg">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon name={icon} size={18} />
      </div>
      <h2 className="text-sm font-bold tracking-widest uppercase text-white/90">{title}</h2>
    </div>
    {children}
  </div>
);

const SliderField = ({ label, value, min, max, step, onChange }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
    <input 
      type="range" 
      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
      min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export default AlgorithmCommandCenter;
