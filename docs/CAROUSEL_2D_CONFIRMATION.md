# Carousel System: Premium 2D (3D Replaced)

## Confirmation

The **3D carousel designs** (Kinetic Spindle, Isometric Deck, Liquid Horizon) have been **replaced** by **Premium 2D carousels** for the main home feed and content surfaces.

| Former 3D | Current Premium 2D |
|-----------|---------------------|
| Kinetic Spindle | **Premium 2D – Horizontal snap** (PageView with premium effects) |
| Isometric Deck-Sifter | **Premium 2D – Vertical card stack** (swipe gestures) |
| Liquid Horizon | **Premium 2D – Smooth gradient flow** |

## Where It’s Implemented

- **Web:** `src/pages/home-feed-dashboard/` uses `Premium2DHorizontalSnapCarousel`, `Premium2DVerticalCardStackCarousel`, `Premium2DSmoothGradientFlowCarousel`. Library: `src/pages/premium-2d-carousel-component-library-hub/`.
- **Mobile:** `lib/presentation/social_media_home_feed/widgets/` – `horizontal_snap_carousel_widget.dart`, `vertical_card_stack_widget.dart`, `gradient_flow_carousel_widget.dart` (Premium 2D Horizontal snap, Vertical card stack, Smooth gradient flow).

Any remaining **“3D”** references (e.g. in analytics or legacy dashboard names) are for historical/observability only; the **live feed and carousel UX are Premium 2D**.
