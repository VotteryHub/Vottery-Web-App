import React from 'react';

/**
 * Honest disclosure for advanced crypto admin surfaces (Batch 1).
 * Sync messaging intent with certification ledger RED/AMBER rows for mixnet, ZK, HE, threshold.
 */
export default function CryptographicBatch1ScopeBanner({ className = '' }) {
  return (
    <div
      role="status"
      className={`rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-foreground ${className}`}
    >
      <p className="font-semibold text-amber-950 dark:text-amber-100 mb-2">Batch 1 — advanced cryptography scope</p>
      <p className="text-muted-foreground leading-relaxed">
        Vote verification, audit trails, and receipt-style checks may be enabled per deployment.{' '}
        <strong className="text-foreground">
          Production mixnet routing, ZK-SNARK verification, homomorphic tallying, and threshold decryption are not
          certified in Batch 1
        </strong>
        . Controls and metrics on this screen are planning and monitoring placeholders until audited crypto is wired
        end-to-end.
      </p>
    </div>
  );
}
