import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  Sparkles,
  Palette,
  Layers,
  Package,
  Cpu,
  Layout as LayoutIcon,
  Zap,
  ArrowRight,
  ChevronRight,
  Presentation,
} from 'lucide-react';

/* ─── HERO ─────────────────────────────────────────────── */

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="hp-hero">
      <div className="hp-heroMesh" aria-hidden="true" />
      <div className="hp-heroOrb" aria-hidden="true" />
      <div className="container">
        <div className="hp-heroChip">
          <span className="hp-chipDot" />
          Claude AI Skill
        </div>
        <Heading as="h1" className="hp-heroTitle">
          {siteConfig.title}
        </Heading>
        <p className="hp-heroTagline">{siteConfig.tagline}</p>
        <p className="hp-heroBody">
          Create stunning, self-contained HTML presentations with glassmorphism
          design — 12 color themes, 4 style profiles, and 20+ components. No
          installs, no dependencies, just beautiful slides powered by Claude AI.
        </p>
        <div className="hp-heroCta">
          <Link className="hp-ctaPrimary" to="/docs/installation">
            Get Started
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
          <Link className="hp-ctaSecondary" to="/docs/samples">
            View Samples
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── DATA ──────────────────────────────────────────────── */

const pillars = [
  {
    Icon: Palette,
    title: '12 Themes × 4 Profiles',
    description:
      '48 design combinations out of the box — mesh, cyan, emerald, rose, cisco, and more. Switch at runtime or lock in your brand.',
    link: '/docs/samples',
    accent: '#f97316',
  },
  {
    Icon: Layers,
    title: '20+ Components',
    description:
      'Cards, stats, timelines, terminals, charts, math equations, syntax-highlighted code, animated diagrams, and more.',
    link: '/docs/samples',
    accent: '#fb923c',
  },
  {
    Icon: Package,
    title: 'Self-Contained Output',
    description:
      'Every presentation is a single HTML file with all CSS and JS embedded. Share anywhere — no server, no dependencies.',
    link: '/docs/samples',
    accent: '#fbbf24',
  },
];

const highlights = [
  {
    Icon: Sparkles,
    title: 'Glassmorphism Design',
    description:
      'Frosted-glass aesthetic with animated mesh backgrounds, gradient accents, and glow effects.',
    link: '/docs/samples',
  },
  {
    Icon: Cpu,
    title: 'AI-Powered',
    description:
      'Describe your presentation in plain language — Claude generates the slides, applies the theme, and assembles the HTML.',
    link: '/docs/installation',
  },
  {
    Icon: LayoutIcon,
    title: 'Fragment Animations',
    description:
      'Incremental reveal with fade, grow, shrink, and highlight effects. Slide transitions: fade, slide, zoom.',
    link: '/docs/samples',
  },
  {
    Icon: Zap,
    title: 'Custom CSS Overrides',
    description:
      'Override any theme style per-presentation without touching framework files. Extend or replace at will.',
    link: '/docs/samples',
  },
];

/* ─── CARDS ─────────────────────────────────────────────── */

function PillarCard({Icon, title, description, link, accent}) {
  return (
    <Link
      to={link}
      className="hp-pillarCard"
      style={{'--accent': accent, '--accent-dim': `${accent}18`, '--accent-mid': `${accent}30`}}
    >
      <div className="hp-pillarIconWrap">
        <Icon size={24} strokeWidth={1.8} color={accent} />
      </div>
      <Heading as="h3" className="hp-pillarTitle">{title}</Heading>
      <p className="hp-pillarDesc">{description}</p>
      <span className="hp-pillarLink">
        Explore <ArrowRight size={14} strokeWidth={2} />
      </span>
    </Link>
  );
}

function HighlightCard({Icon, title, description, link}) {
  return (
    <Link to={link} className="hp-hlCard">
      <div className="hp-hlIconWrap">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="hp-hlContent">
        <Heading as="h4" className="hp-hlTitle">{title}</Heading>
        <p className="hp-hlDesc">{description}</p>
      </div>
      <ChevronRight size={16} className="hp-hlChevron" />
    </Link>
  );
}

/* ─── BANNER ────────────────────────────────────────────── */

function Banner() {
  return (
    <section className="hp-bannerSection">
      <div className="container">
        <div className="hp-bannerCard">
          <div className="hp-bannerLeft">
            <span className="hp-bannerBadge">
              <Presentation size={24} strokeWidth={1.8} />
            </span>
          </div>
          <div className="hp-bannerRight">
            <Heading as="h2" className="hp-bannerTitle">
              See It In Action
            </Heading>
            <p className="hp-bannerBody">
              Browse 9 live sample presentations — from corporate reviews to AI
              lectures and creative portfolios. Every presentation is a fully
              self-contained HTML file you can open in any browser.
            </p>
            <Link className="hp-bannerLink" to="/docs/samples">
              View all samples
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PAGE ──────────────────────────────────────────────── */

export default function Home() {
  return (
    <Layout
      title="Home"
      description="AI-powered glassmorphism presentations for Claude. 12 themes, 4 profiles, 20+ components."
    >
      <HomepageHeader />
      <main>
        <section className="hp-pillarsSection">
          <div className="container">
            <div className="hp-sectionHeader">
              <Heading as="h2" className="hp-sectionTitle">
                Everything You Need
              </Heading>
              <p className="hp-sectionSub">
                Professional presentations with zero configuration
              </p>
            </div>
            <div className="hp-pillarsGrid">
              {pillars.map((p, i) => (
                <PillarCard key={i} {...p} />
              ))}
            </div>
          </div>
        </section>

        <Banner />

        <section className="hp-hlSection">
          <div className="container">
            <div className="hp-sectionHeader">
              <Heading as="h2" className="hp-sectionTitle">
                Built for Impact
              </Heading>
              <p className="hp-sectionSub">
                Features that make every presentation stand out
              </p>
            </div>
            <div className="hp-hlGrid">
              {highlights.map((h, i) => (
                <HighlightCard key={i} {...h} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
