import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const ZeroDayDetectionPanel = () => {
  const [zeroDayThreats, setZeroDayThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadZeroDayThreats();

    const handleRefresh = () => loadZeroDayThreats();
    window.addEventListener('ml-threat-refresh', handleRefresh);
    return () => window.removeEventListener('ml-threat-refresh', handleRefresh);
  }, []);

  const loadZeroDayThreats = async () => {
    try {
      setLoading(true);
      const data = await mlThreatDetectionService?.detectZeroDay();
      setZeroDayThreats(data?.threats || []);
    } catch (error) {
      console.error('Failed to load zero-day threats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Scanning for zero-day threats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zero-Day Threats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} />
            Zero-Day Threats Detected ({zeroDayThreats?.length || 0})
          </h3>
          <button
            onClick={loadZeroDayThreats}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            <Icon name="RefreshCw" size={14} />
            Scan Now
          </button>
        </div>

        {zeroDayThreats?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Shield" size={48} className="text-green-600 mx-auto mb-3" />
            <p className="text-muted-foreground">No zero-day threats detected.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {zeroDayThreats?.map((threat, index) => (
              <div key={index} className="border-2 border-red-500/30 rounded-lg p-5 bg-red-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-3 py-1 rounded bg-red-600 text-white">
                        ZERO-DAY
                      </span>
                      <span className="text-xs text-muted-foreground">{threat?.firstDetected}</span>
                    </div>
                    <h4 className="font-bold text-foreground text-lg mb-2">{threat?.threatName}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{threat?.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 mb-1">{threat?.severity}/10</div>
                    <div className="text-xs text-muted-foreground">Severity</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-foreground mb-1">{threat?.exploitAttempts}</div>
                    <div className="text-xs text-muted-foreground">Exploit Attempts</div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-foreground mb-1">{threat?.affectedSystems}</div>
                    <div className="text-xs text-muted-foreground">Affected Systems</div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-foreground mb-1">{threat?.confidence}%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <div className="text-lg font-bold text-foreground mb-1">{threat?.cveStatus}</div>
                    <div className="text-xs text-muted-foreground">CVE Status</div>
                  </div>
                </div>

                {threat?.exploitationPattern && (
                  <div className="bg-white rounded p-3 mb-3">
                    <div className="text-xs font-semibold text-foreground mb-2">Exploitation Pattern:</div>
                    <p className="text-xs text-muted-foreground font-mono">{threat?.exploitationPattern}</p>
                  </div>
                )}

                {threat?.indicators && (
                  <div className="bg-white rounded p-3 mb-3">
                    <div className="text-xs font-semibold text-foreground mb-2">Indicators of Compromise (IOCs):</div>
                    <div className="flex flex-wrap gap-2">
                      {threat?.indicators?.map((ioc, idx) => (
                        <span key={idx} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-mono">
                          {ioc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    <Icon name="Shield" size={14} className="inline mr-2" />
                    Deploy Mitigation
                  </button>
                  <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                    <Icon name="AlertTriangle" size={14} className="inline mr-2" />
                    Escalate to Security Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exploitation Techniques */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} />
          Novel Exploitation Techniques
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">SQL Injection Variants</h4>
            <div className="text-2xl font-bold text-orange-600 mb-1">7</div>
            <p className="text-xs text-muted-foreground">New patterns detected</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">XSS Attack Vectors</h4>
            <div className="text-2xl font-bold text-red-600 mb-1">12</div>
            <p className="text-xs text-muted-foreground">Novel techniques identified</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Authentication Bypass</h4>
            <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
            <p className="text-xs text-muted-foreground">Unknown methods found</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">API Exploitation</h4>
            <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
            <p className="text-xs text-muted-foreground">Undocumented vulnerabilities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroDayDetectionPanel;