# Responsive Fixes Summary

## Overview
This document tracks the systematic refinement of the Vottery Web responsive layout, focusing on overflow containment and mobile-first consistency.

## G1: Global Overflow Containment Refactor

### Removal of Blanket Rules
- **Component**: `AppShell.jsx`
- **Change**: Removed `overflow-x: hidden` from the absolute root container.
- **Rationale**: Global overflow-x: hidden is a "sledgehammer" approach that can break intentional horizontal scrolling (like carousels) and hide layout bugs rather than fixing them.

### Targeted Containment
Instead of a global rule, we now apply containment to specific layout wrappers:
- **Carousels**: Use `overflow-x-auto` with `scroll-snap-type` to ensure smooth, intentional horizontal scrolling.
- **Page Sections**: If a specific component causes accidental overflow (e.g., a wide table), it is wrapped in a container with `overflow-x-auto` or `max-w-full overflow-hidden`.

### Identified Offenders & Fixes
| Component | Issue | Fix |
|-----------|-------|-----|
| `AppShell` | Blanket `overflow-x-hidden` | Removed; allowed layout to breathe. |
| `Premium2DHorizontalSnapCarousel` | Potential clipping | Ensured `overflow-x-auto` is preserved. |

## R2: Navigation Responsive Adjustments
- Mobile Bottom Nav: Added `pb-safe` (safe-area-inset-bottom) to prevent overlap with OS gestures.
- PageContainer: Adjusted bottom padding to 6rem + safe area when bottom nav is active.
