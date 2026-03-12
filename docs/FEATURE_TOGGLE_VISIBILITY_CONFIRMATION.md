# Feature Toggle Visibility — Confirmation

## Your question
When you switch off or disable any of the features in the admin panel, will it **completely not be seen** on any of the user types' screens?

---

## Short answer

**Partially.** Right now:

- **If a route is gated:** Visiting that URL when the feature is **off** → user is redirected or sees "Feature not available," so the **screen is not seen**.
- **But:** Links to that route can still **appear** in nav, menus, quick links, and command palette. So the feature can still be "seen" as a clickable link; only after clicking is access blocked.
- **And:** Only routes that are in the **route–feature map** are gated. Many routes/screens are not in that map yet, so turning off a toggle does not hide or block them.

So we **cannot** confirm that disabling a feature makes it "completely not seen" on all user types' screens until nav/menus are also filtered and (optionally) more routes are added to the map.

---

## Current behaviour (before nav filtering)

| Where | When feature is OFF |
|--------|----------------------|
| **Direct URL / bookmark** | User is redirected or sees "Feature not available" (for routes in the map). |
| **Header nav (Elections, quick links, etc.)** | Link still visible; click is then blocked by route gate. |
| **Profile menu (Settings, Appeals, etc.)** | Link still visible; click is then blocked. |
| **Command palette** | Option still visible; navigation is then blocked. |
| **Routes not in route–feature map** | No gating; screen is still reachable and visible. |
| **Mobile** | Only screens wrapped with `FeatureGateWidget` are gated; other screens stay visible. |

---

## What "completely not seen" would require

1. **Route gating** (already in place for mapped routes)  
   - User cannot see the screen when they land on the URL.

2. **Navigation/menu filtering** (implemented next)  
   - Any link whose path is gated by a disabled feature is hidden from:
     - Header (elections dropdown, quick links, carousel, etc.)
     - Profile menu
     - Command palette (and any other nav that uses the same list)

3. **Complete route–feature map** (optional follow-up)  
   - Every screen that has a toggle has a corresponding entry in the map so disabling the toggle also gates that route.

4. **Mobile**  
   - Use `FeatureGateWidget` (or a central guard) for every gated screen so behaviour matches Web.

---

## After nav filtering (implemented)

Navigation filtering is now in place:

- For every **path that is in the route–feature map** and whose feature is **disabled**:
  - The **screen** is not seen (redirect or "Feature not available" when visiting the URL).
  - The **link** to that path is hidden in: Header navigation, User profile menu, Command palette.

So for **mapped routes**, disabling the feature means it is **not seen** (no link, no screen) on Web. Routes not in the map may still appear or be reachable; Mobile needs gated screens wrapped with FeatureGateWidget for the same behaviour.
