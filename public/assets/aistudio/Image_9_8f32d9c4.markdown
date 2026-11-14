---
name: Family Travel Editorial
colors:
  surface: '#081425'
  surface-dim: '#081425'
  surface-bright: '#2f3a4c'
  surface-container-lowest: '#040e1f'
  surface-container-low: '#111c2d'
  surface-container: '#152031'
  surface-container-high: '#1f2a3c'
  surface-container-highest: '#2a3548'
  on-surface: '#d8e3fb'
  on-surface-variant: '#dbc1b9'
  inverse-surface: '#d8e3fb'
  inverse-on-surface: '#263143'
  outline: '#a38c85'
  outline-variant: '#55433d'
  surface-tint: '#ffb59e'
  primary: '#ffb59e'
  on-primary: '#5c1902'
  primary-container: '#d97757'
  on-primary-container: '#541400'
  inverse-primary: '#99462a'
  secondary: '#aacfba'
  on-secondary: '#153628'
  secondary-container: '#315242'
  on-secondary-container: '#9fc4af'
  tertiary: '#c8c6c4'
  on-tertiary: '#30312f'
  tertiary-container: '#92928f'
  on-tertiary-container: '#2a2b29'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#390b00'
  on-primary-fixed-variant: '#7a2f15'
  secondary-fixed: '#c6ebd5'
  secondary-fixed-dim: '#aacfba'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#2c4d3d'
  tertiary-fixed: '#e4e2df'
  tertiary-fixed-dim: '#c8c6c4'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474745'
  background: '#081425'
  on-background: '#d8e3fb'
  surface-variant: '#2a3548'
typography:
  headline-xl:
    fontFamily: Fira Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Fira Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Fira Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Fira Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 24px
  margin: 32px
  space-xs: 4px
  space-sm: 8px
  space-md: 16px
  space-lg: 24px
  space-xl: 48px
---

## Brand & Style

This design system channels a warm, editorial, and joyful family travel aesthetic. It bridges the gap between inspiring lifestyle publishing and rigorous logistical clarity. 

- **Brand Personality:** Approachable, curated, optimistic, and deeply trustworthy. It speaks to modern parents seeking effortless adventure and memorable family bonding without the administrative chaos.
- **Target Audience:** Millennial and Gen-X families, travel planners, and boutique curators who value both aesthetic beauty and structural reliability.
- **Emotional Response:** Evokes a sense of calm excitement, wanderlust, warmth, and complete reassurance. 
- **Design Style:** A hybrid of **Minimalism** and **Corporate / Modern**, anchored by a clean Swiss-grid layout system. It rejects cold corporate sterility in favor of organic warmth, generous whitespace, and human-centered typography, while maintaining uncompromising functional precision.

## Colors

The color palette is inspired by sun-baked terracotta tiles, calming coastal sagebrush, and warm parchment paper, optimized for a dark mode environment. 

- **Primary (Terracotta `#D97757`):** Used for primary actions, critical interactive states, and focal warm highlights that draw the eye to essential booking elements.
- **Secondary (Sage Green `#6B8E7B`):** Applied to success states, secondary tags, and subtle contextual banners, offering a grounding, natural contrast to the warm terracotta.
- **Tertiary (Warm Sand `#FAF8F5`):** The foundational canvas color adapted for dark mode surfaces, providing a welcoming, paper-like warmth that reduces eye strain and sets an editorial tone.
- **Neutral (Deep Slate `#1E293B`):** Reserved for high-contrast, highly legible typography and primary structural borders. It anchors the warm palette with a sophisticated, professional finish.

## Typography

Typography balances approachable geometry with crisp editorial authority using Fira Sans for headlines and Plus Jakarta Sans for body text, ensuring effortless legibility across dense itineraries and inspirational storytelling modules alike.

- **Scale & Hierarchy:** Built on a proportional scale that creates clear structural hierarchy. Headlines use slightly tighter tracking for a modern magazine feel, while body copy prioritizes generous line heights for readability.
- **Responsive Adaptation:** For viewports under 768px, scale down `headline-xl` to 36px and `headline-lg` to 28px to prevent awkward text wrapping on mobile devices.

## Layout & Spacing

The layout model marries editorial storytelling with Swiss-grid logistical clarity. 

- **Grid System:** A 12-column fluid grid system governs desktop layouts, transitioning to a flexible single- or dual-column layout on mobile. Content respects a max-width container of 1280px to maintain comfortable reading measures.
- **Rhythm:** Spacing follows an 8px base unit system. Generous margins and gutters (`24px` gutters, `32px` outer margins) allow content to breathe, evoking the layout of a high-end travel magazine.
- **Breakpoints:** Mobile (< 768px) uses 16px margins; Tablet (768px – 1024px) uses 24px margins; Desktop (> 1024px) uses 32px margins with explicit grid alignment for itineraries, booking cards, and destination guides.

## Elevation & Depth

Depth is handled with a delicate touch, avoiding heavy drop shadows in favor of soft, atmospheric layering that keeps the interface feeling light and tactile in a dark mode context.

- **Ambient Shadows:** Cards and floating action elements utilize ultra-diffused, low-opacity shadows tinted with deep slate undertones (`0px 10px 30px -10px rgba(30, 41, 59, 0.08)`). This creates a gentle lift off the dark background.
- **Surface Layering:** Hierarchy is further reinforced through tonal grouping—resting content on elevated dark surfaces layered directly over the background canvas.

## Shapes

The shape language is friendly, approachable, and intentionally soft. 

- **Corner Radii:** Standard UI elements (buttons, inputs, cards) use a `0.5rem` (8px) border radius for base components, scaling up to `1rem` (16px) for large content cards and feature containers. 
- **Purpose:** This rounded geometry softens the rigorous Swiss grid, making complex travel itineraries, booking modules, and family checklists feel inviting and stress-free.

## Components

Components marry joyful family-friendly aesthetics with robust functional clarity.

- **Buttons:** Primary buttons feature solid Terracotta (`#D97757`) backgrounds, soft rounded corners, and clear medium-weight labels in white. Secondary buttons use ghost styling with Deep Slate borders or soft sage green fills.
- **Chips & Tags:** Pill-shaped (`rounded-xl` or fully rounded) indicator badges used for travel categories, age recommendations, and flight statuses. They use soft pastel variants of the sage and terracotta accents.
- **Lists & Itineraries:** Structured with clean Swiss-grid alignment, featuring subtle divider lines in low-opacity slate, clear timeline markers, and ample touch targets for mobile itinerary management.
- **Checkboxes & Radio Buttons:** Softly rounded squares with high-contrast checkmarks in terracotta, designed for packing lists and family activity selections.
- **Input Fields:** Generously padded text inputs with dark surfaces, subtle slate outlines, and clear floating labels that reassure users during multi-step booking flows.
- **Cards:** Destination and itinerary cards feature dark surfaces atop the canvas background, soft ambient shadows, generous internal padding, and prominent image slots with rounded top corners.
- **Specialized Components:** 
  - *Family Member Selector:* Horizontal avatar stacks to assign activities to specific family members.
  - *Logistics Timeline:* Vertical step-by-step progress trackers for travel days, blending editorial imagery with precise time stamps.