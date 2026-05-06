# Incident Playbook: Voting Funnel Drops & Errors

Use this playbook when the **Voting Funnel Diagnostic** widget shows unusual drop-offs or error spikes.

## Symptom 1: High "Requirements View" but Low "Ballot View"
*The user enters the election but never reaches the actual voting step.*

### Potential Causes
1. **MCQ Gating Bug**: The mandatory quiz is failing to load or validation is stuck.
2. **Media Requirement**: The video watch-time condition is not firing the "Complete" signal.
3. **Data Missing**: The election object is missing `election_options`.

### Diagnostic Steps
- [ ] **Check Sentry**: Filter for `SecureVotingInterface` or `MCQ` component errors.
- [ ] **Check Logs**: Filter `user_engagement_signals` for `funnel_flow_error` where `step = 'requirements'`.
- [ ] **Manual Verification**: Open the specific `election_id` in a test account.

---

## Symptom 2: High "Ballot View" but Low "Vote Cast"
*Users are looking at the options but not submitting their vote.*

### Potential Causes
1. **RLS Insert Failure**: The `votes` table RLS is blocking the submission (check for 403 Forbidden).
2. **Double Vote**: User has already voted but the UI didn't show the "Success" state initially.
3. **Frontend Crash**: The `castVote` service is failing during cryptographic proof generation (ZKP/RSA).

### Diagnostic Steps
- [ ] **Check Network**: Look for failed `POST` requests to the `votes` table.
- [ ] **Check Unique Constraints**: Verify if users are hitting the `UNIQUE(election_id, user_id)` error.

---

## Symptom 3: Sudden Spike in `VOTE_FLOW_ERROR`
*The "Flow Errors" card in the Admin Diagnostic is showing rapid growth.*

### Immediate Actions
1. **Identify Error Category**: Check if it's `logic_error`, `network_failure`, or `validation_fail`.
2. **Kill Switch**: If the error is critical, use the Feature Flag dashboard to disable the `SECURE_VOTING_v2` module.
3. **Check Supabase**: View real-time logs for the `cast-vote` Edge Function (if used).

---

## Useful Search Queries

### Sentry
`url:*/vote/* level:error`

### Supabase Logs
```sql
SELECT metadata->>'errorMessage', count(*) 
FROM user_engagement_signals 
WHERE engagement_type = 'funnel_flow_error' 
GROUP BY 1 
ORDER BY 2 DESC;
```

## Emergency Contacts
- **Security Team**: #v-sec-alerts (Slack)
- **Infra On-call**: #v-infra-alerts (Slack)
