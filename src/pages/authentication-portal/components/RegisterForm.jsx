import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef } from 'react';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const HCAPTCHA_SITE_KEY = import.meta.env?.VITE_HCAPTCHA_SITE_KEY;
  const hcaptchaEnabled = HCAPTCHA_SITE_KEY && HCAPTCHA_SITE_KEY !== 'your-hcaptcha-site-key-here';

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password?.length >= 8) score++;
    if (password?.length >= 12) score++;
    if (/[a-z]/?.test(password) && /[A-Z]/?.test(password)) score++;
    if (/\d/?.test(password)) score++;
    if (/[^a-zA-Z0-9]/?.test(password)) score++;

    const strengthLevels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Very Weak', color: 'bg-destructive' },
      { score: 2, label: 'Weak', color: 'bg-warning' },
      { score: 3, label: 'Fair', color: 'bg-accent' },
      { score: 4, label: 'Strong', color: 'bg-success' },
      { score: 5, label: 'Very Strong', color: 'bg-success' }
    ];

    setPasswordStrength(strengthLevels?.[score]);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength?.score < 3) {
      newErrors.password = 'Please choose a stronger password';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    if (hcaptchaEnabled && !captchaToken) {
      setErrors(prev => ({ ...prev, general: 'Please complete the captcha verification' }));
      return;
    }
    setIsLoading(true);
    
    const { data, error } = await signUp(
      formData?.email,
      formData?.password,
      {
        fullName: formData?.fullName,
        username: formData?.email?.split('@')?.[0]
      }
    );
    
    if (error) {
      captchaRef?.current?.resetCaptcha();
      setCaptchaToken(null);
      setErrors({ submit: error?.message });
      setIsLoading(false);
    } else {
      // Redirect to onboarding wizard for new users
      navigate('/interactive-onboarding-wizard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleChange}
          error={errors?.fullName}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />
      </div>
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Create a strong password"
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
        
        {formData?.password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5]?.map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all duration-250 ${
                    level <= passwordStrength?.score ? passwordStrength?.color : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            {passwordStrength?.label && (
              <p className="text-xs text-muted-foreground">
                Password strength: <span className="font-medium">{passwordStrength?.label}</span>
              </p>
            )}
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData?.confirmPassword}
          onChange={handleChange}
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors duration-250"
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>
      <div>
        <Checkbox
          label={
            <span className="text-sm">
              I agree to the{' '}
              <button
                type="button"
                className="text-primary hover:text-primary/80 font-medium"
                onClick={(e) => {
                  e?.preventDefault();
                  alert('Terms and Conditions would open in a modal');
                }}
              >
                Terms and Conditions
              </button>
              {' '}and{' '}
              <button
                type="button"
                className="text-primary hover:text-primary/80 font-medium"
                onClick={(e) => {
                  e?.preventDefault();
                  alert('Privacy Policy would open in a modal');
                }}
              >
                Privacy Policy
              </button>
            </span>
          }
          name="agreeToTerms"
          checked={formData?.agreeToTerms}
          onChange={handleChange}
          error={errors?.agreeToTerms}
          required
          disabled={isLoading}
        />
      </div>
      {errors?.submit && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{errors?.submit}</p>
        </div>
      )}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="right"
      >
        Create Account
      </Button>
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex items-start gap-2">
          <Icon name="Shield" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-foreground">
            Your cryptographic keys will be automatically generated upon registration for secure voting and blockchain verification.
          </p>
        </div>
      </div>
      {/* hCaptcha */}
      {hcaptchaEnabled && (
        <div className="flex justify-center my-2">
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

export default RegisterForm;