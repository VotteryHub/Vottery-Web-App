import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BrandingPanel from './components/BrandingPanel';
import Icon from '../../components/AppIcon';

const AuthenticationPortal = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [language, setLanguage] = useState('English (US)');

  useEffect(() => {
    if (!loading && user) {
      navigate('/home-feed-dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#0766D4] animate-pulse font-black uppercase tracking-widest">
        Initializing Secure Arena...
      </div>
    );
  }

  const userActivity = [
    { user: 'User A', action: 'Predicted right!', icon: 'TrendingUp' },
    { user: 'User B', action: 'Sparked a ballot!', icon: 'Zap' },
    { user: 'User C', action: 'Won a Jolt reward!', icon: 'Trophy' }
  ];

  return (
    <>
      <Helmet>
        <title>Vottery - Join the World's First Gamified Democratic Community</title>
        <meta name="description" content="Discover Vottery: The Social Network for Collective Choice and Connection. Join the revolution of secure, gamified blockchain elections." />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-slate-950 relative flex flex-col font-sans selection:bg-[#FDC532] selection:text-[#0766D4] overflow-hidden">
        
        {/* Top Navigation / Logo */}
        <header className="absolute top-0 left-0 right-0 p-4 md:p-8 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <img
                src="/assets/images/Adobe_Express_-_file-1769630175687.png"
                alt="Vottery Logo"
                className="h-10 md:h-16 w-auto object-contain"
              />
            </Link>

            {/* Technical Status Indicator - Hidden on very small screens */}
            <div className="hidden lg:flex items-center gap-6 px-6 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Node: Active</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Icon name="ShieldCheck" size={14} className="text-[#0766D4]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">E2EE Verified</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Icon name="Activity" size={14} className="text-[#FDC532]" />
                <span className="text-[10px] font-mono font-bold tracking-tighter">BLOCK_#8,421,092</span>
              </div>
            </div>
            
            {/* Mobile Status Mini */}
            <div className="lg:hidden flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
          {/* Advanced Technical Overlays */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Dynamic Grid */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
                 style={{ backgroundImage: 'linear-gradient(#0766D4 1px, transparent 1px), linear-gradient(90deg, #0766D4 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Technical Labels */}
            <div className="absolute top-1/4 left-10 text-[9px] font-mono text-[#0766D4] opacity-40 hidden xl:block uppercase vertical-text">
              Auth_Kernel_v2.1 // System_Ready
            </div>
            <div className="absolute bottom-1/4 right-10 text-[9px] font-mono text-[#0766D4] opacity-40 hidden xl:block uppercase vertical-text">
              Encryption_Layer: AES_256_GCM
            </div>

            {/* Rotating Data Rings (Visual only) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#0766D4]/5 rounded-full animate-spin-slow hidden lg:block"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dashed border-[#0766D4]/10 rounded-full animate-reverse-spin hidden lg:block"></div>
          </div>          

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col lg:grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-24 items-center">
              
              {/* Left Column: Hierarchical Messaging & Technical Logs */}
              <div className="w-full order-2 lg:order-1">
                <BrandingPanel />
                
                {/* Live Console Logs (The "More Technical" Part) */}
                <div className="mt-12 hidden lg:block max-w-xl">
                  <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 font-mono text-[11px] relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                      </div>
                      <span className="text-slate-500 uppercase tracking-widest text-[9px]">Vottery_Core_Console</span>
                    </div>
                    <div className="space-y-2.5">
                      <p className="text-emerald-400 flex gap-3">
                        <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                        <span className="font-bold text-slate-400">SYS:</span> 
                        Node connection established to mainnet_alpha_01
                      </p>
                      <p className="text-slate-300 flex gap-3">
                        <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                        <span className="font-bold text-blue-400">P2P:</span> 
                        Peer handshaking... 128 active nodes detected
                      </p>
                      <p className="text-slate-300 flex gap-3">
                        <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                        <span className="font-bold text-amber-400">SEC:</span> 
                        Quantum-resistant key exchange initialized
                      </p>
                      <p className="text-slate-500 flex gap-3 animate-pulse">
                        <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                        <span className="font-bold text-slate-600">LGR:</span> 
                        Syncing block #8,421,092... [99.9%]
                      </p>
                    </div>
                    
                    {/* Glowing Scan Line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-emerald-500/20 shadow-[0_0_15px_#10b981] animate-scanline"></div>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Auth Card */}
              <div className="w-full max-w-[480px] mx-auto order-1 lg:order-2 relative group/card">
                <div className="relative">
                  {activeTab === 'login' ? (
                    <LoginForm onToggleRegister={() => setActiveTab('register')} />
                  ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.25)] p-6 md:p-10 border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                       <h3 className="text-[#0766D4] text-xl font-black text-center mb-8 uppercase tracking-[0.2em]">Initial Handshake</h3>
                       <RegisterForm onToggleLogin={() => setActiveTab('login')} />
                    </div>
                  )}

                  {/* Language Setting Component - Responsive positioning */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-full ml-10 hidden xl:block">
                    <div className="relative group">
                      <button className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-500 hover:text-primary transition-all whitespace-nowrap uppercase tracking-widest">
                        {language}
                        <Icon name="ChevronDown" size={14} />
                      </button>
                      <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                        {['English (US)', 'Deutsch', 'Français', 'Español', 'Türkçe', 'Polski'].map(lang => (
                          <button 
                            key={lang} 
                            onClick={() => setLanguage(lang)}
                            className="w-full text-left px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors"
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-Time Hook Boxes - Better responsiveness */}
                <div className="mt-8 md:mt-12 flex flex-wrap gap-3 md:gap-4 justify-center">
                  {userActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/50 rounded-full border border-slate-50 dark:border-slate-800 hover:scale-105 transition-transform cursor-default relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0766D4]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative z-10 shadow-inner">
                        <Icon name={activity.icon} size={14} className="text-primary" />
                      </div>
                      <div className="text-left relative z-10">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 leading-none">@{activity.user}</p>
                          <span className="text-[8px] font-mono text-slate-400 opacity-50">0x{Math.random().toString(16).slice(2, 8)}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-none mt-1">{activity.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Real-Time Live Feed Ribbon */}
        <section className="bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800 py-4 overflow-hidden relative group">
          <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center gap-8 px-8">
                <div className="flex items-center gap-3">
                  <Icon name="Zap" size={18} className="text-[#FDC532]" />
                  <span className="text-xs font-black text-primary uppercase tracking-widest">LIVE EVENT:</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Crypto Climate Ballot Closes in 02:14:45</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                <div className="flex items-center gap-3">
                  <Icon name="Trophy" size={16} className="text-[#FDC532]" />
                  <span className="text-xs font-black text-[#FDC532] uppercase tracking-widest">GLOBAL JACKPOT:</span>
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">€4,500,321.40</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">LATEST WIN:</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">@CitizenX triggered a Jolt Bounty in #Elections</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Area - Enhanced Responsiveness */}
        <footer className="bg-white dark:bg-slate-950 py-12 md:py-20 border-t border-slate-50 dark:border-slate-900">
          <div className="container mx-auto px-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-[#FDC532] shadow-2xl shadow-primary/40 border-b-4 border-black/20">
                <Icon name="Vote" size={36} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-primary tracking-tighter uppercase leading-none">Vottery</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EST. 2026</p>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <p className="text-[10px] font-mono text-slate-400">BUILD_v2.4.1_PROD</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-6">
              {['About', 'Creators', 'Community', 'Help', 'Imprint'].map(link => (
                <Link 
                  key={link} 
                  to={`/${link.toLowerCase()}`} 
                  className="text-[11px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.25em] transition-all hover:-translate-y-0.5"
                >
                  {link}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center gap-6">
               <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Icon name="Twitter" size={20} /></button>
               <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Icon name="Github" size={20} /></button>
               <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Icon name="MessageSquare" size={20} /></button>
            </div>
          </div>
        </footer>

        {/* Custom Animation Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scanline {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(600px); opacity: 0; }
          }
          .animate-marquee {
            display: flex;
            width: fit-content;
            animation: marquee 50s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          .animate-scanline {
            animation: scanline 8s linear infinite;
          }
          .animate-spin-slow {
            animation: spin 60s linear infinite;
          }
          .animate-reverse-spin {
            animation: spin 45s linear reverse infinite;
          }
          .vertical-text {
            writing-mode: vertical-rl;
          }
        `}} />
      </div>
    </>
  );
};

export default AuthenticationPortal;