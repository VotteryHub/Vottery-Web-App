# Staging Test Accounts

The following accounts are seeded in the staging environment for testing purposes. 
Do NOT use real passwords; all accounts use `VotteryTest2026!` by default.

## 1. System Administrator
- **Email**: `admin@vottery.test`
- **Role**: `super_admin`
- **Purpose**: Manage feature flags, view global analytics, and perform platform-wide moderation.

## 2. Creator (Political)
- **Email**: `senator.smith@vottery.test`
- **Role**: `creator`
- **Purpose**: Test election creation, branding, and QR code generation.
- **Assigned Hub**: Politics & Governance

## 3. Regular Voter (Verified)
- **Email**: `voter.verified@vottery.test`
- **Role**: `voter`
- **Identity Status**: `verified` (Sumsub simulated)
- **Purpose**: Test secure voting, identity-gated elections, and slot machine behavior.

## 4. Regular Voter (Unverified)
- **Email**: `voter.new@vottery.test`
- **Role**: `voter`
- **Identity Status**: `unverified`
- **Purpose**: Test identity verification flows and restricted access scenarios.

## 5. Creator (Social)
- **Email**: `social.star@vottery.test`
- **Role**: `creator`
- **Purpose**: Test gamified elections and high-volume social interactions.
- **Assigned Hub**: Entertainment & Social

## Access Instructions
1. Navigate to the staging URL.
2. Click **Login**.
3. Use the credentials above.
4. If testing MFA, use `000000` as the simulated code in staging.
