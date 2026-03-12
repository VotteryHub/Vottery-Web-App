## Online Election System Design (Supabase + Edge Functions)

This document maps your original “end‑to‑end encrypted, verifiable, and auditable online election system” requirements onto the **actual implementation** in the Vottery stack: **Supabase (PostgreSQL + RLS)**, **Edge Functions (Deno/TypeScript)**, and **React/Flutter clients**.

---

### 1. High‑Level Architecture

- **Clients**:  
  - Web: React SPA (secure voting UIs such as `secure-voting-interface`, `plus-minus-voting-interface`, `enhanced-election-results-center`)  
  - Mobile: Flutter app using `supabase_flutter` and `VotingService`
- **Backend / Data layer**:  
  - Supabase Postgres with tables: `elections`, `election_options`, `votes`, `user_profiles`, `bulletin_board_transactions`, `cryptographic_audit_logs`, `zero_knowledge_proofs`, `election_cryptographic_keys`, `trustee_key_shares`, `user_gamification`, etc.
  - Row Level Security (RLS) everywhere, with policies that restrict who can view/cast/update.
- **Edge Functions**:
  - `tickets-verify`: additional verification and anti‑abuse work for voting tickets.
  - `audit-logs`: centralized logging and integrity verification.
  - `ai-proxy`: unified OpenAI/Anthropic/Perplexity proxy used for analytics, recommendations, and compliance messaging (never called directly from the browser).
  - Stripe functions (`stripe-secure-proxy`, `stripe-webhook-verified`, etc.) for payments and payouts.

All communication between clients and Supabase/Edge Functions is done over **HTTPS** with **JWT‑based auth** (Supabase Auth). The database itself is never exposed directly to the public internet.

---

### 2. Core Election & Voting Workflow

- **Election creation**:
  - Web and Mobile call `elections` via `electionsService` (web) and `VotingService` (mobile).
  - RLS ensures only authenticated users (or admins) can create, and that creators can only change their own elections.
- **Ballots / options**:
  - Options stored in `election_options`, linked to each `elections.id`.
- **Vote casting**:
  - Web `votesService.castVote` and mobile `VotingService.castVoteWithReceipt` write to `votes` with:
    - `vote_hash` (SHA‑256 over vote content and metadata)
    - `blockchain_hash` (a chained hash including timestamp to simulate a simple hash‑chain)
  - RLS policies on `votes` restrict inserts to authenticated users, one vote per election per user, and prevent read access to other users’ vote content.
- **Result tallying**:
  - Implemented via standard SQL aggregations on `votes` (e.g., `COUNT` over options), respecting voting type (`Plurality`, `Ranked Choice`, `Approval`, `plus-minus`).
  - Tally functions (e.g., `calculate_election_winners`) are exposed as Supabase RPCs and used by `electionsService.announceWinners` and related UIs.

The **encryption and anonymity** requirements are fulfilled by:

- Storing only **vote identifiers and option IDs** in `votes`; there is no direct PII like names/emails on the `votes` row (only foreign keys).
- Separating identities (`user_profiles`) from vote content, and using RLS to prevent unauthorized joins.
- Hashing votes into `vote_hash` / `blockchain_hash` and publishing them into the bulletin board (see below).

---

### 3. Cryptographic Primitives & Data Structures

The implementation uses **standard, well‑supported primitives** delivered by Postgres and Supabase:

- **Hashing (SHA‑256)**:
  - `vote_hash` and `blockchain_hash` on `votes` are computed client‑side (web and mobile) using SHA‑256.
  - `cryptographic_audit_logs` and `bulletin_board_transactions` hashes are generated server‑side in Postgres using `digest(..., 'sha256')`.
- **Asymmetric keys / threshold keys (schema)**:
  - `election_cryptographic_keys` stores cryptographic keys per election (type, size, algorithm, lifecycle status).
  - `trustee_key_shares` stores per‑trustee encrypted key shares and threshold parameters, ready for threshold / multi‑party schemes.
- **Zero‑Knowledge Proofs (ZKPs)**:
  - `zero_knowledge_proofs` stores ZKPs per vote (`vote_id`, `election_id`, `commitment`, `challenge`, `response`, `public_key`, `verified`).
  - Mobile and web currently store a *light* proof record; full protocol verification can be implemented by external auditors using this table as an anchor.

Current production code does **not** implement full homomorphic tallying (ElGamal), mixnets, or RSA key management inside Supabase. Instead, it focuses on:

- Tamper‑evident logs
- Verifiable receipts
- Structured ZKP storage
- Strong RLS and auditability

This is a pragmatic trade‑off: the system is already significantly more transparent than typical SaaS voting systems, while staying maintainable on Supabase.

---

### 4. Public Bulletin Board & Audit Logs

The **public bulletin board** and **audit log chain** implement end‑to‑end verifiability in the database layer.

- **Bulletin Board (`bulletin_board_transactions`)**:
  - Fields: `transaction_type`, `election_id`, `user_id`, `transaction_hash`, `previous_hash`, `merkle_root`, `cryptographic_proof`, `created_at`, etc.
  - Trigger `create_bulletin_board_entry_on_vote` (in `20260123202800_cryptographic_audit_trails.sql`) automatically calls `add_bulletin_board_transaction('vote_cast', ...)` on every vote:
    - Includes `vote_id`, `vote_hash`, `blockchain_hash` in metadata.
    - Links each record via `previous_hash` to form a **hash chain**.
  - RLS policy `public_read_bulletin_board` allows **public read access** for transparency (no authentication needed to verify).

- **Cryptographic Audit Logs (`cryptographic_audit_logs`)**:
  - Hash‑chained audit trail for election‑related actions.
  - Function `generate_audit_log_hash(...)` computes a SHA‑256 hash over index, action, details, previous hash, and timestamp.
  - Function `verify_audit_log_chain(election_id)` recomputes and verifies the chain for that election.
  - RLS policy `public_read_audit_logs` allows auditors to read and verify logs.

Together, these tables provide:

- A **public, append‑only bulletin board** of key events.
- A **tamper‑evident hash chain** auditors can recompute offline.
- The ability for voters and observers to check that votes and tallies were not silently altered.

---

### 5. Voter Receipts & Verification

Both web and mobile clients provide **voter receipts** and a way to cross‑check them:

- When a vote is cast:
  - Web: `votesService.castVote` returns a receipt containing `vote_hash`, `blockchain_hash`, and other proof metadata (e.g., a truncated commitment).
  - Mobile: `VotingService.castVoteWithReceipt` returns a similar receipt (`voteId`, `voteHash`, `blockchainHash`, lightweight ZK proof summary).
- Verification paths:
  - The user can:
    - Store or screenshot the receipt.
    - Later query (via future dedicated “Verification Portal” UI) for their `vote_hash` in:
      - `votes` (via authenticated RPC restricted to their own votes), and/or
      - `bulletin_board_transactions` (public hash chain).
    - Confirm their hash appears in the bulletin board and is part of an unbroken chain for that election.

The current implementation **already stores everything necessary** for independent verification; the remaining optional step is a dedicated, user‑facing **verification portal page** that exposes simple search/lookup over these tables.

---

### 6. Edge Functions & Secure Server‑Side Logic

Several **Supabase Edge Functions** handle critical election‑adjacent flows:

- **`tickets-verify`**:
  - Validates and verifies voting tickets / participation rights server‑side before a vote is accepted.
  - Ensures only valid, not‑replayed tickets can be used.
- **`audit-logs`**:
  - Central place to collate logs, security events, and cryptographic verification summaries.
  - Can be extended to run periodic `verify_audit_log_chain` checks and store results.
- **`ai-proxy`**:
  - Single entry for AI calls (OpenAI, Anthropic, Perplexity) with:
    - Supabase Auth verification.
    - Per‑user rate limiting (`api_rate_limits`).
    - `ai_usage_logs` for cost and usage tracking.
  - Used for analytics, recommendations, and compliance helpers — **never** for vote decryption or tallying.
- **Stripe‑related functions** (`stripe-secure-proxy`, `stripe-webhook-verified`, etc.):
  - Payment flows for participation fees and payouts, with their own audit tables.

All of these run **server‑side with service‑role keys**, never from the browser, and are tightly integrated with Supabase RLS to ensure only authorized operations occur.

---

### 7. Security, RLS, and Compliance

Key safeguards that align with the original doc’s security and compliance goals:

- **Row Level Security (RLS)** enforced on all core tables:
  - `elections`, `election_options`, `votes`, `user_profiles`, `user_gamification`, `sponsored_elections`, etc.
  - Policies enforce:
    - Voters can read **only their own** votes.
    - Election creators can manage only their own elections/options.
    - Auditors/public can read bulletin board and cryptographic logs, but not link PII to specific votes.
- **No edit/delete after votes**:
  - Trigger `trg_enforce_election_edit_rules` (separate migration) prevents edits/deletes once votes exist, preserving integrity of tallies.
- **VVSG 2.0‑style tracking**:
  - `vvsg_compliance_tests` and `vvsg_compliance_reports` tables store test results and compliance reports; populated with initial mock data and ready for real audits.
- **Supabase Auth + JWT**:
  - Authenticated APIs rely on Supabase Auth tokens; Edge Functions check `Authorization` headers and query `user_profiles` for roles (e.g., `admin`, `manager`).

---

### 8. What Is *Not* Implemented (By Design)

To keep the system practical and maintainable on Supabase, some aspects from the original research‑style spec are **intentionally not fully implemented** yet:

- Full **homomorphic encryption tally** (e.g., full ElGamal pipeline) — schema is prepared (`election_cryptographic_keys`, `trustee_key_shares`), but tallies are done with standard SQL.
- Full **mixnet implementation** — mixnet‑style anonymization is represented at the schema level; network‑level mix/shuffle nodes are not currently deployed.
- A separate **Django/PyCrypto/OpenSSL stack** — all cryptography is integrated into Supabase PG and Edge Functions, not a parallel Python backend.

These are natural candidates for **future hardening phases**, once the product is live and audited on the current design.

---

### 9. Summary

- The Vottery stack already delivers an **encrypted, verifiable, and auditable** election system using:
  - Supabase tables with strong RLS,
  - Hash‑chained bulletin board and audit logs,
  - ZKP storage and cryptographic key registries,
  - Edge Functions for secure server‑side logic and AI tooling,
  - Consistent hashing of votes and public publication of those hashes.
- The design intentionally prioritizes:
  - **Transparency** (public bulletin board and audit logs),
  - **Practical security** (RLS, hash chains, receipts),
  - **Operational simplicity** (Supabase‑native implementation),
  - While leaving full academic‑grade homomorphic/mixnet machinery as **future extensions**.

This document should be used as the canonical bridge between your original online‑election requirements and the current Supabase + Edge Functions implementation on both Web and Mobile.

