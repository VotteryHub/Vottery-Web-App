import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BrandingPanel from './components/BrandingPanel';
import Icon from '../../components/AppIcon';

const AuthenticationPortal = () => {
  const [activeTab, setActiveTab] = useState('login');

  const mockCredentials = {
    login: {
      email: 'john.doe@vottery.com',
      username: 'johndoe',
      password: 'SecurePass123!'
    }
  };

  return (
    <>
      <Helmet>
        <title>Authentication Portal - Vottery</title>
        <meta name="description" content="Sign in or create your Vottery account to participate in secure, blockchain-verified elections with gamified rewards" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <BrandingPanel />
            </div>

            <div className="order-1 lg:order-2">
              <div className="bg-card rounded-2xl md:rounded-3xl shadow-democratic-lg border border-border p-6 md:p-8 lg:p-10">
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`flex-1 py-2.5 md:py-3 px-4 rounded-lg text-sm md:text-base font-medium transition-all duration-250 ${
                        activeTab === 'login' ?'bg-card text-primary shadow-democratic-sm' :'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setActiveTab('register')}
                      className={`flex-1 py-2.5 md:py-3 px-4 rounded-lg text-sm md:text-base font-medium transition-all duration-250 ${
                        activeTab === 'register' ?'bg-card text-primary shadow-democratic-sm' :'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                </div>

                <div className="mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                    {activeTab === 'login' ? 'Welcome Back!' : 'Join Vottery'}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {activeTab === 'login' ?'Sign in to continue your democratic journey' :'Create your account and start participating in secure elections'}
                  </p>
                </div>

                {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Or</span>
                  <a href="/multi-authentication-gateway" className="text-sm text-primary font-medium hover:underline">
                    Sign in with MetaMask or WalletConnect →
                  </a>
                </div>

                {activeTab === 'login' && (
                  <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-foreground mb-1">
                          Demo Credentials
                        </p>
                        <div className="space-y-1 text-xs md:text-sm text-muted-foreground font-data">
                          <p>Email: {mockCredentials?.login?.email}</p>
                          <p>Username: {mockCredentials?.login?.username}</p>
                          <p>Password: {mockCredentials?.login?.password}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs md:text-sm text-muted-foreground">
                  By continuing, you agree to Vottery's{' '}
                  <button className="text-primary hover:text-primary/80 font-medium">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button className="text-primary hover:text-primary/80 font-medium">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-50">
          <button className="w-12 h-12 md:w-14 md:h-14 bg-primary text-primary-foreground rounded-full shadow-democratic-lg hover:scale-105 transition-all duration-250 flex items-center justify-center">
            <Icon name="HelpCircle" size={24} className="md:w-7 md:h-7" />
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthenticationPortal;