# Vottery Voting Flow Stability & Maintenance Guide

This document outlines the protocols and technical infrastructure implemented to ensure the long-term stability and maintainability of the Vottery mobile voting interface.

## 1. Voting Type Normalization

To prevent rendering bugs caused by database-level string variations, all voting types must be passed through the `votingTypeUtils.js` utility before being used by UI components.

### Canonical Types
- `plurality`: Standard "one vote per person" elections.
- `approval`: Multiple choice selection.
- `ranked-choice`: Drag-and-drop ranking.
- `plus-minus`: Upvote/Downvote interface.

### Usage
```javascript
import { normalizeVotingType } from '@/lib/votingTypeUtils';

const canonicalType = normalizeVotingType(rawTypeFromDb);
```

## 2. Regression Testing Protocol

Automated E2E tests are required for all changes to the `SecureVotingInterface`.

### Key Scenarios
1. **Step 1 Auto-Advance**: Elections without MCQ or media requirements must automatically advance to the ballot step.
2. **Standardized Rendering**: Verify that each voting type renders its respective specialized ballot component.

### Running Tests
```bash
npm run start # Start dev server
npx cypress run --spec cypress/e2e/voting-regression.cy.js
```

## 3. Production Telemetry & Monitoring

The voting funnel is instrumented with privacy-compliant telemetry to monitor health and identify bottlenecks.

### Event Taxonomy
- `VOTE_FLOW_STEP_VIEWED`: Captured when a user enters a specific step (requirements, ballot, success).
- `VOTE_FLOW_AUTO_ADVANCED`: Logged when the system automatically skips requirements.
- `VOTE_FLOW_ERROR`: Captured on loading failures or logic exceptions.

### Privacy Constraints
- **NO PII**: Email, names, or addresses are never logged.
- **NO Choices**: Individual ballot selections are never included in telemetry.
- **Aggregated Only**: Admin widgets show coarse category counts only.

## 4. Troubleshooting

| Symptom | Probable Cause | Action |
|---------|----------------|--------|
| Blank Screen on Load | Unhandled voting type string | Check `votingTypeUtils.js` mapping. |
| Stuck on Step 1 | Requirement condition failed | Verify MCQ/Media logic in `SecureVotingInterface`. |
| No Telemetry in Admin | EventBus disconnected | Check `EventBusRecorder.js` initialization. |

## 5. Deployment Rules (Phase R3/R4)
- **Small PRs**: Max 300 lines per voting-related change.
- **Mandatory Smoke**: `npm run test:healthcheck` + `voting-regression.cy.js` must pass.
- **Zero Regression**: Any failure in auto-advance logic triggers immediate rollback.
