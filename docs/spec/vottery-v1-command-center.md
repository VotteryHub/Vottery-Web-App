# Vottery V1 Command Center & Constitution Specification

## 1. Algorithm Command Center
- **Layout**: 4-quadrant dashboard + 5th central 3D globe heatmap (Three.js).
- **Quadrant 1: Merit Control**: vIQ amplification sliders, Reach Penalty coefficient Cp toggles.
- **Quadrant 2: Discovery Mix**: 70/30 Personalization/Discovery split control.
- **Quadrant 3: Cost Guardrails**: Weekly budget caps, AI efficiency modes.
- **Quadrant 4: Performance**: Real-time throughput, latency, and drift metrics.
- **Directive Terminal**: Command-line interface for Gemini-parsed algorithmic directives.

## 2. Constitutional Middleware
- **Transparency**: "Logic Audit" button on every content item explaining "Why am I seeing this?" in plain language.
- **Integrity**: "Democratic Freeze" triggers for suspicious activity (sudden voting spikes, bot detection).
- **Redemption Path**: Automatic decay of Reach Penalties over time (Redemption curve).
- **Commercial Neutrality**: Hard silo between Ads and vIQ. Ads cannot increase organic merit scores.

## 3. vIQ & Reach Penalty Logic
- **vIQ**: Amplification Factor `A = log(engagement) * (w1*accuracy + w2*consensus + w3*longevity)`.
- **Reach Penalty**: Coefficient `Cp` applied to final ranking score.
- **Redemption**: `Cp` decays over time `t` (configurable half-life).
