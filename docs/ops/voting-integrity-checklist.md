# Voting Integrity & Security Checklist

This document summarizes the practical security measures and integrity guards implemented for the Vottery voting platform.

## 1. Access Control (RLS)

- [x] **Telemetry Isolation**: Users can only `INSERT` and `SELECT` their own engagement signals via `users_manage_own_engagement_signals` policy.
- [x] **Admin Analytics**: Only users with the `admin` role in `user_profiles` can read aggregated metrics from the telemetry tables.
- [x] **Vote Confidentiality**: Users can only `SELECT` their own votes. Individual ballot choices are never exposed in standard public-facing queries.

## 2. Submission Integrity

- [x] **Double Vote Prevention**: Enforced via a `UNIQUE(election_id, user_id)` constraint on the `votes` table.
- [x] **Idempotency**: The `castVote` service generates unique `blockchain_hash` and `vote_hash` values for every submission.
- [x] **Session Validation**: All voting endpoints (`castVote`) require an authenticated Supabase session.
- [x] **Rapid Submission Guard**: A 500ms debounce is enforced in the `EventBusRecorder` for telemetry.
- [ ] **NEXT STEP**: Implement a client-side "Submission Lock" state to disable the "Vote" button immediately after the first click to prevent accidental double-clicks before the network response returns.

## 3. Cryptographic Proofs

Every vote is fortified with:
- **RSA-2048 Encryption**: Individual vote contents are encrypted.
- **ElGamal Homomorphic Encryption**: Prepared for secure tallies.
- **Zero-Knowledge Proofs (ZKP)**: Proves vote validity without revealing choices.
- **Audit Chain**: Recorded on a tamper-evident hash chain.

## 4. Monitoring & Alerting (V1)

The following metrics are tracked for "Voting Integrity" alerts:
- **`VOTE_FLOW_ERROR` Spikes**: Sudden increases in logic failures (MCQ gating, decryption errors).
- **Vote Submission Failures**: Tracked via `user_engagement_signals` with `engagement_type = 'flow_error'`.
- **Anomalous Volume**: Unusual vote velocity per IP/Election (Monitored via Supabase logs).

## 5. Deployment Healthchecks

Before every release to production:
1. Run `npm run test:healthcheck`.
2. Execute `cypress run --spec cypress/e2e/voting-regression.cy.js` to verify the "Step 1 Hang" fix.
3. Verify RLS policies haven't been modified via `supabase db lint` (if available).
