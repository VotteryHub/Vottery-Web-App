# Moderator override audit (Web + Mobile)

When a moderator takes action on a flagged item, the **stored reason** in `moderation_actions.reason` can include a **machine‑parseable prefix** for compliance / fraud review.

## Shared constants

| Item | Web | Mobile |
|------|-----|--------|
| `OVERRIDE_AI` prefix | `MODERATION_AUDIT.MODERATOR_OVERRIDE_AI_PREFIX` in `src/constants/SHARED_CONSTANTS.js` | `SharedConstants.moderationOverrideAiPrefix` in `lib/framework/shared_constants.dart` |
| Min reason length (override) | `MODERATION_AUDIT.MIN_OVERRIDE_REASON_LENGTH` (12) | `SharedConstants.moderationMinOverrideReasonLength` (12) |

## Reason format (when “override AI” is on)

`OVERRIDE_AI|action=<db_action>|detection=<method>|ai_confidence=<0–1>|…|<human reason>`

- `|` in user text is sanitized to ` / `.
- `action` matches the normalized DB enum value (e.g. `approved`, `content_removed`).

## Implementation

| Layer | File |
|-------|------|
| Web | `src/services/moderationService.js` — `buildModeratorOverrideAuditReason`, `performModerationAction(..., auditMeta)` |
| Web UI | `src/pages/content-moderation-control-center/components/FlaggedContentPanel.jsx` — audit modal before confirm |
| Mobile | `lib/services/moderation_shared_service.dart` — `buildModeratorOverrideAuditReason`, `performModerationAction(..., overrideAi, …)` |
| Mobile UI | `lib/presentation/content_moderation_control_center/content_moderation_control_center_screen.dart` — `AlertDialog` before confirm |

## QA

1. Open Content Moderation Control Center (Web + Mobile).
2. On a pending flag, choose Approve / Remove / Warn (Web only Warn has full flow).
3. With **Override automated** checked, enter ≥12 characters → confirm → `moderation_actions.reason` starts with `OVERRIDE_AI|`.
4. With override unchecked, short or empty note is stored as `Moderator review` when no text.
