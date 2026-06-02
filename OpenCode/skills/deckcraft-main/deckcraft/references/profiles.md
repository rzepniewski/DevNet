# DeckCraft Style Profiles

Style profiles control typography, spacing, borders, and effects independent of color themes. Combine any profile with any theme for 48 unique looks.

## Usage

Apply via body class alongside theme:
```html
<body class="theme-mesh profile-tech">
```

## Available Profiles

### Tech (Default)

**Visual Style:** Modern, bold, glassmorphism

**Best For:** Startups, tech companies, product launches, developer conferences, SaaS demos

**Key Characteristics:**
- Bold 800-900 weight headings with tight letter-spacing (-0.02em)
- Large border radius (16px-20px) for modern feel
- Glassmorphism effects with backdrop blur (20px)
- Generous whitespace (60px-80px slide padding)
- Glowing accent shadows
- Smooth 0.3s transitions

**Key CSS Variables:**
```css
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
--font-weight-h1: 900
--font-size-h1: 5rem
--border-radius-lg: 16px
--backdrop-blur: 20px
--shadow-glow: 0 0 15px var(--white-60)
--slide-padding: 60px 80px
```

---

### Corporate

**Visual Style:** Clean, professional, conservative

**Best For:** Business presentations, executive briefings, quarterly reviews, investor pitches, enterprise clients

**Key Characteristics:**
- Professional sans-serif typography with moderate 700 weight headings
- Tighter spacing for content density (50px-60px slide padding)
- Smaller border radius (6px-10px) for professional look
- No glassmorphism/blur effects - solid backgrounds
- Subtle shadows with minimal depth
- Fast, muted 0.2s transitions

**Key CSS Variables:**
```css
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-weight-heading: 700
--font-size-h1: 4.5rem
--border-radius-lg: 8px
--backdrop-blur: 0px
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.1)
--slide-padding: 50px 60px
```

---

### Academic

**Visual Style:** Minimal, content-focused, readable

**Best For:** Research presentations, lectures, educational content, conference talks, scientific papers

**Key Characteristics:**
- Serif typography (Georgia/Charter) for scholarly appearance
- Larger body text (1.4rem) with generous line height (1.8) for readability
- Minimal border radius (2px-4px) - nearly rectangular
- No decorative effects - no shadows, no blur, no glow
- Simple borders instead of shadows for visual hierarchy
- Print-friendly with dedicated print styles
- Instant 0.15s transitions

**Key CSS Variables:**
```css
--font-heading: 'Georgia', 'Times New Roman', serif
--font-body: 'Charter', 'Georgia', 'Times New Roman', serif
--font-size-body: 1.4rem
--line-height-body: 1.8
--border-radius-lg: 4px
--backdrop-blur: 0px
--shadow-card: none
--slide-padding: 40px 60px
```

---

### Creative

**Visual Style:** Artistic, expressive, unconventional

**Best For:** Design portfolios, creative pitches, artistic presentations, brand reveals, agency work

**Key Characteristics:**
- Display serif headings (Playfair Display) with dramatic 6rem h1 size
- Very tight heading letter-spacing (-0.04em) for impact
- Mixed border radius - sharp corners meet dramatic curves (up to 40px)
- Strong glassmorphism with heavy blur (35px)
- Pronounced layered shadows with depth
- Bouncy, expressive cubic-bezier transitions
- Very generous spacing (80px-100px slide padding)
- Wide uppercase letter-spacing (0.15em) for stylistic flair

**Key CSS Variables:**
```css
--font-heading: 'Playfair Display', 'Georgia', serif
--font-body: 'Poppins', 'Inter', sans-serif
--font-size-h1: 6rem
--letter-spacing-heading: -0.04em
--border-radius-xl: 40px
--backdrop-blur: 35px
--shadow-card: 0 30px 60px var(--black-40), 0 10px 20px var(--black-20)
--transition-default: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
--slide-padding: 80px 100px
```

---

## Profile Comparison

| Feature | Tech | Corporate | Academic | Creative |
|---------|------|-----------|----------|----------|
| Heading Font | Sans-serif | Sans-serif | Serif | Display Serif |
| H1 Size | 5rem | 4.5rem | 4rem | 6rem |
| Border Radius | 16px | 8px | 4px | 40px |
| Blur Effects | Yes (20px) | No | No | Yes (35px) |
| Shadows | Glowing | Subtle | None | Dramatic |
| Transitions | 0.3s smooth | 0.2s fast | 0.15s instant | 0.4s bouncy |
| Best Content | Dense | Content-heavy | Text-heavy | Visual-heavy |

## Recommended Pairings

| Theme | Best Profile | Why |
|-------|-------------|-----|
| `theme-cisco` | `corporate` | Clean typography complements Cisco's professional dark navy + gradient glow aesthetic. The solid backgrounds and moderate spacing let the per-slide glow effects shine without competing glassmorphism. |
| `theme-cisco` | `tech` | Glassmorphism cards and bold headings work well for technical demos and product showcases on the Cisco dark background. |

## Customization

To create a custom profile, copy an existing profile and modify the CSS variables:

```css
/* lib/profiles/custom.css */
.profile-custom {
  /* Start with tech defaults, then override */

  /* Typography */
  --font-heading: 'Your Font', sans-serif;
  --font-weight-h1: 800;
  --font-size-h1: 5rem;

  /* Spacing */
  --slide-padding: 60px 80px;
  --card-padding: 2rem;

  /* Borders */
  --border-radius-lg: 16px;

  /* Effects */
  --backdrop-blur: 20px;
  --shadow-card: 0 20px 40px var(--black-30);
  --transition-default: all 0.3s ease;
}
```

Create your custom profile in `lib/profiles/` and reference it in your presentation's config.json with `"defaultProfile": "custom"`.
