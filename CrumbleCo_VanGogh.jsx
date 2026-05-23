import { useState } from "react";

// ── Palette Tokens ───────────────────────────────────────────────────────────
const M  = "#080E1E";   // Midnight (deepest bg)
const P  = "#0F1E3A";   // Prussian Blue
const DB = "#162449";   // Deep Blue
const IN = "#1E2F5C";   // Indigo Blue
const G1 = "#DAA520";   // Goldenrod
const G2 = "#E8B84B";   // Amber
const G3 = "#F5D98A";   // Pale Amber
const CR = "#F2E8C9";   // Cream
const SK = "#5BA3C9";   // Sky Blue
const EM = "#2E7D5C";   // Emerald
const OR = "#C1440E";   // Burnt Orange

// ── Local images (public/images) ─────────────────────────────────────────────
const IMG = {
  branded:        "/images/branded-bakes.jpeg",
  brookiesTray:   "/images/brookies-tray.jpeg",
  banoffeeRustic: "/images/banoffee-rustic.jpeg",
  banoffeePlate:  "/images/banoffee-plate.jpeg",
  banoffeePie:    "/images/banoffee-pie.jpeg",
  brookieSkillet: "/images/brookie-skillet.jpeg",
  brookiesStack:  "/images/brookies-stack.jpeg",
  brownies:       "/images/brownies.jpeg",
};

// ── Styles ───────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${M}; }

  .fd { font-family: 'Cinzel', serif; }
  .fb { font-family: 'Crimson Text', serif; }

  @keyframes float    { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
  @keyframes spin     { from{transform:rotate(0deg)}       to{transform:rotate(360deg)} }
  @keyframes fadein   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes twinkle  { 0%,100%{opacity:.15;transform:scale(.55)} 50%{opacity:.95;transform:scale(1.1)} }
  @keyframes ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes pulse-g  { 0%,100%{box-shadow:0 0 10px rgba(218,165,32,.25)} 50%{box-shadow:0 0 30px rgba(218,165,32,.55)} }

  .float       { animation: float 4s ease-in-out infinite; }
  .spin-slow   { animation: spin  12s linear infinite; }
  .fadein      { animation: fadein .6s ease forwards; }
  .ticker-rail { display:flex; width:max-content; animation: ticker 26s linear infinite; }

  .card-hover { transition: transform .25s ease, box-shadow .25s ease; }
  .card-hover:hover { transform:translateY(-5px); box-shadow:0 20px 52px rgba(218,165,32,.14), 0 0 0 1px rgba(218,165,32,.18); }

  .btn-p { transition: transform .15s ease, box-shadow .2s ease; }
  .btn-p:hover { transform:scale(1.04); box-shadow:0 0 28px rgba(218,165,32,.5); }

  .chip { transition: all .2s ease; cursor:pointer; }
  .chip:hover { transform:scale(1.06); }

  .scrollbar-hide::-webkit-scrollbar { display:none; }
  .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }

  .star { position:absolute; border-radius:50%;
          animation: twinkle var(--d,3s) ease-in-out infinite var(--dl,0s); }

  /* Painterly swirl overlay on section */
  .swirl-section {
    position: relative;
    background:
      conic-gradient(from 210deg at 18% 35%, rgba(55,202,229,.06) 0deg, transparent 55deg),
      conic-gradient(from 40deg at 82% 28%, rgba(245,219,55,.08) 0deg, transparent 48deg),
      radial-gradient(ellipse 120% 80% at 8% 18%, rgba(91,163,201,.14) 0%, transparent 52%),
      radial-gradient(ellipse 90% 70% at 92% 8%, rgba(218,165,32,.12) 0%, transparent 46%),
      radial-gradient(ellipse 100% 90% at 72% 88%, rgba(47,55,116,.45) 0%, transparent 58%),
      radial-gradient(ellipse 80% 60% at 20% 85%, rgba(91,163,201,.08) 0%, transparent 42%),
      radial-gradient(ellipse 55% 45% at 50% 50%, rgba(30,47,92,.25) 0%, transparent 70%),
      ${M};
  }

  .canvas-grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 9998;
    opacity: .045; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  @keyframes swirl-drift {
    0%,100% { transform: translate(0,0) rotate(0deg); opacity:.55; }
    50%      { transform: translate(14px,-10px) rotate(3deg); opacity:.75; }
  }
  @keyframes moon-pulse {
    0%,100% { box-shadow: 0 0 40px rgba(245,217,138,.35), 0 0 80px rgba(218,165,32,.15); }
    50%     { box-shadow: 0 0 55px rgba(245,217,138,.5), 0 0 100px rgba(218,165,32,.25); }
  }

  .swirl-drift  { animation: swirl-drift 22s ease-in-out infinite; }
  .moon-glow    { animation: moon-pulse 5s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .float, .spin-slow, .star, .ticker-rail, .swirl-drift, .moon-glow, .hero-sky-shift { animation: none !important; }
  }

  /* Hero card — impasto sky inside the main panel */
  .hero-card {
    position: relative;
    overflow: hidden;
    background:
      conic-gradient(from 200deg at 12% 55%, rgba(55,202,229,.2) 0deg, transparent 72deg),
      conic-gradient(from 35deg at 88% 22%, rgba(245,219,55,.18) 0deg, transparent 68deg),
      conic-gradient(from 120deg at 55% 88%, rgba(47,55,116,.35) 0deg, transparent 55deg),
      radial-gradient(ellipse 95% 75% at 6% 18%, rgba(91,163,201,.28) 0%, transparent 58%),
      radial-gradient(ellipse 85% 65% at 98% 8%, rgba(218,165,32,.22) 0%, transparent 52%),
      radial-gradient(ellipse 75% 85% at 78% 95%, rgba(47,55,116,.55) 0%, transparent 62%),
      radial-gradient(ellipse 55% 45% at 42% 42%, rgba(30,47,92,.4) 0%, transparent 65%),
      linear-gradient(148deg, ${P} 0%, #123F77 32%, ${DB} 58%, #0D2040 100%);
    background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%;
    border: 1px solid rgba(218,165,32,.22);
    box-shadow:
      inset 0 1px 0 rgba(245,217,138,.12),
      inset 0 0 100px rgba(91,163,201,.1),
      inset 0 -60px 80px rgba(218,165,32,.07),
      0 28px 72px rgba(8,14,30,.55);
  }
  .hero-card::after {
    content: '';
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    opacity: .06; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 140px 140px;
  }
  .hero-sky-shift {
    animation: hero-sky-shift 16s ease-in-out infinite;
  }
  @keyframes hero-sky-shift {
    0%,100% { opacity: .85; transform: scale(1) translate(0,0); }
    50%     { opacity: 1; transform: scale(1.03) translate(-8px,6px); }
  }

  .featured-card {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse 80% 60% at 0% 50%, rgba(91,163,201,.15) 0%, transparent 55%),
      radial-gradient(ellipse 70% 50% at 100% 30%, rgba(218,165,32,.12) 0%, transparent 50%),
      linear-gradient(135deg, ${P} 0%, ${DB} 60%, #123F77 100%);
    border: 1px solid rgba(218,165,32,.25) !important;
    box-shadow: inset 0 0 40px rgba(91,163,201,.08), 0 8px 28px rgba(8,14,30,.35);
  }
  .featured-card::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    opacity: .05; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 100px 100px;
  }
  .delight-photo {
    position: relative;
    overflow: hidden;
    background:
      conic-gradient(from 200deg at 80% 20%, rgba(245,219,55,.1) 0deg, transparent 50deg),
      radial-gradient(ellipse at 30% 80%, rgba(91,163,201,.2) 0%, transparent 55%),
      linear-gradient(135deg, ${DB}, #123F77 50%, ${P} 100%) !important;
    box-shadow: inset 0 0 50px rgba(218,165,32,.08), 0 12px 40px rgba(8,14,30,.4);
  }

  /* Ghost hover for footer & nav links */
  .ghost-link { color:rgba(242,232,201,.55); text-decoration:none; transition:color .2s; }
  .ghost-link:hover { color:${G1}; }

  /* Add-to-cart fill on hover */
  .add-btn { background:transparent; border:1.5px solid ${G1}; color:${G1};
             border-radius:50px; padding:8px 18px; font-size:10px; font-weight:600;
             cursor:pointer; text-transform:uppercase; letter-spacing:.06em;
             font-family:'Cinzel',serif; transition:all .2s ease; }
  .add-btn:hover { background:${G1}; color:${M}; }

  /* Animated gold rule */
  .gold-rule { height:1px; background:linear-gradient(90deg,transparent,rgba(218,165,32,.45),transparent); }

  /* Nav link */
  .nav-lnk { color:rgba(242,232,201,.68); text-decoration:none; font-weight:600;
             font-size:11px; letter-spacing:.1em; text-transform:uppercase;
             font-family:'Cinzel',serif; transition:color .2s; }
  .nav-lnk:hover { color:${G1}; }

  /* ── Responsive layout helpers ─────────────────────────────────────────── */
  img { max-width: 100%; height: auto; display: block; }

  .section-pad { padding-left: 40px; padding-right: 40px; }
  .nav-pad     { padding: 16px 40px; }
  .announce-pad{ padding: 8px 32px; }

  .hero-grid, .split-grid, .story-grid, .art-grid {
    display: grid; gap: 40px; align-items: center;
  }
  .hero-grid  { grid-template-columns: 1fr 1fr; align-items: end; }
  .split-grid { grid-template-columns: 1fr 1.2fr; }
  .story-grid { grid-template-columns: 1fr 1fr; gap: 64px; }
  .art-grid   { grid-template-columns: 1fr 1fr; gap: 48px; }
  .why-grid   { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .footer-grid{ display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; position: relative; z-index: 1; }

  .section-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; }
  .newsletter-row { display: flex; justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap; }
  .stats-row { display: flex; gap: 36px; flex-wrap: wrap; }
  .nav-links { display: flex; gap: 36px; align-items: center; }
  .nav-actions { display: flex; gap: 12px; align-items: center; }

  .mobile-menu-btn { display: none; background: transparent; border: 1px solid rgba(218,165,32,.3);
                     color: ${G1}; width: 40px; height: 40px; border-radius: 10px;
                     cursor: pointer; align-items: center; justify-content: center; font-size: 18px; }

  .mobile-menu-panel { display: none; }
  .mobile-menu-panel.open {
    display: flex; flex-direction: column; gap: 18px;
    position: absolute; top: 100%; left: 0; right: 0;
    background: rgba(8,14,30,.98); backdrop-filter: blur(18px);
    padding: 24px 24px 32px; border-bottom: 1px solid rgba(218,165,32,.15);
  }
  .mobile-menu-panel a { font-size: 14px; padding: 8px 0; }

  .hero-image-wrap { max-width: 380px; width: 100%; position: relative; }
  .hero-photo { width: 100%; max-width: 380px; height: 340px; }
  .hero-badge { position: absolute; bottom: 20px; right: -10px; }
  .stats-num   { font-size: 30px; }
  .stats-label { font-size: 9px; }

  /* Products grid is fluid via auto-fill; ensure min on mobile */

  /* Tablet (≤ 1024px) */
  @media (max-width: 1024px) {
    .why-grid    { grid-template-columns: repeat(2, 1fr); }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .story-grid  { gap: 40px; }
    .art-grid    { gap: 32px; }
  }

  /* Mobile (≤ 768px) */
  @media (max-width: 768px) {
    .section-pad  { padding-left: 20px; padding-right: 20px; }
    .nav-pad      { padding: 14px 20px; }
    .announce-pad { padding: 10px 20px; gap: 6px 14px; justify-content: center; }
    .announce-pad span { font-size: 10px !important; }

    .hero-grid, .split-grid, .story-grid, .art-grid {
      grid-template-columns: 1fr; gap: 32px;
    }
    .hero-grid  { align-items: start; }
    .footer-grid{ grid-template-columns: 1fr; gap: 32px; margin-bottom: 32px; }

    .section-head { flex-direction: column; align-items: flex-start; }
    .newsletter-row { flex-direction: column; align-items: stretch; }
    .stats-row { gap: 20px; justify-content: space-between; width: 100%; }
    .stats-num   { font-size: 26px !important; }
    .stats-label { font-size: 8px !important; }

    .nav-links, .nav-cta-desktop { display: none; }
    .mobile-menu-btn { display: inline-flex; }
    .crunchy-tag, .delight-cookie { display: none !important; }

    .hero-card       { padding: 32px 20px 32px !important; border-radius: 20px !important; min-height: auto !important; }
    .hero-section    { padding: 16px 16px 32px !important; }
    .hero-image-wrap { margin: 12px auto 0 !important; padding-bottom: 12px; }
    .hero-photo      { height: 260px !important; border-radius: 16px !important; border-bottom: 1px solid rgba(218,165,32,.28) !important; }
    .hero-badge {
      position: static !important;
      margin: -28px auto 0 !important;
      right: auto !important; bottom: auto !important;
      padding: 10px 14px !important;
      align-self: center;
      width: max-content;
      max-width: calc(100% - 32px);
    }
    .hero-badge img  { width: 44px !important; height: 44px !important; }
    .hero-cta-row    { flex-wrap: wrap; gap: 12px !important; margin-bottom: 8px !important; }

    .delight-photo   { height: 240px !important; }
    .delight-stamp   { display: none !important; }
    .featured-card   { max-width: 100% !important; }

    .why-grid { grid-template-columns: 1fr; gap: 16px; }
    .why-card { padding: 24px 20px !important; }

    .art-card { padding: 32px 24px !important; border-radius: 20px !important; }
    .art-photo { height: 220px !important; }

    .newsletter-card { padding: 32px 24px !important; border-radius: 20px !important; }
    .newsletter-input-wrap { width: 100%; flex-direction: row; }
    .newsletter-input-wrap input { flex: 1; width: auto !important; min-width: 0; }

    .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }

    .story-images { gap: 12px !important; }
    .story-images > div { margin-top: 0 !important; height: 160px !important; }

    .ticker-rail { animation-duration: 18s; }
    .ticker-item { font-size: 11px !important; padding-right: 32px !important; }

    /* Tap targets ≥ 44px */
    .add-btn { padding: 10px 18px; }
    .chip    { padding: 10px 14px; min-height: 40px; }
    .btn-p   { min-height: 44px; }

    .pad-mobile { padding: 32px 0 !important; }
  }

  /* Small mobile (≤ 480px) */
  @media (max-width: 480px) {
    .section-pad  { padding-left: 16px; padding-right: 16px; }
    .nav-pad      { padding: 12px 16px; }
    .brand-text   { font-size: 20px !important; }
    .hero-card    { padding: 24px 16px 24px !important; }
    .hero-photo   { height: 220px !important; }
    .crunchy-tag  { display: none !important; }
    .tasty-tag    { font-size: .4em !important; padding: 2px 12px !important; }
    .stats-num    { font-size: 22px !important; }
    .stats-row    { gap: 14px; }
    .story-images > div { height: 140px !important; }
    .announce-pad span:nth-child(3) { display: none; }
  }
`;

// ── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label:"All",       count:128, color:G1,  bg:DB },
  { label:"Cookies",   count:32,  color:CR,  bg:IN },
  { label:"Cake",      count:27,  color:CR,  bg:"#0D2D40" },
  { label:"Croissant", count:21,  color:M,   bg:G1 },
  { label:"Bagel",     count:23,  color:CR,  bg:OR },
  { label:"Pastries",  count:27,  color:CR,  bg:DB },
  { label:"Bretzel",   count:18,  color:G3,  bg:"#2A3B72" },
];

const PRODUCTS = [
  { name:"Brookies",            tag:"Fan Favorite",    bg:DB,        img:IMG.brookiesTray,   desc:"Brownie and cookie swirled into one fudgy square." },
  { name:"Brookie Skillet",     tag:"Best Seller",     bg:IN,        img:IMG.brookieSkillet, desc:"Shareable cast-iron brookie baked fresh to order." },
  { name:"Banoffee Pie",        tag:"Weekend Special", bg:"#0D2D40", img:IMG.banoffeePlate,  desc:"Banana, caramel, whipped cream, and chocolate shavings." },
  { name:"Chocolate Chip Loaf", tag:"Homemade",        bg:"#1A2048", img:IMG.branded,        desc:"Moist loaf loaded with dark chocolate chunks." },
  { name:"Brookies Stack",      tag:"Daily Fresh",     bg:P,         img:IMG.brookiesStack,  desc:"Layered brookie squares — crisp top, fudgy center." },
  { name:"Fudge Brownies",      tag:"Classic",         bg:DB,        img:IMG.brownies,       desc:"Dense, chocolatey squares with a crackly top." },
];

const WHY_ITEMS = [
  { icon:"🌾", title:"Stone-Ground Flour",  body:"We source heritage wheat from local farms milled fresh every week.",                          bg:M,   tc:CR, bc:G1 },
  { icon:"🧈", title:"Real Butter Always",  body:"Zero shortcuts. Every laminated dough uses European-style 84% fat butter.",                   bg:G1,  tc:M,  bc:G1 },
  { icon:"🔥", title:"Wood-Fired Oven",     body:"Our stone-deck oven runs at 480 °C for that perfect crackle crust.",                          bg:P,   tc:SK, bc:SK },
  { icon:"📦", title:"Same-Day Fresh",      body:"Baked before 6 AM. On your table before it even gets a chance to cool.",                      bg:DB,  tc:CR, bc:G2 },
];

// ── Star field helper ─────────────────────────────────────────────────────────
const STAR_DEFS = [
  { top:"7%",  left:"11%", sz:3, d:"2.6s", dl:"0s"   },
  { top:"14%", left:"76%", sz:2, d:"3.8s", dl:"0.7s" },
  { top:"24%", left:"44%", sz:4, d:"4.1s", dl:"1.3s" },
  { top:"4%",  left:"59%", sz:2, d:"3.1s", dl:"0.3s" },
  { top:"38%", left:"89%", sz:3, d:"2.9s", dl:"1.9s" },
  { top:"58%", left:"6%",  sz:2, d:"4.4s", dl:"0.5s" },
  { top:"73%", left:"68%", sz:3, d:"3.3s", dl:"2.1s" },
  { top:"88%", left:"31%", sz:2, d:"2.8s", dl:"0.9s" },
  { top:"33%", left:"22%", sz:2, d:"3.9s", dl:"1.6s" },
  { top:"19%", left:"87%", sz:3, d:"3.4s", dl:"0.4s" },
  { top:"50%", left:"52%", sz:2, d:"4.6s", dl:"1.1s" },
  { top:"65%", left:"38%", sz:3, d:"3.0s", dl:"2.4s" },
];

const StarField = () => (
  <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
    {STAR_DEFS.map((s, i) => (
      <div key={i} className="star" style={{
        top:s.top, left:s.left, width:s.sz, height:s.sz,
        background: i % 3 === 0 ? G3 : i % 3 === 1 ? SK : CR,
        "--d":s.d, "--dl":s.dl,
      }} />
    ))}
  </div>
);

/** Van Gogh spiral strokes — echo Starry Night whorls */
const SwirlMotifs = ({ opacity = 0.22 }) => (
  <svg
    className="swirl-drift"
    aria-hidden
    style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0, opacity }}
    viewBox="0 0 1200 600"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="swirl-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={G2} stopOpacity="0.9" />
        <stop offset="100%" stopColor={G1} stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="swirl-sky" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={SK} stopOpacity="0.7" />
        <stop offset="100%" stopColor="#37CAE5" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <path d="M180,120 Q240,80 300,130 T420,150 T520,100" fill="none" stroke="url(#swirl-sky)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
    <path d="M900,80 Q960,40 1020,90 T1140,110" fill="none" stroke="url(#swirl-gold)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M60,380 Q120,340 200,400 T360,420 T480,360" fill="none" stroke="url(#swirl-sky)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <path d="M700,420 Q780,360 860,430 T1000,450 T1100,380" fill="none" stroke="url(#swirl-gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
    <circle cx="1050" cy="90" r="28" fill="none" stroke="url(#swirl-gold)" strokeWidth="1.8" opacity="0.5" />
    <circle cx="1050" cy="90" r="18" fill="none" stroke="url(#swirl-gold)" strokeWidth="1.2" opacity="0.35" />
    <circle cx="140" cy="200" r="22" fill="none" stroke="url(#swirl-sky)" strokeWidth="1.5" opacity="0.45" />
  </svg>
);

/** Crescent moon + halo — iconic Starry Night motif */
const MoonHalo = ({ top = "12%", right = "8%" }) => (
  <div
    className="moon-glow"
    aria-hidden
    style={{
      position:"absolute", top, right, width:72, height:72, borderRadius:"50%",
      background:`radial-gradient(circle at 35% 35%, ${G3} 0%, ${G1} 45%, transparent 70%)`,
      boxShadow:`0 0 40px rgba(245,217,138,.35)`,
      pointerEvents:"none", zIndex:0,
    }}
  >
    <div style={{
      position:"absolute", top:4, left:18, width:56, height:56, borderRadius:"50%",
      background:M, boxShadow:`inset -8px 0 12px rgba(8,14,30,.6)`,
    }} />
  </div>
);

/** Cypress-like silhouette for section footers */
const CypressSilhouette = () => (
  <svg
    aria-hidden
    style={{ position:"absolute", bottom:0, left:"4%", width:90, height:140, pointerEvents:"none", zIndex:0, opacity:.35 }}
    viewBox="0 0 90 140"
  >
    <path
      d="M45,8 C38,40 28,70 32,100 C34,115 40,128 45,135 C50,128 56,115 58,100 C62,70 52,40 45,8 Z"
      fill={EM}
    />
    <path d="M45,135 L45,140" stroke={EM} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const CanvasGrain = () => <div className="canvas-grain" aria-hidden />;

/** Painterly layers scoped inside the hero card */
const HeroCardPaint = () => (
  <>
    <div className="hero-sky-shift" aria-hidden style={{
      position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
      background:`
        radial-gradient(ellipse 45% 35% at 72% 28%, rgba(245,219,55,.14) 0%, transparent 70%),
        radial-gradient(ellipse 50% 40% at 18% 72%, rgba(55,202,229,.1) 0%, transparent 68%)`,
    }} />
    <svg
      aria-hidden
      className="swirl-drift"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0, opacity:.35 }}
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hero-swirl-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={G2} stopOpacity="0.6" />
          <stop offset="100%" stopColor={G1} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-swirl-blue" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={SK} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#37CAE5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M40,200 Q120,140 220,210 T400,230 T560,180" fill="none" stroke="url(#hero-swirl-blue)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M500,60 Q580,20 660,80 T760,100" fill="none" stroke="url(#hero-swirl-gold)" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M600,300 Q680,250 740,320 T800,340" fill="none" stroke="url(#hero-swirl-blue)" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
      <circle cx="680" cy="70" r="24" fill="none" stroke="url(#hero-swirl-gold)" strokeWidth="1.6" opacity="0.5" />
      <circle cx="680" cy="70" r="14" fill="none" stroke="url(#hero-swirl-gold)" strokeWidth="1" opacity="0.35" />
      <circle cx="120" cy="120" r="18" fill="none" stroke="url(#hero-swirl-blue)" strokeWidth="1.4" opacity="0.45" />
    </svg>
    {/* Brush-stroke blobs */}
    <div aria-hidden style={{
      position:"absolute", top:"-15%", right:"5%", width:"42%", height:"55%",
      borderRadius:"60% 40% 55% 45%", pointerEvents:"none", zIndex:0,
      background:`radial-gradient(ellipse at 50% 50%, rgba(218,165,32,.12) 0%, transparent 70%)`,
      transform:"rotate(-12deg)",
    }} />
    <div aria-hidden style={{
      position:"absolute", bottom:"-10%", left:"-5%", width:"50%", height:"45%",
      borderRadius:"45% 55% 40% 60%", pointerEvents:"none", zIndex:0,
      background:`radial-gradient(ellipse at 40% 60%, rgba(91,163,201,.15) 0%, transparent 72%)`,
      transform:"rotate(8deg)",
    }} />
    <MoonHalo top="6%" right="8%" />
    {STAR_DEFS.slice(0, 6).map((s, i) => (
      <div key={`hero-star-${i}`} className="star" style={{
        top:s.top, left:s.left, width:s.sz + 1, height:s.sz + 1,
        background: i % 2 === 0 ? G3 : SK,
        "--d":s.d, "--dl":s.dl, zIndex:0,
      }} />
    ))}
  </>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function KneadABreak() {
  const [active, setActive] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const NAV_LINKS = ["Cake","Bakery","About Us","Cookies","Contact"];

  const filtered = active === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(active.toLowerCase()) ||
        p.tag.toLowerCase().includes(active.toLowerCase())
      );

  return (
    <>
      <style>{style}</style>
      <CanvasGrain />
      <div className="fb swirl-section" style={{ color:CR, minHeight:"100vh" }}>

        {/* ── Announcement Bar ── */}
        <div className="announce-pad" style={{ background:P, borderBottom:`1px solid rgba(218,165,32,.2)`, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          {["✦  Fresh Baked Every Morning", "✦  Free Local Delivery", "✦  Subscribe for Weekly Treats"].map(t => (
            <span key={t} className="fd" style={{ color:G1, fontSize:11, fontWeight:600, letterSpacing:".1em" }}>{t}</span>
          ))}
        </div>

        {/* ── Navbar ── */}
        <nav className="nav-pad" style={{ background:"rgba(8,14,30,.92)", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100, borderBottom:"1px solid rgba(218,165,32,.12)", backdropFilter:"blur(18px)", flexWrap:"wrap" }}>
          <div className="fd brand-text" style={{ fontSize:24, letterSpacing:".08em", display:"flex", alignItems:"center", gap:4, color:CR }}>
            KNEAD A <span style={{ color:G1 }}>BREAK</span>
          </div>
          <div className="nav-links">
            {NAV_LINKS.map(l => (
              <a key={l} href="#" className="nav-lnk">{l}</a>
            ))}
          </div>
          <div className="nav-actions">
            <button className="btn-p fd nav-cta-desktop" style={{ background:G1, border:`2px solid ${G1}`, borderRadius:50, padding:"10px 24px", fontFamily:"'Cinzel',serif", fontSize:11, color:M, cursor:"pointer", letterSpacing:".08em", textTransform:"uppercase", fontWeight:700 }}>
              START BAKING
            </button>
            <button aria-label="Cart" style={{ width:38, height:38, border:`2px solid rgba(218,165,32,.28)`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16, background:P, color:CR }}>🛒</button>
            <button
              className="mobile-menu-btn fd"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
          <div className={`mobile-menu-panel ${menuOpen ? "open" : ""}`}>
            {NAV_LINKS.map(l => (
              <a key={l} href="#" className="nav-lnk" onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
            <button className="btn-p fd" style={{ background:G1, border:`2px solid ${G1}`, borderRadius:50, padding:"12px 24px", fontFamily:"'Cinzel',serif", fontSize:12, color:M, cursor:"pointer", letterSpacing:".08em", textTransform:"uppercase", fontWeight:700, marginTop:6 }}>
              START BAKING
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="section-pad hero-section" style={{ padding:"20px 40px 40px", position:"relative", overflow:"hidden" }}>
          <StarField />
          <SwirlMotifs opacity={0.18} />
          <div className="hero-card hero-grid" style={{
            borderRadius:24, padding:"48px 56px 0",
            minHeight:400,
            position:"relative", zIndex:1,
          }}>
            <HeroCardPaint />

            {/* Left */}
            <div style={{ position:"relative", zIndex:2 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ color:G1, fontSize:18 }}>✦</span>
                <span className="fd" style={{ fontWeight:600, fontSize:10, color:"rgba(242,232,201,.5)", textTransform:"uppercase", letterSpacing:".18em" }}>Est. 2025 · Lahore</span>
              </div>
              <div className="fd" style={{ fontSize:"clamp(42px,7vw,82px)", lineHeight:.92, color:CR, textTransform:"uppercase", letterSpacing:".015em" }}>
                BAKE{" "}
                <span className="tasty-tag" style={{ background:SK, color:M, borderRadius:40, padding:"2px 18px", fontSize:".5em", verticalAlign:"middle", display:"inline-block", transform:"rotate(-3deg)", marginBottom:4 }}>Tasty</span><br />
                THE<br />
                <span style={{ position:"relative", display:"inline-block", color:G1 }}>
                  COOKIES
                  <span className="crunchy-tag" style={{ position:"absolute", top:8, right:-78, background:OR, color:CR, borderRadius:40, padding:"4px 14px", fontSize:".3em", transform:"rotate(3deg)", whiteSpace:"nowrap", fontFamily:"'Crimson Text',serif" }}>Crunchy</span>
                </span>
              </div>
              <p className="fd" style={{ fontWeight:600, fontSize:11, color:"rgba(242,232,201,.65)", marginTop:20, maxWidth:280, lineHeight:1.8, textTransform:"uppercase", letterSpacing:".08em" }}>
                Premium bread and cookies<br />made from scratch
              </p>
              <div className="hero-cta-row" style={{ display:"flex", gap:16, alignItems:"center", marginTop:28, marginBottom:48 }}>
                <button className="btn-p fd" style={{ background:G1, border:`2.5px solid ${G1}`, borderRadius:50, padding:"14px 32px", fontFamily:"'Cinzel',serif", fontSize:12, color:M, cursor:"pointer", textTransform:"uppercase", letterSpacing:".06em", fontWeight:700 }}>
                  ORDER NOW
                </button>
                <a href="#" className="fd" style={{ color:"rgba(242,232,201,.65)", fontWeight:600, fontSize:11, textDecoration:"none", display:"flex", alignItems:"center", gap:6, textTransform:"uppercase", letterSpacing:".08em" }}>
                  Cooking Blog <span style={{ color:G1 }}>›</span>
                </a>
              </div>
            </div>

            {/* Right — hero image */}
            <div className="hero-image-wrap" style={{ position:"relative", display:"flex", justifyContent:"center", zIndex:2, margin:"0 auto" }}>
              <div className="hero-photo" style={{
                background:`linear-gradient(160deg, ${DB} 0%, #123F77 40%, rgba(218,165,32,.25) 100%)`,
                borderRadius:"20px 20px 0 0",
                overflow:"hidden", position:"relative",
                border:"1px solid rgba(218,165,32,.28)", borderBottom:"none",
                boxShadow:"inset 0 0 40px rgba(91,163,201,.12)",
              }}>
                <img src={IMG.branded} alt="Knead A Break homemade bakes" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} />
                <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, rgba(8,14,30,.22) 0%, rgba(91,163,201,.1) 45%, rgba(218,165,32,.1) 100%)`, mixBlendMode:"multiply" }} />
                <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, rgba(245,219,55,.08) 0%, transparent 50%, rgba(55,202,229,.06) 100%)`, pointerEvents:"none" }} />
              </div>
              {/* Floating badge */}
              <div className="float hero-badge" style={{ background:`linear-gradient(145deg, ${P}, ${DB})`, border:`2px solid rgba(218,165,32,.45)`, borderRadius:16, padding:"10px 16px", display:"flex", gap:10, alignItems:"center", boxShadow:`0 8px 32px rgba(218,165,32,.2), inset 0 1px 0 rgba(245,217,138,.15)` }}>
                <div>
                  <div className="fd" style={{ fontSize:9, color:"rgba(242,232,201,.45)", textTransform:"uppercase", letterSpacing:".1em" }}>Today's Pick</div>
                  <div className="fd" style={{ fontWeight:700, fontSize:13, color:CR }}>Brookies</div>
                  <div className="fd" style={{ fontSize:9, color:G1, textTransform:"uppercase", letterSpacing:".08em" }}>Fan Favorite</div>
                </div>
                <img src={IMG.brookiesTray} alt="Brookies" style={{ width:52, height:52, borderRadius:10, objectFit:"cover", border:`1px solid rgba(218,165,32,.28)` }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Dose of Delight ── */}
        <section className="section-pad split-grid" style={{ padding:"20px 40px 48px", position:"relative", overflow:"hidden" }}>
          <SwirlMotifs opacity={0.14} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div className="delight-photo" style={{ borderRadius:20, height:320, border:"1px solid rgba(218,165,32,.2)", position:"relative" }}>
              <img src={IMG.brookieSkillet} alt="Brookie skillet" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,rgba(91,163,201,.12) 0%,transparent 45%,rgba(218,165,32,.1) 100%)`, mixBlendMode:"soft-light" }} />
            </div>
            <div className="delight-stamp" style={{ position:"absolute", top:-16, left:-16, width:80, height:80 }}>
              <div className="spin-slow fd" style={{ width:80, height:80, borderRadius:"50%", border:`2px dashed ${G1}`, background:P, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:G1, textAlign:"center", lineHeight:1.4, padding:8 }}>
                FOR THE WHOLE FAMILY
              </div>
            </div>
          </div>
          <div style={{ position:"relative", zIndex:1 }}>
            <div className="fd" style={{ fontSize:"clamp(30px,4.5vw,50px)", textTransform:"uppercase", lineHeight:.95, color:CR, letterSpacing:".02em" }}>
              YOUR ONLY<br />
              <span style={{ color:G1, position:"relative" }}>
                DOSE OF DELIGHT
                <span className="delight-cookie" style={{ position:"absolute", top:-8, right:-32, fontSize:28 }}>🍪</span>
              </span>
            </div>
            <p className="fd" style={{ color:`rgba(218,165,32,.58)`, fontWeight:600, fontSize:10, marginTop:12, textTransform:"uppercase", letterSpacing:".14em" }}>Featured Item —</p>
            <div className="featured-card" style={{ borderRadius:16, padding:"16px 20px", marginTop:12, display:"flex", alignItems:"center", gap:16, maxWidth:380, position:"relative", zIndex:1 }}>
              <img src={IMG.banoffeePlate} alt="Banoffee pie" style={{ width:56, height:56, borderRadius:10, objectFit:"cover", border:`1px solid rgba(218,165,32,.35)`, position:"relative", zIndex:1 }} />
              <div style={{ flex:1, position:"relative", zIndex:1 }}>
                <div className="fd" style={{ fontWeight:700, fontSize:14, color:CR }}>Banoffee Pie</div>
                <div className="fb" style={{ fontSize:13, color:`rgba(218,165,32,.65)` }}>Caramel & banana</div>
                <div className="fd" style={{ fontSize:9, color:SK, textTransform:"uppercase", letterSpacing:".1em", marginTop:6 }}>Weekend Special</div>
              </div>
            </div>
            <p className="fb" style={{ fontSize:17, color:"rgba(242,232,201,.65)", lineHeight:1.8, marginTop:16, maxWidth:380 }}>
              Layers of biscuit crust, caramel, fresh banana, and whipped cream — one of our all-time favourites for sharing.
            </p>
          </div>
        </section>

        {/* ── Products We Bake Daily ── */}
        <section className="section-pad" style={{ padding:"0 40px 56px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0, background:`radial-gradient(ellipse 70% 50% at 50% 0%, rgba(218,165,32,.06) 0%, transparent 60%)` }} />
          <StarField />
          <div className="section-head" style={{ marginBottom:28, position:"relative", zIndex:1 }}>
            <div className="fd" style={{ fontSize:"clamp(26px,3.5vw,40px)", textTransform:"uppercase", lineHeight:1, color:CR, letterSpacing:".02em" }}>
              PRODUCTS WE BAKE<br /><span style={{ color:G1 }}>HERE DAILY —</span>
            </div>
            <div className="scrollbar-hide" style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c.label} className="chip fd" onClick={() => setActive(c.label)}
                  style={{ background: active === c.label ? G1 : c.bg, color: active === c.label ? M : c.color, border:`1.5px solid ${active === c.label ? G1 : "rgba(218,165,32,.2)"}`, borderRadius:50, padding:"8px 16px", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", gap:8, cursor:"pointer", textTransform:"uppercase", letterSpacing:".06em" }}>
                  {c.label}
                  <span style={{ background: active === c.label ? M : "rgba(218,165,32,.2)", color: active === c.label ? G1 : CR, borderRadius:50, width:22, height:22, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{c.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%, 240px),1fr))", gap:24, position:"relative", zIndex:1 }}>
            {(filtered.length ? filtered : PRODUCTS).map((p, i) => (
              <div key={p.name + i} className="card-hover fadein" style={{ borderRadius:20, overflow:"hidden", background:p.bg, border:"1px solid rgba(218,165,32,.12)", animationDelay: i * .08 + "s" }}>
                <div style={{ height:200, overflow:"hidden", position:"relative" }}>
                  <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 40%,rgba(8,14,30,.55) 100%)" }} />
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, rgba(91,163,201,.12) 0%, transparent 45%, rgba(218,165,32,.08) 100%)`, mixBlendMode:"soft-light", pointerEvents:"none" }} />
                  <span className="fd" style={{ position:"absolute", top:14, right:14, background:G1, color:M, borderRadius:50, padding:"4px 12px", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".06em" }}>{p.tag}</span>
                </div>
                <div style={{ padding:"16px 18px" }}>
                  <div className="fd" style={{ fontSize:14, textTransform:"uppercase", color:CR, letterSpacing:".06em" }}>{p.name}</div>
                  <p className="fb" style={{ fontSize:14, color:"rgba(242,232,201,.5)", marginTop:4, lineHeight:1.5 }}>{p.desc}</p>
                  <div style={{ display:"flex", justifyContent:"flex-end", marginTop:14 }}>
                    <button className="add-btn">Add →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why Baking Is Art ── */}
        <section className="section-pad" style={{ padding:"0 40px 56px", position:"relative", overflow:"hidden" }}>
          <CypressSilhouette />
          <div className="art-card art-grid" style={{ background:`linear-gradient(135deg,${P} 0%, #123F77 45%, ${DB} 100%)`, borderRadius:24, padding:"48px 56px", border:"1px solid rgba(218,165,32,.15)", position:"relative", overflow:"hidden" }}>
            <SwirlMotifs opacity={0.18} />
            <MoonHalo top="-4%" right="6%" />
            <div style={{ position:"absolute", top:-90, right:-90, width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(218,165,32,.06) 0%,transparent 70%)", pointerEvents:"none" }} />
            <div className="art-photo" style={{ borderRadius:16, overflow:"hidden", height:280, border:"1px solid rgba(218,165,32,.18)", position:"relative", zIndex:1 }}>
              <img src={IMG.banoffeeRustic} alt="Banoffee pie slice" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div style={{ position:"relative", zIndex:1 }}>
              <div className="fd" style={{ fontSize:"clamp(26px,3.5vw,44px)", textTransform:"uppercase", color:CR, lineHeight:1, letterSpacing:".02em" }}>
                WHY IS BAKING<br />CONSIDERED AS<br /><span style={{ color:G1 }}>ART FORM?</span>
              </div>
              <p className="fb" style={{ color:"rgba(242,232,201,.58)", fontSize:17, lineHeight:1.85, marginTop:16, maxWidth:360 }}>
                A baker's experience shapes everything — from flavour balance to visual artistry. Each loaf, croissant, and tart is an edible sculpture built on instinct and precision.
              </p>
              <button className="btn-p fd" style={{ marginTop:28, background:G1, border:`2px solid ${G1}`, borderRadius:50, padding:"14px 32px", fontWeight:700, fontSize:11, cursor:"pointer", color:M, textTransform:"uppercase", letterSpacing:".08em", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:M, display:"inline-block" }} />
                Learn Baking
              </button>
            </div>
          </div>
        </section>

        {/* ── Why We're Special ── */}
        <section className="section-pad" style={{ padding:"0 40px 64px" }}>
          <div className="section-head" style={{ marginBottom:36 }}>
            <div>
              <div className="fd" style={{ fontSize:"clamp(26px,3.5vw,40px)", textTransform:"uppercase", color:CR, lineHeight:1, letterSpacing:".02em" }}>
                WHY KNEAD A BREAK'S 🍪<br />ITEMS ARE SO SPECIAL<br />
                <span style={{ color:SK }}>TO CUSTOMERS?</span>
              </div>
            </div>
            <button className="btn-p fd" style={{ background:"transparent", border:`2px solid ${G1}`, borderRadius:50, padding:"14px 28px", fontFamily:"'Cinzel',serif", fontSize:11, color:G1, cursor:"pointer", display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap", textTransform:"uppercase", letterSpacing:".06em" }}>
              <span style={{ width:8, height:8, background:G1, borderRadius:"50%", display:"inline-block" }} />SHOP NOW
            </button>
          </div>
          <div className="why-grid">
            {WHY_ITEMS.map(item => (
              <div key={item.title} className="card-hover why-card" style={{ background:item.bg, borderRadius:20, padding:"32px 24px", color:item.tc, border:`1px solid rgba(218,165,32,.18)` }}>
                <div style={{ fontSize:40, marginBottom:16 }}>{item.icon}</div>
                <div className="fd" style={{ fontSize:14, textTransform:"uppercase", lineHeight:1.2, marginBottom:10, letterSpacing:".04em" }}>{item.title}</div>
                <p className="fb" style={{ fontSize:15, lineHeight:1.65, opacity:.78 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Ticker ── */}
        <div style={{ background:P, padding:"18px 0", overflow:"hidden", borderTop:"1px solid rgba(218,165,32,.14)", borderBottom:"1px solid rgba(218,165,32,.14)" }}>
          <div className="ticker-rail">
              {Array(10).fill(null).map((_, i) => (
              <div key={i} className="fd ticker-item" style={{ color:G1, fontSize:14, textTransform:"uppercase", letterSpacing:".14em", whiteSpace:"nowrap", paddingRight:64 }}>
                ✦ WITH ENOUGH BUTTER, ANYTHING IS GOOD — ★ 4.9 &nbsp; ·&nbsp;
              </div>
            ))}
          </div>
        </div>

        {/* ── Our Story ── */}
        <section className="section-pad story-grid pad-mobile" style={{ padding:"64px 40px", position:"relative", overflow:"hidden" }}>
          <SwirlMotifs opacity={0.12} />
          <div>
            <div className="fd" style={{ fontWeight:600, fontSize:10, textTransform:"uppercase", letterSpacing:".22em", color:SK, marginBottom:12 }}>✦ Our Story</div>
            <div className="fd" style={{ fontSize:"clamp(28px,3.5vw,46px)", textTransform:"uppercase", color:CR, lineHeight:1, marginBottom:20, letterSpacing:".02em" }}>
              BAKED WITH LOVE<br />SINCE 2025
            </div>
            <p className="fb" style={{ fontSize:17, color:"rgba(242,232,201,.62)", lineHeight:1.9, marginBottom:20 }}>
              Knead A Break started as a single table at the Lahore Sunday Market — just my grandmother's recipes and a borrowed oven. Twelve years later we're still using the same recipes, just at a slightly bigger scale.
            </p>
            <p className="fb" style={{ fontSize:17, color:"rgba(242,232,201,.62)", lineHeight:1.9, marginBottom:28 }}>
              Every item on our menu is made the same morning it's sold. No freezers, no shortcuts, no compromises on flavour.
            </p>
            <div className="stats-row">
              {[["12+","Years Baking"],["50K","Happy Customers"],["200+","Recipes"]].map(([n, l]) => (
                <div key={l} style={{ minWidth:0 }}>
                  <div className="fd stats-num" style={{ color:G1, textShadow:`0 0 22px rgba(218,165,32,.45)`, lineHeight:1 }}>{n}</div>
                  <div className="fd stats-label" style={{ fontWeight:600, color:"rgba(242,232,201,.38)", textTransform:"uppercase", letterSpacing:".12em", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="story-images" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              { src:IMG.branded,        alt:"Knead A Break bakes", h:220, mt:0   },
              { src:IMG.brookiesTray,   alt:"Brookies tray",     h:220, mt:32  },
              { src:IMG.banoffeePie,    alt:"Banoffee pie",      h:180, mt:-32 },
              { src:IMG.brownies,       alt:"Fudge brownies",    h:180, mt:0   },
            ].map(img => (
              <div key={img.alt} style={{ borderRadius:20, overflow:"hidden", height:img.h, marginTop:img.mt, border:"1px solid rgba(218,165,32,.15)" }}>
                <img src={img.src} alt={img.alt} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className="section-pad" style={{ padding:"0 40px 64px" }}>
          <div className="newsletter-card newsletter-row" style={{ background:`linear-gradient(135deg,${G1} 0%,#B8860B 100%)`, borderRadius:24, padding:"48px 56px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-60, top:-60, width:260, height:260, borderRadius:"50%", border:"1px solid rgba(8,14,30,.1)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", right:-20, top:-20, width:150, height:150, borderRadius:"50%", border:"1px solid rgba(8,14,30,.07)", pointerEvents:"none" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <div className="fd" style={{ fontSize:"clamp(22px,3vw,34px)", textTransform:"uppercase", color:M, lineHeight:1, letterSpacing:".02em" }}>
                FRESH BAKES, STRAIGHT<br />TO YOUR INBOX
              </div>
              <p className="fb" style={{ fontSize:17, color:"rgba(8,14,30,.58)", marginTop:8 }}>Weekly specials, recipes & baking tips.</p>
            </div>
            <form className="newsletter-input-wrap" onSubmit={e => e.preventDefault()} style={{ display:"flex", background:M, borderRadius:50, overflow:"hidden", boxShadow:"0 8px 28px rgba(8,14,30,.35)", position:"relative", zIndex:1 }}>
              <input type="email" placeholder="your@email.com" aria-label="Email address" className="fb" style={{ border:"none", outline:"none", padding:"14px 24px", fontSize:16, background:"transparent", width:260, color:CR, minWidth:0 }} />
              <button type="submit" className="btn-p fd" style={{ background:P, color:G1, border:"none", padding:"14px 28px", fontFamily:"'Cinzel',serif", fontSize:11, cursor:"pointer", textTransform:"uppercase", letterSpacing:".08em", fontWeight:700, whiteSpace:"nowrap" }}>Subscribe</button>
            </form>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="section-pad" style={{ background:`linear-gradient(180deg, transparent 0%, ${P} 12%)`, borderTop:"1px solid rgba(218,165,32,.15)", color:CR, padding:"56px 40px 32px", position:"relative", overflow:"hidden" }}>
          <StarField />
          <div className="footer-grid">
            <div>
              <div className="fd" style={{ fontSize:26, letterSpacing:".08em", marginBottom:16, color:CR }}>
                KNEAD A <span style={{ color:G1 }}>BREAK</span>
              </div>
              <p className="fb" style={{ fontSize:16, color:"rgba(242,232,201,.45)", lineHeight:1.75, maxWidth:240 }}>
                Artisan breads, cookies and pastries baked fresh every morning in Lahore since 2012.
              </p>
              <div style={{ display:"flex", gap:12, marginTop:20 }}>
                {["Instagram","TikTok","Facebook"].map(s => (
                  <a key={s} href="#" className="fd ghost-link" style={{ background:"rgba(218,165,32,.09)", color:G1, borderRadius:8, padding:"8px 14px", fontSize:9, fontWeight:600, textDecoration:"none", textTransform:"uppercase", letterSpacing:".08em", border:"1px solid rgba(218,165,32,.18)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(218,165,32,.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(218,165,32,.09)"}>{s}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="fd" style={{ fontSize:11, textTransform:"uppercase", letterSpacing:".14em", marginBottom:16, color:G1 }}>Menu</div>
              {["Sourdough Bread","Croissants","Cookies","Cakes","Bagels","Bretzels"].map(l => (
                <a key={l} href="#" className="fb ghost-link" style={{ display:"block", fontSize:15, textDecoration:"none", marginBottom:8 }}>{l}</a>
              ))}
            </div>
            <div>
              <div className="fd" style={{ fontSize:11, textTransform:"uppercase", letterSpacing:".14em", marginBottom:16, color:G1 }}>Hours</div>
              {[["Mon – Fri","7:00 AM – 8:00 PM"],["Saturday","7:00 AM – 9:00 PM"],["Sunday","8:00 AM – 6:00 PM"]].map(([d, h]) => (
                <div key={d} style={{ marginBottom:10 }}>
                  <div className="fd" style={{ fontSize:9, fontWeight:600, color:"rgba(242,232,201,.32)", textTransform:"uppercase", letterSpacing:".1em" }}>{d}</div>
                  <div className="fb" style={{ fontSize:14, color:"rgba(242,232,201,.7)" }}>{h}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="fd" style={{ fontSize:11, textTransform:"uppercase", letterSpacing:".14em", marginBottom:16, color:G1 }}>Visit Us</div>
              <p className="fb" style={{ fontSize:15, color:"rgba(242,232,201,.55)", lineHeight:1.8 }}>
                <br /><br />Lahore, Punjab 54000<br />Pakistan
              </p>
              <a href="#" className="fd" style={{ display:"inline-block", marginTop:12, color:G1, fontSize:9, fontWeight:600, textDecoration:"none", textTransform:"uppercase", letterSpacing:".1em" }}>Get Directions →</a>
            </div>
          </div>
          <div className="gold-rule" style={{ marginBottom:24, position:"relative", zIndex:1 }} />
          <div className="footer-bottom" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:1, gap:12 }}>
            <p className="fb" style={{ fontSize:13, color:"rgba(242,232,201,.28)" }}>© 2025 Knead A Break. All rights reserved.</p>
            <p className="fb" style={{ fontSize:13, color:"rgba(242,232,201,.28)" }}>Made with 🧈 in Lahore</p>
          </div>
        </footer>

      </div>
    </>
  );
}
