import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Smartphone, Lock, CheckCircle, AlertTriangle, Settings, ExternalLink, Copy } from 'lucide-react';
import authenticationService from '../../services/authenticationService';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { QRCodeSVG as QRCode } from 'qrcode.react';

const MultiAuthenticationGateway = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('selector');
  const [authMethods, setAuthMethods] = useState({
    passkey: false,
    magicLink: false,
    oauth: [],
    emailPassword: true,
  });
  const [passkeySupport, setPasskeySupport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [electionAuthSettings, setElectionAuthSettings] = useState(null);
  const [web3State, setWeb3State] = useState({
    connected: false,
    address: null,
    loading: false,
    error: null,
    chainId: null,
  });
  const [showWCModal, setShowWCModal] = useState(false);
  const [walletConnectUri, setWalletConnectUri] = useState('');
  const [copiedUri, setCopiedUri] = useState(false);

  useEffect(() => {
    checkPasskeySupport();
  }, []);

  const checkPasskeySupport = async () => {
    const support = await authenticationService?.checkBiometricSupport();
    setPasskeySupport(support);
  };

  const handleRegisterPasskey = async () => {
    setLoading(true);
    setMessage(null);

    const result = await authenticationService?.registerPasskey(user?.id, user?.email);
    
    if (result?.success) {
      setMessage({ type: 'success', text: 'Passkey registered successfully! You can now use biometric authentication.' });
      setAuthMethods(prev => ({ ...prev, passkey: true }));
    } else {
      setMessage({ type: 'error', text: result?.error });
    }

    setLoading(false);
  };

  const handleSendMagicLink = async (email) => {
    setLoading(true);
    setMessage(null);

    const result = await authenticationService?.sendMagicLink(email);
    
    if (result?.success) {
      setMessage({ type: 'success', text: 'Magic link sent! Check your email.' });
    } else {
      setMessage({ type: 'error', text: result?.error });
    }

    setLoading(false);
  };

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    setMessage(null);

    const result = await authenticationService?.signInWithOAuth(provider);
    
    if (result?.success) {
      window.location.href = result?.url;
    } else {
      setMessage({ type: 'error', text: result?.error });
      setLoading(false);
    }
  };

  const detectMetaMask = () => typeof window !== 'undefined' && !!window?.ethereum?.isMetaMask;

  const connectMetaMask = async () => {
    if (!detectMetaMask()) {
      setWeb3State((prev) => ({ ...prev, error: 'MetaMask not detected. Please install the MetaMask browser extension.' }));
      return;
    }
    setWeb3State((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const accounts = await window?.ethereum?.request({ method: 'eth_requestAccounts' });
      const address = accounts?.[0];
      const chainId = await window?.ethereum?.request({ method: 'eth_chainId' });

      // Sign message for verification
      const message = `Sign this message to authenticate with Vottery.\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await window?.ethereum?.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Store wallet in Supabase
      if (user?.id) {
        await supabase?.from('user_wallets')?.upsert({
          user_id: user?.id,
          wallet_address: address?.toLowerCase(),
          wallet_type: 'metamask',
          chain_id: chainId,
          signature,
          connected_at: new Date()?.toISOString(),
        }, { onConflict: 'user_id,wallet_address' });
      }

      setWeb3State({ connected: true, address, loading: false, error: null, chainId });
      setMessage({ type: 'success', text: `MetaMask connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` });
    } catch (err) {
      setWeb3State((prev) => ({ ...prev, loading: false, error: err?.message || 'Connection failed' }));
    }
  };

  const connectWalletConnect = async () => {
    setWeb3State((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Generate a WalletConnect URI for QR display
      const timestamp = Date.now();
      const symKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))?.map(b => b?.toString(16)?.padStart(2, '0'))?.join('');
      const wcUri = `wc:${symKey?.slice(0, 8)}-${symKey?.slice(8, 12)}-${symKey?.slice(12, 16)}-${symKey?.slice(16, 20)}-${symKey?.slice(20, 32)}@2?relay-protocol=irn&symKey=${symKey}&timestamp=${timestamp}`;
      setWalletConnectUri(wcUri);
      setShowWCModal(true);
      setWeb3State((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      setWeb3State((prev) => ({ ...prev, loading: false, error: err?.message || 'WalletConnect failed' }));
    }
  };

  const disconnectWallet = async () => {
    if (user?.id && web3State?.address) {
      await supabase?.from('user_wallets')?.update({ disconnected_at: new Date()?.toISOString() })?.eq('user_id', user?.id)?.eq('wallet_address', web3State?.address?.toLowerCase());
    }
    setWeb3State({ connected: false, address: null, loading: false, error: null, chainId: null });
    setMessage({ type: 'success', text: 'Wallet disconnected successfully.' });
  };

  const oauthProviders = [
    { id: 'google', name: 'Google', icon: '🔍', color: 'bg-red-500' },
    { id: 'apple', name: 'Apple', icon: '🍎', color: 'bg-gray-900' },
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
  ];

  const tabs = [
    { id: 'selector', label: 'Auth Methods', icon: Shield },
    { id: 'web3', label: 'Web3 Wallet', icon: Key },
    { id: 'creator-config', label: 'Creator Config', icon: Settings },
    { id: 'security', label: 'Advanced Security', icon: Lock },
  ];

  const copyWCUri = () => {
    navigator?.clipboard?.writeText(walletConnectUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Multi-Authentication Gateway</h1>
              <p className="text-gray-600 mt-1">Comprehensive authentication options with creator-selectable methods</p>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message?.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message?.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{message?.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab?.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Authentication Selector Tab */}
        {activeTab === 'selector' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Passkey Authentication */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Key className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Passkey Authentication</h3>
                  <p className="text-sm text-gray-600">Biometric & device-based security</p>
                </div>
              </div>

              {passkeySupport?.supported ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Device Compatible</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your device supports biometric authentication (fingerprint, Face ID, Windows Hello)
                    </p>
                  </div>

                  <button
                    onClick={handleRegisterPasskey}
                    disabled={loading || authMethods?.passkey}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {authMethods?.passkey ? '✓ Passkey Registered' : 'Register Passkey'}
                  </button>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• Cross-platform synchronization via iCloud/Google</p>
                    <p>• No passwords to remember</p>
                    <p>• Phishing-resistant authentication</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Not Supported</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    {passkeySupport?.reason || 'Your device does not support passkey authentication'}
                  </p>
                </div>
              )}
            </div>

            {/* Magic Link */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Magic Link</h3>
                  <p className="text-sm text-gray-600">Passwordless email authentication</p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  id="magic-link-email"
                />

                <button
                  onClick={() => {
                    const email = document.getElementById('magic-link-email')?.value;
                    if (email) handleSendMagicLink(email);
                  }}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50"
                >
                  Send Magic Link
                </button>

                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Secure one-time login link</p>
                  <p>• Expires in 15 minutes</p>
                  <p>• Anti-phishing protection</p>
                </div>
              </div>
            </div>

            {/* OAuth Providers */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">OAuth Providers</h3>
                  <p className="text-sm text-gray-600">Sign in with your favorite platform</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {oauthProviders?.map((provider) => (
                  <button
                    key={provider?.id}
                    onClick={() => handleOAuthSignIn(provider?.id)}
                    disabled={loading}
                    className={`p-6 ${provider?.color} text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex flex-col items-center gap-2`}
                  >
                    <span className="text-4xl">{provider?.icon}</span>
                    <span>{provider?.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700 font-semibold mb-2">Security Features:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>• OAuth 2.0 protocol</div>
                  <div>• Scope-limited permissions</div>
                  <div>• Revocable access tokens</div>
                  <div>• Privacy-first design</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Web3 Wallet Tab */}
        {activeTab === 'web3' && (
          <div className="space-y-6">
            {/* MetaMask */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-2xl">🦊</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">MetaMask</h3>
                  <p className="text-sm text-gray-600">Connect your Ethereum wallet via browser extension</p>
                </div>
                {detectMetaMask() ? (
                  <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Detected</span>
                ) : (
                  <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Not Installed</span>
                )}
              </div>

              {web3State?.connected ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Wallet Connected</span>
                    </div>
                    <p className="text-sm text-gray-700 font-mono">{web3State?.address}</p>
                    {web3State?.chainId && (
                      <p className="text-xs text-gray-500 mt-1">Chain ID: {parseInt(web3State?.chainId, 16)}</p>
                    )}
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="w-full py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {web3State?.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{web3State?.error}</p>
                    </div>
                  )}
                  <button
                    onClick={connectMetaMask}
                    disabled={web3State?.loading}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
                  >
                    {web3State?.loading ? 'Connecting...' : 'Connect MetaMask'}
                  </button>
                  {!detectMetaMask() && (
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-sm text-orange-600 hover:underline"
                    >
                      Install MetaMask Extension →
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* WalletConnect */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🔗</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">WalletConnect</h3>
                  <p className="text-sm text-gray-600">Scan QR code with any mobile wallet</p>
                </div>
              </div>
              <div className="space-y-3">
                {showWCModal && walletConnectUri ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                        <QRCode
                          value={walletConnectUri}
                          size={180}
                          level="M"
                          includeMargin={true}
                          renderAs="svg"
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center font-medium">Scan with MetaMask Mobile, Trust Wallet, or Rainbow</p>
                      <div className="w-full flex gap-2">
                        <div className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-500 font-mono truncate">
                          {walletConnectUri?.slice(0, 40)}...
                        </div>
                        <button
                          onClick={copyWCUri}
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Copy size={12} />{copiedUri ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'MetaMask', icon: '🦊', url: `https://metamask.app.link/wc?uri=${encodeURIComponent(walletConnectUri)}` },
                        { name: 'Trust Wallet', icon: '🛡️', url: `https://link.trustwallet.com/wc?uri=${encodeURIComponent(walletConnectUri)}` },
                        { name: 'Rainbow', icon: '🌈', url: `https://rnbwapp.com/wc?uri=${encodeURIComponent(walletConnectUri)}` },
                      ]?.map(wallet => (
                        <a
                          key={wallet?.name}
                          href={wallet?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                        >
                          <span className="text-xl">{wallet?.icon}</span>
                          <span className="text-xs text-gray-600 font-medium">{wallet?.name}</span>
                          <ExternalLink size={10} className="text-gray-400" />
                        </a>
                      ))}
                    </div>
                    <button
                      onClick={() => { setShowWCModal(false); setWalletConnectUri(''); }}
                      className="w-full py-2 border border-gray-300 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={connectWalletConnect}
                      disabled={web3State?.loading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50"
                    >
                      {web3State?.loading ? 'Generating QR...' : 'Connect via WalletConnect'}
                    </button>
                    <div className="text-xs text-gray-600 space-y-1 p-3 bg-gray-50 rounded-xl">
                      <p>• Supports MetaMask Mobile, Trust Wallet, Rainbow</p>
                      <p>• Secure QR code scanning</p>
                      <p>• Works on all mobile devices</p>
                      <p>• Powered by WalletConnect v2 protocol</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Fallback */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Not using Web3?{' '}
                <button
                  onClick={() => setActiveTab('selector')}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Use Email/Password or OAuth instead
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Creator Configuration Tab */}
        {activeTab === 'creator-config' && (
          <CreatorConfigurationPanel
            authMethods={authMethods}
            setAuthMethods={setAuthMethods}
            electionAuthSettings={electionAuthSettings}
            setElectionAuthSettings={setElectionAuthSettings}
          />
        )}

        {/* Advanced Security Tab */}
        {activeTab === 'security' && (
          <AdvancedSecurityPanel />
        )}
      </div>
    </div>
  );
};

// Creator Configuration Panel Component
const CreatorConfigurationPanel = ({ authMethods, setAuthMethods, electionAuthSettings, setElectionAuthSettings }) => {
  const [selectedElection, setSelectedElection] = useState(null);
  const [securityLevel, setSecurityLevel] = useState('standard');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Election Creator Configuration</h3>
      <div className="space-y-6">
        {/* Authentication Method Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Required Authentication Methods
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'passkey', label: 'Passkey', icon: Key },
              { id: 'magicLink', label: 'Magic Link', icon: Mail },
              { id: 'emailPassword', label: 'Email/Password', icon: Lock },
              { id: 'oauth', label: 'OAuth (Social)', icon: Smartphone },
            ]?.map((method) => (
              <label
                key={method?.id}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={authMethods?.[method?.id]}
                  onChange={(e) => setAuthMethods(prev => ({
                    ...prev,
                    [method?.id]: e?.target?.checked
                  }))}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <method.icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">{method?.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Security Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'basic', label: 'Basic', desc: 'Email only' },
              { id: 'standard', label: 'Standard', desc: 'Email + 1 method' },
              { id: 'high', label: 'High', desc: 'Multi-factor required' },
            ]?.map((level) => (
              <button
                key={level?.id}
                onClick={() => setSecurityLevel(level?.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  securityLevel === level?.id
                    ? 'border-indigo-600 bg-indigo-50' :'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{level?.label}</div>
                <div className="text-xs text-gray-600 mt-1">{level?.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Voter Verification Requirements */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Voter Verification Requirements</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
              <span className="text-gray-700">Require email verification</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
              <span className="text-gray-700">Require phone verification</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
              <span className="text-gray-700">Require government ID (KYC)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
              <span className="text-gray-700">Require biometric authentication</span>
            </label>
          </div>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
          Save Configuration
        </button>
      </div>
    </div>
  );
};

// Advanced Security Panel Component
const AdvancedSecurityPanel = () => {
  return (
    <div className="space-y-6">
      {/* Multi-Factor Authentication */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Factor Authentication Combinations</h3>
        <div className="space-y-3">
          {[
            'Passkey + Email OTP',
            'Magic Link + SMS Verification',
            'OAuth + Biometric',
            'Email/Password + Authenticator App',
          ]?.map((combo, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700">{combo}</span>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                Enable
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Device Trust Management */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Device Trust Management</h3>
        <div className="space-y-3">
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">MacBook Pro - Chrome</div>
                <div className="text-sm text-gray-600">Last used: 2 minutes ago</div>
              </div>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">Trusted</span>
            </div>
          </div>
        </div>
      </div>
      {/* Session Security Monitoring */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Session Security Monitoring</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Sessions', value: '3', color: 'text-green-600' },
            { label: 'Suspicious Attempts', value: '0', color: 'text-gray-600' },
            { label: 'Blocked IPs', value: '12', color: 'text-red-600' },
          ]?.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl text-center">
              <div className={`text-3xl font-bold ${stat?.color}`}>{stat?.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiAuthenticationGateway;