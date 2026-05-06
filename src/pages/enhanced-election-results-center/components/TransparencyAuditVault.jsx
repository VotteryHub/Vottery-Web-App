import React from 'react';
import Icon from '../../../components/AppIcon';

const TransparencyAuditVault = ({ election }) => {
  const mockReceipts = [
    { id: 'TX-001x9a', hash: '0x71c...3a2f', status: 'verified', time: '2026-04-20 10:24' },
    { id: 'TX-002k3j', hash: '0xa4e...9b11', status: 'verified', time: '2026-04-20 11:15' },
    { id: 'TX-003m8p', hash: '0x1c2...e8d2', status: 'verified', time: '2026-04-20 11:45' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <Icon name="Shield" size={40} className="text-indigo-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Transparency Audit Vault</h2>
            <p className="text-slate-400 text-sm max-w-2xl font-medium leading-relaxed">
              Every vote cast in the <span className="text-indigo-300">Sovereign Governance Network</span> is cryptographically signed and anchored to a tamper-proof blockchain ledger. 
              Review the integrity of this election through the public audit trail below.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Election Status</div>
            <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-black uppercase tracking-tighter flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Fully Audited
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6 border-l-4 border-l-indigo-500">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Search" size={20} className="text-primary" />
              Live Audit Trail (Merkle Proofs)
            </h3>
            <div className="space-y-3">
              {mockReceipts.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border group hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                      <Icon name="CheckCircle" size={18} className="text-green-500" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-foreground uppercase tracking-tight">{r.id}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{r.hash}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-muted-foreground">{r.time}</div>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-1">Verify Receipt</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 bg-muted border border-border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all">
              Download Full Audit CSV
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-primary/5 border-dashed border-2 border-primary/20">
            <Icon name="Lock" size={32} className="text-primary mb-4" />
            <h3 className="text-base font-black text-foreground uppercase tracking-widest mb-2">Zero-Knowledge Integrity</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Using zk-SNARKs, we prove that every vote was counted correctly without revealing individual identities or ballot contents. This ensures 100% verifiability without compromising privacy.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Network Consensus</h3>
              <div className="px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-black rounded">ETHEREUM L2</div>
            </div>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-muted-foreground">
                    <span>Block Confirmation</span>
                    <span>99.9%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '99.9%' }} />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-muted-foreground">
                    <span>Validator Sync</span>
                    <span>12 / 12 Nodes</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '100%' }} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparencyAuditVault;
