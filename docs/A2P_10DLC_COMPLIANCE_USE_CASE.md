# A2P 10DLC Compliance Use Case – Vottery

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Purpose:** Use-case description for A2P 10DLC registration to support Vottery’s SMS program and reduce carrier flagging risk.

---

## 1. Company & Brand Overview

**Brand Name:** Vottery  
**Company Type:** Civic Technology / Social Voting Platform  
**Primary Use Case:** Application-to-Person (A2P) SMS for transactional, security, and operational notifications related to elections, voting, and platform operations.

---

## 2. SMS Use Case Categories

Vottery sends SMS only for the following approved use cases:

### 2.1 Transactional (Primary)

| Use Case | Description | Example Messages |
|----------|-------------|------------------|
| **Vote Confirmation** | Confirmation after a user casts a vote | "Your vote in [Election Name] has been recorded. Receipt ID: XYZ123." |
| **Election Reminders** | Reminders for upcoming or closing elections | "Election [Name] closes in 24 hours. Cast your vote at [link]." |
| **Account Security** | 2FA codes, login alerts, password reset | "Your Vottery verification code is 123456. Expires in 10 min." |
| **Payout Notifications** | Creator earnings and payout status | "Your payout of $X has been processed. Check your wallet." |

### 2.2 Security & Compliance (Always Allowed)

| Use Case | Description | Example Messages |
|----------|-------------|------------------|
| **Fraud Alerts** | Suspicious activity or unauthorized access | "Unusual login detected. Reply STOP to disable." |
| **Compliance Notifications** | Regulatory, audit, or policy updates | "Vottery policy update: [brief summary]. Full terms at [link]." |
| **Operational Alerts** | System outages, degradation, incidents | "Vottery is experiencing delays. We're working on a fix." |

### 2.3 Administrative (AI/MCQ Alerts)

| Use Case | Description | Example Messages |
|----------|-------------|------------------|
| **MCQ Alert Routing** | Alerts to admins when MCQ sync/accuracy thresholds are breached | "MCQ Alert: Sync drop >5%. Election ID: [id]." |
| **AI Failover Alerts** | Notifications when SMS provider failover occurs | "Telnyx offline. Twilio failover active. Gamification SMS paused." |

---

## 3. Explicitly Excluded Use Cases

Vottery **does not** send SMS for:

- **Gamification / Lottery / Prizes** – Winner announcements, jackpot alerts, spin/draw notifications, or any promotional lottery content.
- **Marketing / Promotional** – Unsolicited marketing, upsells, or promotional campaigns.
- **Third-Party Advertising** – Ads or sponsored content via SMS.

**Failover Restriction:** When Twilio is used as a fallback (Telnyx offline), gamification/lottery/prize SMS are **blocked**. Only security, compliance, and operational messages are sent during failover.

---

## 4. Opt-In & Consent

- **Opt-in:** Users must explicitly consent to SMS (e.g., during sign-up or in settings).
- **Opt-out:** All messages include "Reply STOP to unsubscribe" or equivalent.
- **Frequency:** Transactional and security messages are sent only when necessary (event-driven).
- **No Shared Lists:** Vottery does not purchase or share phone number lists.

---

## 5. Technical Implementation

- **Primary Provider:** Telnyx (A2P 10DLC registered).
- **Fallback Provider:** Twilio (used only when Telnyx is unavailable).
- **Message Filtering:** Gamification-related messages are filtered during Twilio failover.
- **Health Monitoring:** Periodic health checks to detect provider status and auto-restore to Telnyx when service is restored.

---

## 6. Compliance Summary

| Requirement | Status |
|-------------|--------|
| TCPA Compliance | ✅ Consent-based, opt-out honored |
| CTIA Guidelines | ✅ Transactional and security use cases only |
| Carrier Guidelines | ✅ No marketing, no lottery/promotional SMS during failover |
| Message Content | ✅ Clear, non-deceptive, includes opt-out |
| Double Opt-In (where applicable) | ✅ For marketing; N/A for transactional |

---

## 7. Registration Use Case Selection

For A2P 10DLC campaign registration, select:

- **Primary:** 2FA / Account Notifications  
- **Secondary:** Customer Care  
- **Tertiary:** Account Notifications (vote confirmations, election reminders)

**Campaign Description (suggested):**  
"Vottery sends transactional SMS for vote confirmations, election reminders, 2FA codes, security alerts, and operational notifications. No marketing or lottery/prize SMS. Opt-in required; opt-out honored."

---

*This document is intended to support A2P 10DLC registration and carrier review. Update as use cases or policies change.*
