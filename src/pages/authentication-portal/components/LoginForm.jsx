import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../../../services/authService';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const HCAPTCHA_SITE_KEY = import.meta.env?.VITE_HCAPTCHA_SITE_KEY;
  const hcaptchaEnabled = HCAPTCHA_SITE_KEY && HCAPTCHA_SITE_KEY !== 'your-hcaptcha-site-key-here';

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.emailOrUsername?.trim()) {
      newErrors.emailOrUsername = 'Email or username is required';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    // Require captcha if enabled
    if (hcaptchaEnabled && !captchaToken) {
      setErrors({ emailOrUsername: 'Please complete the captcha verification' });
      return;
    }
    
    setIsLoading(true);
    
    const { data, error } = await signIn(formData?.emailOrUsername, formData?.password);
    
    if (error) {
      setErrors({
        emailOrUsername: error?.message,
        password: error?.message
      });
      // Reset captcha on error
      captchaRef?.current?.resetCaptcha();
      setCaptchaToken(null);
      setIsLoading(false);
    } else {
      navigate('/home-feed-dashboard');
    }
  };

  const handleBiometricAuth = async () => {
    setBiometricLoading(true);
    const { error } = await authService.signInWithPasskey();
    if (!error) {
      navigate('/home-feed-dashboard');
      return;
    }
    setErrors((prev) => ({
      ...prev,
      emailOrUsername: error?.message || 'Passkey sign-in failed',
    }));
    setBiometricLoading(false);
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your registered email');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Email or Username"
          type="text"
          name="emailOrUsername"
          placeholder="Enter your email or username"
          value={formData?.emailOrUsername}
          onChange={handleChange}
          error={errors?.emailOrUsername}
          required
          disabled={isLoading}
        />
      </div>
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors duration-250"
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleChange}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-250"
          disabled={isLoading}
        >
          Forgot Password?
        </button>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        Sign In
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleBiometricAuth}
        loading={biometricLoading}
        iconName="Fingerprint"
        iconPosition="left"
        disabled={isLoading}
      >
        Biometric Authentication
      </Button>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          fullWidth
          iconName="Mail"
          iconPosition="left"
          disabled={isLoading}
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          fullWidth
          iconName="Facebook"
          iconPosition="left"
          disabled={isLoading}
        >
          Facebook
        </Button>
      </div>
      <div className="demo-credentials">
        <p>Demo Credentials:</p>
        <p>admin@vottery.com / admin123</p>
        <p>john.doe@vottery.com / SecurePass123!</p>
      </div>
      {/* hCaptcha */}
      {hcaptchaEnabled && (
        <div className="flex justify-center">
          <HCaptcha
            ref={captchaRef}
            sitekey={HCAPTCHA_SITE_KEY}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
            theme="dark"
          />
        </div>
      )}
    </form>
  );
};

export default LoginForm;