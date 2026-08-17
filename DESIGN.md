# Vestra — Design Brief

**Tone:** Private Milan showroom—whisper luxury, not noise. Editorial sophistication, mysterious exclusivity.  
**Mood:** Old-world fashion meets new-world technology. Quiet confidence, premium materials, timeless elegance.  
**Differentiation:** Verified badge language + Digital Passport visual identity + Gold accent used sparingly as trust signal.

## Color Palette

| Token | OKLCH | Hex | Use |
|-------|-------|-----|-----|
| Background | 0.06 0 0 | #0F0F12 | Page background |
| Card | 0.11 0 0 | #1A1A1F | Card surfaces |
| Text Primary | 0.95 0 0 | #F5F3EF | Editorial white |
| Text Secondary | 0.55 0 0 | #6B6B74 | Secondary text |
| Accent (Gold) | 0.70 0.08 79 | #C4A97D | Buttons, badges |
| Verified | N/A | #2ECC8E | Verification badge |
| Border | 0.18 0 0 | rgba(255,255,255,0.08) | Dividers |
| Glass | N/A | rgba(255,255,255,0.035) | Glassmorphism |

## Typography

| Scale | Font | Size | Use |
|-------|------|------|-----|
| Editorial | Playfair Display | clamp(3.5rem, 6vw, 7rem) | Hero titles |
| H1 | Playfair Display | clamp(2.2rem, 4vw, 4rem) | Section headings |
| H2 | Playfair Display | clamp(1.6rem, 2.5vw, 2.5rem) | Subheadings |
| H3 | Playfair Display | 1.25rem | Card titles |
| Body | DM Sans | 1rem / 1.75 lh | Content text |
| Small | DM Sans | 0.875rem | Secondary copy |
| Label | DM Sans | 0.7rem uppercase | Tags, labels |
| Mono | JetBrains Mono | 0.875rem | Item IDs, codes |

## Structural Zones

| Zone | Background | Border | Treatment |
|------|------------|--------|----------|
| Header/Nav | Glass + blur | Subtle divider | Fixed, minimal |
| Hero | Pure black | None | Full-bleed image |
| Cards | vestra-graphite | rgba(255,255,255,0.08) | Hover glow |
| Footer | vestra-graphite | Top divider | Same weight |
| Modal | Glassmorphism | Gold accent | Centered entry |

## Motion & Animation

- **Page load:** Stagger in 80ms increments, opacity 0→1 + translateY(20px)→0
- **Card hover:** translateY(-3px) + gold border transition
- **Button press:** scale(0.97) spring-like return
- **Modal entry:** slideUp + fadeIn 500ms
- **Easing:** Luxury cubic-bezier(0.25, 0.46, 0.45, 0.94), Reveal cubic-bezier(0.16, 1, 0.3, 1)
- **Duration:** Micro 150ms, Base 350ms, Panel 500ms, Page 800ms

## Shared Components

- **Verified Badge:** Green pill with checkmark, mono font
- **Item Card:** 3/4 aspect ratio, hover scale(1.04), gradient overlay
- **NavBar:** Fixed top, glassmorphism, Playfair wordmark + nav links + icons
- **Digital Passport:** Physical card visual, holographic shimmer hover

## Constraints

- No bounce or elastic easing—composed, not playful
- Never animate >3 properties simultaneously
- Gold sparingly—accents, badges, CTAs only
- All images lazy-load + skeleton shimmer
- Card hover ≤-4px
- Text contrast minimum AA+ (L diff ≥0.7)

## Key Details

- Pure editorial black (#08080A) creates void depth
- Warm white (#F5F3EF) prevents cold feeling
- Gold (#C4A97D) positions as trust signal
- Glassmorphism reserved for overlays + nav
- Verified green (#2ECC8E) signals digital authenticity
