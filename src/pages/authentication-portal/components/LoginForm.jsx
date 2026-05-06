import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = ({ onToggleRegister }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(formData?.email, formData?.password);
    if (error) {
      setErrors({ form: error?.message });
      setIsLoading(false);
    } else {
      navigate('/home-feed-dashboard');
    }
  };

  return (
    <div className="relative group/login-container">
      {/* 3D Login Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] p-6 md:p-10 transform transition-all duration-500 hover:scale-[1.01] relative z-10 border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Biometric Scanning Overlay (Subtle) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 animate-scanline pointer-events-none"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 relative">
            <Icon name="Fingerprint" size={32} className="text-primary animate-pulse" />
            <div className="absolute inset-0 border border-primary/20 rounded-2xl animate-ping opacity-20"></div>
          </div>
          <h3 className="text-primary text-2xl md:text-3xl font-black text-center uppercase tracking-[0.1em]">
            Citizen Authentication
          </h3>
          <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">Secured by Quantum-Shield-v2</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Universal Identifier</label>
            <Input
              type="email"
              name="email"
              placeholder="e.g. citizen@vottery.com"
              value={formData?.email}
              onChange={handleChange}
              className="!bg-slate-50/50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 !rounded-xl !py-4 focus:!border-primary focus:!ring-0 placeholder:text-slate-400 font-medium text-sm"
              required
            />
          </div>

          <div className="relative space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Key</label>
              <button type="button" className="text-[9px] font-bold text-primary hover:underline uppercase tracking-tighter">Emergency Recovery?</button>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData?.password}
                onChange={handleChange}
                className="!bg-slate-50/50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 !rounded-xl !py-4 focus:!border-primary focus:!ring-0 placeholder:text-slate-400 pr-12 font-medium text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} className="text-slate-400 hover:text-primary" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 py-1">
            <Checkbox
              label="Keep Session Persistent"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleChange}
              className="text-primary"
              labelClassName="!text-slate-600 dark:!text-slate-400 !font-bold !text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-[#FDC532] py-4 rounded-2xl text-xl font-black shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isLoading ? <Icon name="Loader" className="animate-spin" /> : (
                <>
                  <span>Initialize Access</span>
                  <Icon name="ArrowRight" size={20} />
                </>
              )}
            </button>
            
            {/* Technical Security Handshake - More Dynamic */}
            <div className="mt-4 flex flex-col items-center gap-1.5">
               <div className="flex items-center gap-2">
                 <span className="text-[9px] font-mono text-primary uppercase animate-pulse">Handshaking: 0x{Math.random().toString(16).slice(2, 6)}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                 <span className="text-[9px] font-mono text-slate-500 uppercase">Latency: 24ms</span>
               </div>
               <div className="w-full h-[2px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/40 w-1/3 animate-ping"></div>
               </div>
            </div>
          </div>
        </form>

        {/* Create New Account Section */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.1em]">AES-256 Protocol</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-widest">Cloud Verified</span>
              <Icon name="Cloud" size={14} className="text-primary" />
            </div>
          </div>

          <button
            onClick={onToggleRegister}
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm mb-8"
          >
            Create Citizen Profile
          </button>

          <div className="text-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Alternate Identity Ports</span>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            </div>
            <div className="flex items-center justify-center gap-6">
              {[
                { name: 'Google', icon: 'Chrome', color: 'text-[#DB4437]' },
                { name: 'Apple', icon: 'Apple', color: 'text-black dark:text-white' },
                { name: 'Passkey', icon: 'Fingerprint', color: 'text-primary' },
                { name: 'Github', icon: 'Github', color: 'text-slate-800 dark:text-slate-200' }
              ].map(provider => (
                <button key={provider.name} title={`Login with ${provider.name}`} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 border border-slate-100 dark:border-slate-700">
                  <Icon name={provider.icon} size={24} className={provider.color} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 3D Decorative Layers - Responsive Visibility */}
      <div className="absolute top-4 left-4 right-4 bottom-[-10px] bg-slate-100/40 dark:bg-slate-800/40 rounded-3xl -z-10 hidden sm:block"></div>
      <div className="absolute top-8 left-8 right-8 bottom-[-20px] bg-slate-200/20 dark:bg-slate-800/20 rounded-3xl -z-20 hidden sm:block"></div>
    </div>
  );
};

export default LoginForm;