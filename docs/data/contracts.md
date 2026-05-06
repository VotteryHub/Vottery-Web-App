# Data Contracts: Voting System

This document outlines the canonical data formats and allowed values for the Vottery voting system to ensure consistency across the database, service layer, and UI.

## Voting Types

Voting types are normalized to a canonical lowercase-hyphenated format.

### Canonical Values

| Canonical Value | Description | Legacy / Supported Variants |
| --- | --- | --- |
| `plurality` | Single choice selection | `standard`, `single-choice`, `Plurality` |
| `approval` | Multiple choices selection | `Approval`, `Approval Voting` |
| `ranked-choice` | Ordered preference list | `Ranked Choice`, `Ranked-Choice`, `rcv` |
| `plus-minus` | +1 / -1 / 0 scoring | `Plus Minus`, `score`, `quadratic` |

### Normalization Logic

The system employs a two-tier normalization strategy:

1.  **Database Layer**: The `elections` table includes a `voting_type_canonical` column, backfilled and maintained via triggers for all rows.
2.  **Service Layer**: The `electionsService` uses the `normalizeVotingType` utility to standardize the `votingType` field during data conversion (`toCamelCase`), ensuring the UI always receives a canonical string regardless of the legacy value in the `voting_type` column.

## Implementation Details

- **Utility**: `src/lib/votingTypeUtils.js`
- **Migration**: `20260428133200_standardize_voting_types.sql`
- **Service**: `src/services/electionsService.js`
