import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a; --bg2: #111111; --surface: #161616; --border: #222222;
    --accent: #e8ff47; --accent2: #ff6b35; --text: #f0f0f0; --muted: #666666; --muted2: #333333;
    --font-display: 'Syne', sans-serif; --font-mono: 'DM Mono', monospace;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-display); overflow-x: hidden; cursor: none; }
  .cursor-glow {
  position: fixed;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition:
    width 0.2s ease,
    height 0.2s ease,
    transform 0.08s linear;

  box-shadow:
    0 0 10px var(--accent),
    0 0 25px var(--accent),
    0 0 45px var(--accent);

  filter: blur(1px);
}

.cursor-glow.hovering {
  width: 28px;
  height: 28px;
}
  .cursor-dot { position: fixed; pointer-events: none; z-index: 10000; width: 4px; height: 4px; background: var(--accent); border-radius: 50%; transform: translate(-50%, -50%); }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); }

  /* LOADER */
  .loader-overlay { position: fixed; inset: 0; z-index: 1000; background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 1s ease, transform 1s ease; overflow: hidden; }
  .loader-overlay.exit { opacity: 0; pointer-events: none; transform: scale(1.04); }
  .loader-grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(232,255,71,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(232,255,71,0.04) 1px,transparent 1px); background-size: 60px 60px; }
  .loader-scanline { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,transparent,var(--accent),transparent); opacity: 0.3; animation: scanline 3s ease-in-out infinite; }
  @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
  .loader-corner { position: absolute; width: 40px; height: 40px; border-color: var(--accent); border-style: solid; opacity: 0.4; }
  .loader-corner.tl { top: 32px; left: 32px; border-width: 2px 0 0 2px; }
  .loader-corner.tr { top: 32px; right: 32px; border-width: 2px 2px 0 0; }
  .loader-corner.bl { bottom: 32px; left: 32px; border-width: 0 0 2px 2px; }
  .loader-corner.br { bottom: 32px; right: 32px; border-width: 0 2px 2px 0; }
  .loader-center { display: flex; flex-direction: column; align-items: center; z-index: 2; }
  .loader-name { font-size: clamp(64px,14vw,160px); font-weight: 800; letter-spacing: -6px; line-height: 0.9; position: relative; }
  .loader-name .char { display: inline-block; animation: charReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes charReveal { from { transform: translateY(-80px) skewX(-15deg); opacity: 0; } to { transform: translateY(0) skewX(0deg); opacity: 1; } }
  .loader-name-ghost { position: absolute; inset: 0; font-size: inherit; font-weight: 800; letter-spacing: -6px; line-height: 0.9; color: transparent; -webkit-text-stroke: 1px rgba(232,255,71,0.2); animation: ghostFloat 4s ease-in-out infinite; user-select: none; }
  @keyframes ghostFloat { 0%,100% { transform: translate(0,0); } 25% { transform: translate(3px,-2px); } 50% { transform: translate(-2px,1px); } 75% { transform: translate(1px,3px); } }
  .loader-status-wrap { margin-top: 36px; width: min(480px,80vw); display: flex; flex-direction: column; gap: 10px; }
  .status-line { display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 12px; color: var(--muted); opacity: 0; animation: statusAppear 0.4s ease forwards; }
  .status-line .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: var(--muted2); }
  .status-line.done .dot { background: var(--accent); }
  .status-line.active .dot { background: var(--accent); animation: pulse 0.8s ease infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }
  @keyframes statusAppear { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
  .status-val { margin-left: auto; color: var(--accent); font-size: 11px; }
  .loader-bar-section { margin-top: 40px; width: min(480px,80vw); opacity: 0; animation: fadeIn 0.5s ease 1.6s forwards; }
  .loader-bar-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .loader-bar-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.2em; text-transform: uppercase; }
  .loader-count { font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: var(--accent); }
  .loader-bar-track { width: 100%; height: 2px; background: var(--muted2); position: relative; overflow: hidden; }
  .loader-bar-fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--accent); transition: width 0.1s ease; }
  .loader-bar-glow { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 24px; height: 8px; background: var(--accent); filter: blur(6px); opacity: 0.8; }
  .loader-tagline { margin-top: 24px; font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.25em; text-transform: uppercase; opacity: 0; animation: fadeIn 0.5s ease 2s forwards; }
  .loader-flash { position: absolute; inset: 0; background: var(--accent); opacity: 0; pointer-events: none; animation: flash 0.3s ease 4.5s forwards; }
  @keyframes flash { 0% { opacity: 0; } 50% { opacity: 0.07; } 100% { opacity: 0; } }
  .noise { position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 150px; }

  /* NAV */
  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 24px 48px; border-bottom: 1px solid transparent; transition: border-color 0.3s,background 0.3s,padding 0.3s; }
  nav.scrolled { border-color: var(--border); background: rgba(10,10,10,0.9); backdrop-filter: blur(12px); padding: 16px 48px; }
  .nav-logo { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a { font-family: var(--font-mono); font-size: 13px; color: var(--muted); text-decoration: none; letter-spacing: 0.05em; transition: color 0.2s; position: relative; }
  .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: var(--accent); transition: width 0.3s; }
  .nav-links a:hover { color: var(--text); }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em; background: var(--accent); color: #000; border: none; padding: 10px 20px; cursor: none; transition: background 0.2s,transform 0.1s; font-weight: 400; }
  .nav-cta:hover { background: #fff; transform: translateY(-1px); }

  /* HERO */
  .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; padding: 150px 48px 80px; position: relative; overflow: hidden; }
  .hero-grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%); opacity: 0.4; }
  .hero-image { position: absolute; right: 70px; top: 47%; transform: translateY(-50%); }
  .hero-image img { width: 340px; height: 340px; object-fit: cover; border-radius: 24px; border: 2px solid var(--accent); box-shadow: 0 0 60px rgba(232,255,71,0.12); transition: filter 0.3s; }
  .hero-image::before { content: ''; position: absolute; inset: -15px; background: var(--accent); filter: blur(80px); opacity: 0.15; z-index: -1; }
  .hero-image:hover img { animation: glitch 0.4s steps(2) forwards; }
  @keyframes glitch { 0% { clip-path: inset(0 0 90% 0); transform: translateX(-4px); } 20% { clip-path: inset(30% 0 50% 0); transform: translateX(4px); } 40% { clip-path: inset(60% 0 20% 0); transform: translateX(-2px); } 60% { clip-path: inset(10% 0 80% 0); transform: translateX(2px); } 80% { clip-path: inset(80% 0 5% 0); transform: translateX(-4px); } 100% { clip-path: inset(0 0 0 0); transform: translateX(0); } }
  .hero-tag { font-family: var(--font-mono); font-size: 13px; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; margin-top: 20px; margin-bottom: 10px; animation: fadeUp 0.6s ease both; }
  .hero-name { font-size: clamp(56px,10vw,120px); font-weight: 800; line-height: 0.9; letter-spacing: -3px; animation: fadeUp 0.6s ease 0.1s both; }
  .hero-name .line2 { color: var(--muted); }
  .hero-subtitle { margin-top: 28px; max-width: 700px; font-family: var(--font-mono); font-size: 14px; line-height: 1.8; color: var(--muted); font-style: italic; animation: fadeUp 0.6s ease 0.2s both; }
  .hero-buttons { margin-top: 32px; display: flex; gap: 16px; align-items: center; }
  .resume-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; background: var(--accent); color: #000; text-decoration: none; font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em; border-radius: 40px; transition: 0.3s ease; font-weight: 600; }
  .resume-btn:hover { transform: translateY(-4px); box-shadow: 0 0 30px rgba(232,255,71,0.35); }
  .scroll-btn { font-family: var(--font-mono); font-size: 12px; color: var(--muted); letter-spacing: 0.08em; text-decoration: none; border: 1px solid var(--border); padding: 14px 24px; border-radius: 40px; transition: 0.3s ease; }
  .scroll-btn:hover { border-color: var(--accent); color: var(--accent); }
  .hero-bottom { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 50px; animation: fadeUp 0.6s ease 0.3s both; }
  .hero-scroll { display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 12px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
  .scroll-line { width: 60px; height: 1px; background: var(--muted2); position: relative; overflow: hidden; }
  .scroll-line::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: var(--accent); animation: scrollLine 2s ease-in-out infinite; }
  @keyframes scrollLine { 0% { left: -100%; } 100% { left: 100%; } }
  .hero-stats { display: flex; gap: 48px; }
  .stat { text-align: right; }
  .stat-num { font-size: 36px; font-weight: 800; letter-spacing: -2px; line-height: 1; }
  .stat-num span { color: var(--accent); }
  .stat-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

  /* SECTION */
  section { padding: 120px 48px; }
  .section-header { display: flex; align-items: center; gap: 20px; margin-bottom: 80px; }
  .section-num { font-family: var(--font-mono); font-size: 12px; color: var(--accent); letter-spacing: 0.1em; }
  .section-title { font-size: clamp(36px,5vw,64px); font-weight: 800; letter-spacing: -2px; line-height: 1; }
  .section-line { flex: 1; height: 1px; background: var(--border); max-width: 200px; }

  /* ABOUT */
  .about { background: var(--bg2); border-top: 1px solid var(--border); }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .about-text p { font-size: 18px; line-height: 1.8; color: #aaa; font-weight: 400; letter-spacing: -0.2px; margin-bottom: 20px; }
  .about-text p strong { color: var(--text); }
  .about-aside { display: flex; flex-direction: column; gap: 1px; }
  .aside-item { display: flex; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid var(--border); font-family: var(--font-mono); font-size: 13px; }
  .aside-label { color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .aside-val { color: var(--text); }

  /* ── SKILLS — full color system for all cards ── */
  .skills { background: var(--bg); }
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 1px; border: 1px solid var(--border); }
  .skill-card { background: var(--bg); padding: 32px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); transition: background 0.3s; cursor: default; }
  .skill-card:hover { background: var(--surface); }
  .skill-icon { font-size: 28px; margin-bottom: 16px; }
  .skill-name { font-size: 20px; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.5px; color: var(--accent); }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag { font-family: var(--font-mono); font-size: 11px; color: var(--muted); background: var(--muted2); padding: 4px 10px; letter-spacing: 0.05em; transition: all 0.2s; }
  .skill-card:hover .skill-tag { background: #1e1e1e; }
  .skill-tag:hover { filter: brightness(1.3); transform: translateY(-2px); }

  /* Languages */
  .lang-java   { color: #f89820 !important; background: rgba(248,152,32,0.12) !important; border: 1px solid rgba(248,152,32,0.35) !important; }
  .lang-c      { color: #4fc3f7 !important; background: rgba(79,195,247,0.12) !important; border: 1px solid rgba(79,195,247,0.35) !important; }
  .lang-python { color: #ffd43b !important; background: rgba(255,212,59,0.12) !important; border: 1px solid rgba(255,212,59,0.35) !important; }
  .lang-js     { color: #f0db4f !important; background: rgba(240,219,79,0.12) !important; border: 1px solid rgba(240,219,79,0.35) !important; }
  .lang-sql    { color: #e46f1a !important; background: rgba(228,111,26,0.12) !important; border: 1px solid rgba(228,111,26,0.35) !important; }

  /* Web Development */
  .tag-react   { color: #61dafb !important; background: rgba(97,218,251,0.12) !important; border: 1px solid rgba(97,218,251,0.35) !important; }
  .tag-html    { color: #e34f26 !important; background: rgba(227,79,38,0.12) !important; border: 1px solid rgba(227,79,38,0.35) !important; }
  .tag-css     { color: #264de4 !important; background: rgba(38,77,228,0.15) !important; border: 1px solid rgba(100,130,255,0.4) !important; }
  .tag-node    { color: #68a063 !important; background: rgba(104,160,99,0.12) !important; border: 1px solid rgba(104,160,99,0.35) !important; }
  .tag-dbms    { color: #e46f1a !important; background: rgba(228,111,26,0.12) !important; border: 1px solid rgba(228,111,26,0.35) !important; }

  /* Cybersecurity */
  .tag-netsec  { color: #f87171 !important; background: rgba(248,113,113,0.12) !important; border: 1px solid rgba(248,113,113,0.35) !important; }
  .tag-iam     { color: #a78bfa !important; background: rgba(167,139,250,0.12) !important; border: 1px solid rgba(167,139,250,0.35) !important; }
  .tag-threat  { color: #fb923c !important; background: rgba(251,146,60,0.12) !important; border: 1px solid rgba(251,146,60,0.35) !important; }
  .tag-pentest { color: #4ade80 !important; background: rgba(74,222,128,0.12) !important; border: 1px solid rgba(74,222,128,0.35) !important; }
  .tag-siem    { color: #38bdf8 !important; background: rgba(56,189,248,0.12) !important; border: 1px solid rgba(56,189,248,0.35) !important; }

  /* Security Frameworks */
  .tag-jwt     { color: #e8ff47 !important; background: rgba(232,255,71,0.10) !important; border: 1px solid rgba(232,255,71,0.35) !important; }
  .tag-rbac    { color: #f472b6 !important; background: rgba(244,114,182,0.12) !important; border: 1px solid rgba(244,114,182,0.35) !important; }
  .tag-secure  { color: #34d399 !important; background: rgba(52,211,153,0.12) !important; border: 1px solid rgba(52,211,153,0.35) !important; }

  /* Tools */
  .tag-git     { color: #f05032 !important; background: rgba(240,80,50,0.12) !important; border: 1px solid rgba(240,80,50,0.35) !important; }
  .tag-nasa    { color: #60a5fa !important; background: rgba(96,165,250,0.12) !important; border: 1px solid rgba(96,165,250,0.35) !important; }
  .tag-linux   { color: #fbbf24 !important; background: rgba(251,191,36,0.12) !important; border: 1px solid rgba(251,191,36,0.35) !important; }

  /* JOURNEY */
  .journey { background: var(--bg2); border-top: 1px solid var(--border); }
  .timeline-enhanced { position: relative; display: flex; flex-direction: column; }
  .timeline-spine { position: absolute; left: 220px; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom,transparent,var(--accent) 10%,var(--border) 40%,var(--accent) 90%,transparent); }
  .timeline-entry { display: grid; grid-template-columns: 220px 1fr; position: relative; }
  .timeline-left { padding: 48px 40px 40px 0; text-align: right; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start; }
  .timeline-year-big { font-size: 48px; font-weight: 800; letter-spacing: -3px; line-height: 1; color: var(--muted2); transition: color 0.3s; }
  .timeline-entry:hover .timeline-year-big { color: var(--accent); }
  .timeline-year-end { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.1em; margin-top: 2px; }
  .timeline-logo-slot {
    margin-top: 16px;
    width: 95px;
    height: 95px;
    border-radius: 18px;
    border: 1px dashed rgba(232,255,71,0.25);
    background: rgba(232,255,71,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: border-color 0.3s, background 0.3s;
  }
  .timeline-entry:hover .timeline-logo-slot { border-color: rgba(232,255,71,0.5); background: rgba(232,255,71,0.09); }
  .timeline-logo-slot img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; }
  .timeline-logo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 9px; color: var(--muted); letter-spacing: 0.07em; text-align: center; padding: 8px; line-height: 1.3; text-transform: uppercase; }
  .timeline-logo-placeholder svg { opacity: 0.35; }
  .timeline-node { position: absolute; left: 220px; top: 52px; transform: translate(-50%,0); z-index: 3; }
  .timeline-node-ring { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--muted2); background: var(--bg2); transition: border-color 0.3s,box-shadow 0.3s; display: flex; align-items: center; justify-content: center; }
  .timeline-node-ring::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--muted2); transition: background 0.3s; }
  .timeline-entry:hover .timeline-node-ring { border-color: var(--accent); box-shadow: 0 0 16px rgba(232,255,71,0.35); }
  .timeline-entry:hover .timeline-node-ring::after { background: var(--accent); }
  .timeline-right { padding: 40px 0 40px 56px; border-bottom: 1px solid var(--border); }
  .timeline-entry:last-child .timeline-right { border-bottom: none; }
  .timeline-badge-new { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 10px; background: transparent; border: 1px solid var(--accent); color: var(--accent); padding: 4px 12px; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px; transition: background 0.3s; }
  .timeline-entry:hover .timeline-badge-new { background: rgba(232,255,71,0.07); }
  .timeline-title-new { font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 6px; line-height: 1.1; }
  .timeline-org-new { font-family: var(--font-mono); font-size: 14px; color: var(--muted); letter-spacing: 0.1em; margin-bottom: 16px; }
  .timeline-desc-new { font-size: 15px; line-height: 1.9; color: #888; max-width: 560px; }
  .timeline-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .timeline-chip { font-family: var(--font-mono); font-size: 11px; color: var(--muted); background: rgba(255,255,255,0.04); padding: 4px 12px; border: 1px solid var(--muted2); letter-spacing: 0.05em; transition: border-color 0.3s,color 0.3s; }
  .timeline-entry:hover .timeline-chip { border-color: rgba(232,255,71,0.25); color: #aaa; }

  /* INTERNSHIP */
  .internship { background: var(--bg); border-top: 1px solid var(--border); }
  .intern-grid { display: flex; justify-content: center; align-items: center; margin-top: 30px; }
  .intern-card { background: var(--surface); border: 1px solid var(--border); padding: 32px; border-radius: 20px; transition: 0.3s ease; position: relative; overflow: hidden; width: 1400px; min-height: 300px; }
  .intern-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
  .intern-card:hover::before { transform: scaleX(1); }
  .intern-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); border-color: rgba(232,255,71,0.2); }
  .intern-company { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: var(--accent); margin-bottom: 8px; }
  .intern-role { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
  .intern-period { font-family: var(--font-mono); font-size: 14px; color: var(--muted); letter-spacing: 0.1em; margin-bottom: 16px; }
  .intern-desc { font-size: 14px; line-height: 1.8; color: #888; margin-bottom: 16px; }
  .intern-skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .intern-pill { font-family: var(--font-mono); font-size: 11px; color: var(--muted); background: var(--muted2); padding: 4px 10px; }

  /* PROJECTS */
  .projects { background: var(--bg2); border-top: 1px solid var(--border); }
  .projects-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 28px; margin-top: 40px; }
  .project-item { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 30px; transition: 0.35s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 18px; }
  .project-item::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
  .project-item:hover::before { transform: scaleX(1); }
  .project-item:hover { padding-left: 16px; }
  .project-num { font-family: var(--font-mono); font-size: 13px; color: var(--muted); letter-spacing: 0.1em; }
  .project-item:hover { transform: translateY(-8px); border-color: rgba(232,255,71,0.3); box-shadow: 0 20px 60px rgba(0,0,0,0.5),0 0 30px rgba(232,255,71,0.08); }
  .project-name { font-size: 22px; font-weight: 700; color: var(--accent); line-height: 1.1; }
  .project-desc { font-size: 14px; line-height: 1.9; color: #8d8d8d; font-family: var(--font-display); }
  .project-tech { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .tech-pill { font-family: var(--font-mono); font-size: 11px; color: var(--accent); border: 1px solid var(--accent); padding: 3px 10px; letter-spacing: 0.05em; opacity: 0.7; }
  .project-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: auto; }
  .proj-btn { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; padding: 7px 14px; border-radius: 6px; text-decoration: none; transition: all 0.2s ease; white-space: nowrap; cursor: pointer; border: none; background: none; }
  .proj-btn-github { color: #ccc; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12) !important; }
  .proj-btn-github:hover { background: rgba(255,255,255,0.12) !important; color: #fff; border-color: rgba(255,255,255,0.35) !important; transform: translateY(-2px); }
  .proj-btn-demo { color: var(--accent); background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.3) !important; }
  .proj-btn-demo:hover { background: rgba(232,255,71,0.18) !important; border-color: var(--accent) !important; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(232,255,71,0.2); }
  .proj-btn-desc { color: #ff6b35; background: rgba(255,107,53,0.08); border: 1px solid rgba(255,107,53,0.3) !important; }
  .proj-btn-desc:hover { background: rgba(255,107,53,0.18) !important; border-color: #ff6b35 !important; transform: translateY(-2px); }

  /* Project modal */
  .proj-modal-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
  .proj-modal-overlay.open { opacity: 1; pointer-events: all; }
  .proj-modal { background: var(--surface); border: 1px solid rgba(232,255,71,0.2); border-radius: 24px; padding: 40px; max-width: 560px; width: 90%; position: relative; transform: translateY(24px) scale(0.97); transition: transform 0.3s ease; box-shadow: 0 0 60px rgba(232,255,71,0.08),0 40px 80px rgba(0,0,0,0.6); }
  .proj-modal-overlay.open .proj-modal { transform: translateY(0) scale(1); }
  .proj-modal-close { position: absolute; top: 16px; right: 20px; background: none; border: none; color: var(--muted); font-size: 24px; cursor: pointer; transition: color 0.2s; font-family: var(--font-mono); line-height: 1; }
  .proj-modal-close:hover { color: var(--accent); }
  .proj-modal-tag { font-family: var(--font-mono); font-size: 10px; color: #ff6b35; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 12px; }
  .proj-modal-title { font-size: 32px; font-weight: 800; letter-spacing: -1.5px; margin-bottom: 16px; }
  .proj-modal-body { font-size: 15px; line-height: 1.85; color: #999; margin-bottom: 24px; }
  .proj-modal-tech { display: flex; flex-wrap: wrap; gap: 8px; }

  /* CERTIFICATIONS */
  .certifications { padding: 120px 48px !important; background: var(--bg); border-top: 1px solid var(--border); }
  .cert-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 24px; }
  .cert-card { background: var(--surface); border: 1px solid var(--border); padding: 28px; border-radius: 20px; transition: 0.3s ease; color: var(--text); display: flex; flex-direction: column; }
  .cert-card:hover { transform: translateY(-6px); border-color: var(--accent); box-shadow: 0 0 30px rgba(232,255,71,0.08); }
  .cert-year { color: var(--accent); font-family: var(--font-mono); margin-bottom: 12px; font-size: 13px; }
  .cert-title { font-size: 18px; font-weight: 700; margin-bottom: 10px; line-height: 1.3; flex: 1; }
  .cert-issuer { color: var(--muted); font-family: var(--font-mono); font-size: 13px; margin-bottom: 20px; }
  .cert-open-btn { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; color: #000; background: var(--accent); padding: 9px 18px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s ease; align-self: flex-start; font-weight: 600; }
  .cert-open-btn:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232,255,71,0.3); }

  /* BEYOND */
  .beyond { background: var(--bg2); border-top: 1px solid var(--border); }
  .beyond-hero-row { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; margin-bottom: 64px; }
  .beyond-cards-col { display: flex; flex-direction: column; gap: 20px; }
  .beyond-card-enhanced { background: var(--surface); border: 1px solid var(--border); padding: 32px 32px 28px; border-radius: 24px; transition: 0.35s ease; position: relative; overflow: hidden; }
  .beyond-card-enhanced::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
  .beyond-card-enhanced:hover::after { transform: scaleX(1); }
  .beyond-card-enhanced:hover { transform: translateY(-6px); border-color: rgba(232,255,71,0.2); box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
  .beyond-card-top { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
  .beyond-icon-box { width: 48px; height: 48px; border-radius: 12px; background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; transition: background 0.3s; }
  .beyond-card-enhanced:hover .beyond-icon-box { background: rgba(232,255,71,0.14); }
  .beyond-card-header { flex: 1; }
  .beyond-card-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 2px; }
  .beyond-card-role { font-family: var(--font-mono); font-size: 11px; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; }
  .beyond-card-desc { font-size: 14px; line-height: 1.8; color: #777; margin-bottom: 18px; }
  .beyond-card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .beyond-tag { font-family: var(--font-mono); font-size: 10px; color: var(--muted); background: var(--muted2); padding: 3px 10px; letter-spacing: 0.06em; }
  .beyond-stat-strip { display: flex; gap: 24px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); }
  .beyond-stat-item { display: flex; flex-direction: column; gap: 2px; }
  .beyond-stat-num { font-size: 22px; font-weight: 800; color: var(--accent); letter-spacing: -1px; }
  .beyond-stat-lbl { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }

  /* Collage */
  .beyond-collage { position: relative; height: 700px; }
  .collage-photo { position: absolute; border-radius: 18px; border: 2px solid var(--border); overflow: hidden; transition: transform 0.4s ease,border-color 0.3s; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
  .collage-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .collage-photo:hover { transform: scale(1.07) rotate(0deg) !important; border-color: var(--accent); z-index: 10 !important; box-shadow: 0 0 40px rgba(232,255,71,0.18); }
  .cp1 { width: 182px; height: 224px; top:   0px; left:  10px; transform: rotate(-6deg); z-index: 2; }
  .cp2 { width: 172px; height: 212px; top:  18px; left: 190px; transform: rotate(5deg);  z-index: 3; }
  .cp3 { width: 162px; height: 198px; top:   8px; left: 355px; transform: rotate(-8deg); z-index: 1; }
  .cp4 { width: 190px; height: 234px; top: 228px; left:  18px; transform: rotate(4deg);  z-index: 4; }
  .cp5 { width: 168px; height: 208px; top: 242px; left: 205px; transform: rotate(-5deg); z-index: 2; }
  .cp6 { width: 176px; height: 216px; top: 232px; left: 368px; transform: rotate(7deg);  z-index: 3; }
  .cp7 { width: 186px; height: 220px; top: 462px; left:  45px; transform: rotate(-3deg); z-index: 2; }
  .cp8 { width: 172px; height: 206px; top: 470px; left: 252px; transform: rotate(5deg);  z-index: 3; }
  .collage-label { position: absolute; bottom: 10px; left: 10px; font-family: var(--font-mono); font-size: 10px; background: rgba(10,10,10,0.85); color: var(--accent); padding: 4px 10px; letter-spacing: 0.1em; border: 1px solid rgba(232,255,71,0.3); backdrop-filter: blur(4px); }

  .beyond-strip { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--border); }
  .beyond-strip-item { padding: 28px 32px; border-right: 1px solid var(--border); transition: background 0.3s; }
  .beyond-strip-item:last-child { border-right: none; }
  .beyond-strip-item:hover { background: var(--surface); }
  .strip-icon { font-size: 20px; margin-bottom: 10px; }
  .strip-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .strip-text { font-family: var(--font-mono); font-size: 12px; color: var(--muted); line-height: 1.7; }

  /* CONTACT */
  .contact { background: var(--bg); border-top: 1px solid var(--border); }
  .contact-inner { width: 100%; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 80px; align-items: start; }
  .contact-headline { font-size: clamp(40px,6vw,80px); font-weight: 800; letter-spacing: -3px; line-height: 0.95; margin-bottom: 48px; }
  .contact-headline .accent { color: var(--accent); }
  .contact-links { display: flex; flex-direction: column; gap: 20px; }
  .contact-btn { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; color: var(--text); text-decoration: none; font-family: var(--font-mono); font-size: 14px; letter-spacing: 0.08em; transition: 0.3s ease; cursor: pointer; width: 100%; }
  .contact-btn:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 0 25px rgba(232,255,71,0.08); }

  /* Call Me Modal */
  .callme-modal-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
  .callme-modal-overlay.open { opacity: 1; pointer-events: all; }
  .callme-modal { background: var(--surface); border: 1px solid rgba(232,255,71,0.25); border-radius: 28px; padding: 48px 44px; max-width: 440px; width: 90%; position: relative; transform: translateY(24px) scale(0.97); transition: transform 0.3s ease; box-shadow: 0 0 80px rgba(232,255,71,0.1),0 40px 80px rgba(0,0,0,0.7); text-align: center; }
  .callme-modal-overlay.open .callme-modal { transform: translateY(0) scale(1); }
  .callme-modal-close { position: absolute; top: 16px; right: 20px; background: none; border: none; color: var(--muted); font-size: 24px; cursor: pointer; transition: color 0.2s; font-family: var(--font-mono); }
  .callme-modal-close:hover { color: var(--accent); }
  .callme-icon { font-size: 48px; margin-bottom: 16px; display: block; }
  .callme-title { font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
  .callme-subtitle { font-family: var(--font-mono); font-size: 12px; color: var(--muted); letter-spacing: 0.1em; margin-bottom: 32px; }
  .callme-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 14px; margin-bottom: 12px; text-decoration: none; transition: 0.2s ease; color: var(--text); }
  .callme-row:hover { border-color: var(--accent); background: rgba(232,255,71,0.06); transform: translateX(4px); }
  .callme-row-left { display: flex; align-items: center; gap: 12px; }
  .callme-row-icon { font-size: 22px; }
  .callme-row-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; text-align: left; }
  .callme-row-val { font-size: 14px; font-weight: 700; color: var(--text); text-align: left; }
  .callme-arrow { color: var(--accent); font-size: 18px; }
  .callme-avail { margin-top: 24px; font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .callme-dot-green { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; flex-shrink: 0; animation: pulse 2s ease infinite; }

  /* FOOTER */
  footer { padding: 32px 48px; border-top: 1px solid var(--border); display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
  .footer-copy { justify-self: start; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .footer-copy span { color: var(--accent); }
  .footer-center { display: flex; justify-self: center; align-items: center; }
  .footer-back { justify-self: end; font-family: var(--font-mono); font-size: 12px; color: var(--muted); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; transition: color 0.2s; }
  .footer-back:hover { color: var(--accent); }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease,transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: none; }

  /* ══════════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════════ */
  @media (max-width: 1024px) {
    .hero-image { right: 30px; }
    .hero-image img { width: 260px; height: 260px; }
    .intern-card { width: 100%; }
    .beyond-hero-row { gap: 40px; }
    .beyond-collage { height: 560px; }
    .cp3,.cp6 { display: none; }
  }

  @media (max-width: 768px) {
    body { cursor: auto; }
    .cursor-glow, .cursor-dot { display: none; }

    nav { padding: 16px 20px; }
    nav.scrolled { padding: 12px 20px; }
    .nav-links, .nav-cta { display: none; }

    /* ── HERO: keep name on one line ── */
    .hero {
      min-height: 100vh;
      padding: 100px 20px 60px;
      justify-content: flex-start;
      flex-direction: column;
    }
    .hero-image {
      position: relative;
      right: auto;
      top: auto;
      transform: none;
      margin: 0 auto 32px;
      display: flex;
      justify-content: center;
    }
    .hero-image img { width: 180px; height: 180px; }

    /* FIX 1: SAGARIKA must not wrap — tighten spacing */
    .hero-name {
      font-size: clamp(36px, 11vw, 64px);
      letter-spacing: -1px;
      white-space: nowrap;
    }

    .hero-tag { font-size: 10px; letter-spacing: 0.1em; }
    .hero-subtitle { font-size: 13px; max-width: 100%; }
    .hero-buttons { flex-wrap: wrap; gap: 12px; }
    .resume-btn, .scroll-btn { padding: 12px 20px; font-size: 12px; }
    .hero-bottom { flex-direction: column; align-items: flex-start; gap: 20px; margin-top: 36px; }
    .hero-stats { gap: 28px; }
    .stat-num { font-size: 28px; }

    section { padding: 64px 20px; }
    .section-header { margin-bottom: 40px; gap: 12px; }
    .section-title { font-size: clamp(28px,8vw,44px); letter-spacing: -1px; }

    .about-grid { grid-template-columns: 1fr; gap: 36px; }
    .about-text p { font-size: 15px; }
    .aside-item { font-size: 12px; padding: 14px 0; }

    .skills-grid { grid-template-columns: 1fr; }

    /* ── FIX 2: TIMELINE MOBILE — show logo + year ── */
    .timeline-spine { left: 16px; }
    .timeline-entry {
      grid-template-columns: 1fr;
      display: flex;
      flex-direction: column;
    }
    /* Show the left column on mobile — stacked on top */
    .timeline-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      padding: 24px 0 0 40px;
      text-align: left;
      align-items: flex-start;
    }
    .timeline-left-text {
      display: flex;
      flex-direction: column;
    }
    .timeline-year-big { font-size: 32px; letter-spacing: -2px; }
    .timeline-year-end { font-size: 10px; margin-top: 0; }
    .timeline-logo-slot {
      width: 68px;
      height: 68px;
      border-radius: 14px;
      margin-top: 0;
      flex-shrink: 0;
    }
    .timeline-node { left: 16px; top: 28px; }
    .timeline-right { padding: 16px 0 28px 40px; }
    .timeline-title-new { font-size: 20px; }
    .timeline-org-new { font-size: 12px; }
    .timeline-desc-new { font-size: 14px; }

    .intern-grid { flex-direction: column; padding: 0; }
    .intern-card { width: 100%; min-height: auto; padding: 24px; }
    .intern-company { font-size: 22px; }

    .projects-list { grid-template-columns: 1fr; gap: 20px; margin-top: 24px; }
    .project-item { padding: 22px; border-radius: 18px; }
    .project-item:hover { padding-left: 22px; }
    .project-name { font-size: 18px; }
    .project-actions { flex-wrap: wrap; gap: 8px; }
    .proj-modal { padding: 28px 20px; }
    .proj-modal-title { font-size: 24px; }

    .certifications { padding: 64px 20px !important; }
    .cert-grid { grid-template-columns: 1fr; gap: 16px; }
    .cert-card { padding: 22px; }
    .cert-title { font-size: 16px; }

    .beyond-hero-row { grid-template-columns: 1fr; gap: 40px; }
    .beyond-collage { height: 420px; order: -1; }
    .cp3,.cp6,.cp7,.cp8 { display: none; }
    .cp1 { width: 140px; height: 172px; left: 4px; }
    .cp2 { width: 132px; height: 162px; left: 148px; }
    .cp4 { width: 146px; height: 180px; top: 188px; left: 8px; }
    .cp5 { width: 130px; height: 160px; top: 200px; left: 156px; }
    .beyond-card-enhanced { padding: 22px; border-radius: 18px; }
    .beyond-card-title { font-size: 18px; }
    .beyond-stat-strip { gap: 16px; flex-wrap: wrap; }
    .beyond-strip { grid-template-columns: 1fr; }
    .beyond-strip-item { border-right: none; border-bottom: 1px solid var(--border); padding: 22px 20px; }
    .beyond-strip-item:last-child { border-bottom: none; }

    .contact-inner { grid-template-columns: 1fr; gap: 32px; }
    .contact-headline { font-size: clamp(36px,10vw,56px); letter-spacing: -2px; margin-bottom: 0; }
    .contact-btn { padding: 16px 18px; font-size: 13px; }

    .callme-modal { padding: 36px 24px; border-radius: 20px; }
    .callme-title { font-size: 22px; }
    .callme-row { padding: 14px 16px; }

    footer { padding: 24px 20px; grid-template-columns: 1fr; gap: 10px; text-align: center; }
    .footer-copy, .footer-center, .footer-back { justify-self: center; }
  }

  @media (max-width: 480px) {
    /* FIX 1 (continued): Very small screens */
    .hero-name {
      font-size: clamp(30px, 9.5vw, 52px);
      letter-spacing: -0.5px;
      white-space: nowrap;
    }
    .hero-image img { width: 150px; height: 150px; }
    .hero-tag { font-size: 9px; }
    .hero-buttons { flex-direction: column; align-items: flex-start; }
    .projects-list { grid-template-columns: 1fr; }
    .cert-grid { grid-template-columns: 1fr; }
    .beyond-collage { height: 340px; }
    .cp1 { width: 118px; height: 145px; left: 2px; }
    .cp2 { width: 112px; height: 138px; left: 126px; }
    .cp4 { width: 124px; height: 152px; top: 158px; left: 4px; }
    .cp5 { width: 110px; height: 135px; top: 166px; left: 132px; }
    .section-title { font-size: clamp(26px,9vw,38px); }
  }
`;

/* ── TAG COLOR HELPER ── */
function tagClass(tag) {
  const map = {
    // Languages
    Java: "lang-java",
    "C/C++": "lang-c",
    "Python (Basics)": "lang-python",
    JavaScript: "lang-js",
    SQL: "lang-sql",
    // Web Dev
    "React.js": "tag-react",
    HTML5: "tag-html",
    CSS3: "tag-css",
    "Node.js": "tag-node",
    "DBMS(SQL)": "tag-dbms",
    // Cybersecurity
    "Network Security": "tag-netsec",
    IAM: "tag-iam",
    "Threat Analysis": "tag-threat",
    "Penetration Testing": "tag-pentest",
    SIEM: "tag-siem",
    // Security Frameworks
    JWT: "tag-jwt",
    "Role-Based Access Control (RBAC)": "tag-rbac",
    "Secure Coding": "tag-secure",
    // Tools
    "Git/Github": "tag-git",
    "NASA FIRMS API": "tag-nasa",
    Linux: "tag-linux",
  };
  return map[tag] || "";
}

/* ── DATA ── */
const skills = [
  {
    icon: "⬠",
    name: "Languages",
    tags: ["Java", "C/C++", "Python (Basics)", "JavaScript", "SQL"],
  },
  {
    icon: "⬡",
    name: "Web Development",
    tags: ["React.js", "HTML5", "CSS3", "Node.js", "DBMS(SQL)"],
  },
  {
    icon: "⬙",
    name: "Cybersecurity",
    tags: [
      "Network Security",
      "IAM",
      "Threat Analysis",
      "Penetration Testing",
      "SIEM",
    ],
  },
  {
    icon: "◇",
    name: "Security Frameworks",
    tags: ["JWT", "Role-Based Access Control (RBAC)", "Secure Coding"],
  },
  {
    icon: "⬟",
    name: "Tools & Platforms",
    tags: ["Git/Github", "NASA FIRMS API", "Linux"],
  },
];

const timeline = [
  {
    yearStart: "2008",
    yearEnd: "–2019",
    badge: "Schooling",
    title: "Primary & Secondary Education",
    org: "SUNDARGARH PUBLIC SCHOOL, SUNDARGARH, ODISHA",
    desc: "Built a strong foundation in Mathematics and Sciences. Developed early interest in computers, logic, and problem-solving. Participated in science fairs, quiz competitions, and creative events.",
    chips: ["Mathematics", "Sciences", "Logic", "Problem Solving"],
    logoSrc: "/sps.png",
    logoAlt: "School Logo",
  },
  {
    yearStart: "2019",
    yearEnd: "–2021",
    badge: "Senior Secondary",
    title: "Higher Secondary (Class XI–XII)",
    org: "GURUKUL +2 SCIENCE COLLEGE, SUNDARGARH, ODISHA",
    desc: "Studied Computer Science alongside Physics, Chemistry, and Mathematics. Wrote first program in Java and developed curiosity about working of internet and networks.",
    chips: ["Java", "Computer Science", "Physics", "Mathematics"],
    logoSrc: "/gurukul.png",
    logoAlt: "School Logo",
  },
  {
    yearStart: "2022",
    yearEnd: "–Present",
    badge: "B.Tech",
    title: "Bachelor of Technology",
    org: "C.V. Raman Global University, BHUBANESWAR, ODISHA",
    desc: "Pursuing B.Tech in Computer Science with a focus on Cybersecurity, Web Development, and AI/ML. Actively involved in college clubs, hackathons, NSS volunteering, and creative leadership.",
    chips: ["Cybersecurity", "Web Dev", "AI/ML", "Hackathons", "NSS"],
    logoSrc: "/cgu.png",
    logoAlt: "CGU Logo",
  },
];

const internships = [
  {
    company: "Infosys Springboard",
    role: "Full Stack Web Development Trainee",
    period: "2025 — Remote",
    desc: "Worked as a Full Stack Web Development Trainee at Infosys Springboard where I designed and developed NeuroFleet-X, a smart fleet management platform with real-time telemetry dashboards, AI-powered route optimization, predictive maintenance alerts, and secure role-based access control. Collaborated on frontend and backend integration using React.js, Node.js, and SQL while focusing on responsive UI design, performance optimization, and scalable architecture.",
    skills: ["React.js", "Node.js", "SQL", "Real-time Data"],
  },
];

const projects = [
  {
    name: "NeuroFleet-X",
    desc: "Full-stack fleet management system with real-time dashboards, telemetry tracking, AI-based route optimization and predictive maintenance features.",
    fullDesc:
      "NeuroFleet-X is a comprehensive full-stack fleet management platform built with React.js and Node.js. It features real-time GPS telemetry dashboards, AI-powered route optimization using predictive algorithms, and role-based access control (RBAC) for multi-level user management. The system includes predictive maintenance alerts, live vehicle tracking, fuel analytics, and driver performance scoring — all rendered in a sleek real-time dashboard.",
    tech: ["React.js", "GPS", "AI", "RBAC"],
    github: "#",
    demo: "#",
  },
  {
    name: "Wildfire Detection System",
    desc: "Real-time wildfire monitoring platform using NASA FIRMS API with interactive heatmaps, live location tracking and advanced filtering.",
    fullDesc:
      "A real-time wildfire monitoring platform that ingests live data from NASA's FIRMS (Fire Information for Resource Management System) API. Built with React.js, it renders interactive heatmaps using Leaflet.js, provides advanced geo-based filtering by region and intensity, implements client-side caching for performance, and sends configurable real-time alerts — designed to aid rapid emergency response coordination.",
    tech: ["React.js", "NASA API", "Maps", "Caching"],
    github: "#",
    demo: "#",
  },
  {
    name: "Cybersecurity Awareness Platform",
    desc: "Educational cybersecurity platform focused on awareness, secure practices and basic vulnerability prevention.",
    fullDesc:
      "An educational platform designed to spread cybersecurity awareness among students and professionals. Built with HTML, CSS, and vanilla JavaScript, it features interactive quizzes on phishing, password security, and social engineering; a threat glossary; and gamified learning modules. The platform also covers real-world CVE case studies and basic vulnerability prevention techniques.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "#",
    demo: "#",
  },
  {
    name: "Weather Dashboard",
    desc: "Interactive weather dashboard with live weather updates, forecasts, dynamic UI components and API integration.",
    fullDesc:
      "An interactive weather dashboard that fetches live weather data and 7-day forecasts via a third-party weather API. Built with React.js, it features dynamic animated UI components that change based on current conditions, geolocation-based auto-detection, city search with autocomplete, and beautifully animated weather cards. Includes hourly charts built with Recharts.",
    tech: ["React.js", "Weather API", "CSS", "JavaScript"],
    github: "#",
    demo: "#",
  },
  {
    name: "Portfolio Website",
    desc: "Modern futuristic portfolio website showcasing projects, certifications, leadership experience and creative work.",
    fullDesc:
      "This very portfolio — a futuristic, dark-theme personal website built entirely with React.js and custom CSS. Features include a cinematic loader sequence, a custom cybersecurity-scope cursor, parallax hero animations, timeline journey section, interactive project cards, and a collage photo gallery. Every section was crafted with attention to micro-interactions and aesthetic cohesion.",
    tech: ["React.js", "CSS", "JavaScript"],
    github: "#",
    demo: "https://portfolio-zeta-blond-60.vercel.app/",
  },
];

const certifications = [
  {
    title: "Cybersecurity Trainee — Palo Alto Networks",
    issuer: "Coursera",
    year: "2025",
    file: "/certificates/palo_alto.pdf",
  },
  {
    title: "Deloitte Cyber Job Simulation",
    issuer: "Forage",
    year: "2025",
    file: "/certificates/cyber_job_d.pdf",
  },
  {
    title: "Cyber Security Fundamentals",
    issuer: "Infosys Springboard",
    year: "2025",
    file: "/certificates/infosys_cyber.pdf",
  },
  {
    title: "JPMorgan Chase Software Engineering Job Simulation",
    issuer: "Forage",
    year: "2025",
    file: "/certificates/jpmorgan.pdf",
  },
  {
    title: "Foundations of Cybersecurity — Google",
    issuer: "Coursera",
    year: "2025",
    file: "/certificates/google.pdf",
  },
  {
    title: "TATA: Cybersecurity Analyst Job Simulation",
    issuer: "Forage",
    year: "2025",
    file: "/certificates/tata.pdf",
  },
  {
    title: "Meta Full Stack Developer Professional Certificate",
    issuer: "Coursera",
    year: "2025",
    file: "/certificates/meta.pdf",
  },
  {
    title: "Self-Driving Cars Specialization",
    issuer: "Coursera",
    year: "2025",
    file: "/certificates/SDC.pdf",
  },
];

const statusLines = [
  { label: "Initializing portfolio system", delay: 0.3, value: "OK" },
  { label: "Loading cybersecurity modules", delay: 0.8, value: "READY" },
  { label: "Mounting web components", delay: 1.3, value: "DONE" },
  { label: "Verifying credentials", delay: 1.8, value: "PASS" },
  { label: "Rendering interface", delay: 2.3, value: "100%" },
];

const collagePhotos = [
  { src: "/nss1.jpeg", label: "NSS CAMP", cls: "cp1" },
  { src: "/nss4.png", label: "OUTREACH", cls: "cp2" },
  { src: "/nss3.jpeg", label: "VOLUNTEER", cls: "cp3" },
  { src: "/nss5.png", label: "CREATIVE", cls: "cp4" },
  { src: "/nss2.jpeg", label: "TEAMWORK", cls: "cp5" },
  { src: "/nss6.png", label: "EVENT", cls: "cp6" },
  { src: "/nss7.png", label: "CAMPUS", cls: "cp7" },
  { src: "/nss8.png", label: "COMMUNITY", cls: "cp8" },
];

/* ── LOADER ── */
function Loader({ onDone }) {
  const [count, setCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState(-1);
  useEffect(() => {
    const timers = statusLines.map((s, i) =>
      setTimeout(() => setActiveStatus(i), s.delay * 1000),
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    let val = 0;
    const id = setInterval(() => {
      val += Math.random() * 3 + 0.5;
      if (val >= 100) {
        val = 100;
        clearInterval(id);
      }
      setCount(Math.floor(val));
    }, 40);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const t = setTimeout(onDone, 4800);
    return () => clearTimeout(t);
  }, [onDone]);
  const name = "SAGARIKA";
  return (
    <div className="loader-overlay">
      <div className="loader-grid" />
      <div className="loader-scanline" />
      <div className="loader-flash" />
      {["tl", "tr", "bl", "br"].map((c) => (
        <div className={`loader-corner ${c}`} key={c} />
      ))}
      <div className="loader-center">
        <div className="loader-name" style={{ position: "relative" }}>
          <span className="loader-name-ghost" aria-hidden>
            {name}
          </span>
          {name.split("").map((ch, i) => (
            <span
              key={i}
              className="char"
              style={{
                animationDelay: `${i * 0.08}s`,
                color: i === 3 ? "var(--accent)" : "var(--text)",
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="loader-status-wrap">
          {statusLines.map((s, i) => {
            const state =
              i < activeStatus ? "done" : i === activeStatus ? "active" : "";
            if (i > activeStatus) return null;
            return (
              <div
                key={i}
                className={`status-line ${state}`}
                style={{ animationDelay: `${s.delay}s` }}
              >
                <div className="dot" />
                <span>{s.label}</span>
                {state === "done" && (
                  <span className="status-val">{s.value}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="loader-bar-section">
          <div className="loader-bar-row">
            <span className="loader-bar-label">Loading Portfolio</span>
            <span className="loader-count">{count}%</span>
          </div>
          <div className="loader-bar-track">
            <div className="loader-bar-fill" style={{ width: `${count}%` }} />
            <div
              className="loader-bar-glow"
              style={{ right: `${100 - count}%` }}
            />
          </div>
        </div>
        <p className="loader-tagline">Cybersecurity · Web Dev · AI/ML</p>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [loaderExit, setLoaderExit] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [projModal, setProjModal] = useState(null);
  const [callmeOpen, setCallmeOpen] = useState(false);
  const observerRef = useRef(null);

  const handleLoaderDone = () => {
    setLoaderExit(true);
    setTimeout(() => setLoading(false), 1000);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY });
    const over = (e) =>
      setHovering(
        e.target.tagName === "A" ||
          e.target.tagName === "BUTTON" ||
          !!e.target.closest("a,button"),
      );
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    observerRef.current = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".fade-in")
      .forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [loading]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") {
        setProjModal(null);
        setCallmeOpen(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* CURSOR */}
      <div
        className={`cursor-glow${hovering ? " hovering" : ""}`}
        style={{ left: cursor.x, top: cursor.y }}
      />
      <div className="cursor-dot" style={{ left: cursor.x, top: cursor.y }} />

      {loading && (
        <div className={`loader-overlay ${loaderExit ? "exit" : ""}`}>
          <Loader onDone={handleLoaderDone} />
        </div>
      )}

      {/* PROJECT MODAL */}
      <div
        className={`proj-modal-overlay ${projModal ? "open" : ""}`}
        onClick={() => setProjModal(null)}
      >
        <div className="proj-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="proj-modal-close"
            onClick={() => setProjModal(null)}
          >
            ✕
          </button>
          {projModal && (
            <>
              <div className="proj-modal-tag">Project Overview</div>
              <div className="proj-modal-title">{projModal.name}</div>
              <p className="proj-modal-body">{projModal.fullDesc}</p>
              <div className="proj-modal-tech">
                {projModal.tech.map((t) => (
                  <span className="tech-pill" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* CALL ME MODAL */}
      <div
        className={`callme-modal-overlay ${callmeOpen ? "open" : ""}`}
        onClick={() => setCallmeOpen(false)}
      >
        <div className="callme-modal" onClick={(e) => e.stopPropagation()}>
          <button
            className="callme-modal-close"
            onClick={() => setCallmeOpen(false)}
          >
            ✕
          </button>
          <span className="callme-icon">📞</span>
          <div className="callme-title">Let's Talk</div>
          <div className="callme-subtitle">REACH OUT DIRECTLY</div>
          <a href="tel:+919XXXXXXXXX" className="callme-row">
            <div className="callme-row-left">
              <span className="callme-row-icon">📱</span>
              <div>
                <div className="callme-row-label">Phone</div>
                <div className="callme-row-val">+91 7008286360</div>
              </div>
            </div>
            <span className="callme-arrow">→</span>
          </a>
          <a
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="callme-row"
          >
            <div className="callme-row-left">
              <span className="callme-row-icon">💬</span>
              <div>
                <div className="callme-row-label">WhatsApp</div>
                <div className="callme-row-val">Message on WhatsApp</div>
              </div>
            </div>
            <span className="callme-arrow">→</span>
          </a>
          <a href="mailto:sagarika03.naik@gmail.com" className="callme-row">
            <div className="callme-row-left">
              <span className="callme-row-icon">✉️</span>
              <div>
                <div className="callme-row-label">Email</div>
                <div className="callme-row-val">sagarika03.naik@gmail.com</div>
              </div>
            </div>
            <span className="callme-arrow">→</span>
          </a>
          <div className="callme-avail">
            <div className="callme-dot-green" />
            Available for opportunities
          </div>
        </div>
      </div>

      {!loading && (
        <>
          <div className="noise" />

          {/* NAV */}
          <nav className={scrolled ? "scrolled" : ""}>
            <div className="nav-logo">
              Sagarika <span>.</span>
            </div>
            <ul className="nav-links">
              {[
                "about",
                "skills",
                "journey",
                "internship",
                "projects",
                "certifications",
                "beyond",
                "contact",
              ].map((s) => (
                <li key={s}>
                  <a href={`#${s}`}>{s}</a>
                </li>
              ))}
            </ul>
            <button
              className="nav-cta"
              onClick={() =>
                document
                  .getElementById("contact")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              HIRE ME
            </button>
          </nav>

          {/* HERO */}
          <section className="hero" id="hero">
            <div className="hero-grid" />
            <div className="hero-image">
              <img src="/portfolio.png.jpeg" alt="Sagarika" />
            </div>
            <h1 className="hero-name">
              <div>SAGARIKA</div>
              <div className="line2">NAIK</div>
            </h1>
            <div className="hero-tag">
              CYBERSECURITY • WEB DEVELOPMENT • AI/ML
            </div>
            <p className="hero-subtitle">
              Crafting secure, intelligent, and visually striking digital
              experiences — blending modern web development, AI innovation, and
              creative technology into impactful solutions.
            </p>
            <div className="hero-buttons">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="resume-btn"
              >
                ↓ Resume
              </a>
              <a href="#about" className="scroll-btn">
                Explore ↓
              </a>
            </div>
            <div className="hero-bottom">
              <div className="hero-scroll">
                <div className="scroll-line" />
                scroll to explore
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-num">
                    4<span>+</span>
                  </div>
                  <div className="stat-label">Projects</div>
                </div>
                <div className="stat">
                  <div className="stat-num">
                    7<span>+</span>
                  </div>
                  <div className="stat-label">Certificates</div>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section className="about" id="about">
            <div className="section-header fade-in">
              <h2 className="section-title">About</h2>
              <div className="section-line" />
            </div>
            <div className="about-grid fade-in">
              <div className="about-text">
                <p>
                  <strong style={{ fontWeight: "bold", color: "#e8ff47" }}>
                    Driven by creativity and powered by code —&nbsp;
                  </strong>
                  I build modern digital experiences that are both functional
                  and visually striking. I enjoy crafting interactive UI
                  designs, smooth animations, and immersive web experiences that
                  blend creativity with technology.
                </p>
                <p>
                  <strong style={{ fontWeight: "bold", color: "#e8ff47" }}>
                    With a strong passion for cybersecurity,&nbsp;
                  </strong>
                  I love exploring secure systems, ethical hacking, threat
                  analysis, and modern digital defense techniques. Alongside
                  cybersecurity, I actively dive into Generative AI and AI/ML to
                  create intelligent, innovative, and future-focused solutions.
                </p>
              </div>
              <div className="about-aside">
                {[
                  ["Location", "Bhubaneswar, India"],
                  ["Available", "Open to Opportunities"],
                  ["Pronouns", "She/Her"],
                  ["Languages", "English, Hindi, Odia"],
                  ["Education", "B.Tech. Computer Science"],
                  ["Interests", "Cybersecurity, AI/ML, UI Design"],
                ].map(([l, v]) => (
                  <div className="aside-item" key={l}>
                    <span className="aside-label">{l}</span>
                    <span className="aside-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SKILLS — all cards now use tagClass() */}
          <section className="skills" id="skills">
            <div className="section-header fade-in">
              <h2 className="section-title">Skills</h2>
              <div className="section-line" />
            </div>
            <div className="skills-grid fade-in">
              {skills.map((s) => (
                <div className="skill-card" key={s.name}>
                  <div className="skill-icon">{s.icon}</div>
                  <div className="skill-name">{s.name}</div>
                  <div className="skill-tags">
                    {s.tags.map((t) => (
                      <span className={`skill-tag ${tagClass(t)}`} key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* JOURNEY */}
          <section className="journey" id="journey">
            <div className="section-header fade-in">
              <h2 className="section-title">My Journey</h2>
              <div className="section-line" />
            </div>
            <div className="timeline-enhanced fade-in">
              <div className="timeline-spine" />
              {timeline.map((item, i) => (
                <div className="timeline-entry" key={i}>
                  {/* timeline-left is now visible on mobile — rendered as a row */}
                  <div className="timeline-left">
                    {/* On mobile these two siblings sit side-by-side via flex-row */}
                    <div className="timeline-left-text">
                      <div className="timeline-year-big">{item.yearStart}</div>
                      <div className="timeline-year-end">{item.yearEnd}</div>
                    </div>
                    <div className="timeline-logo-slot" title={item.logoAlt}>
                      {item.logoSrc ? (
                        <img src={item.logoSrc} alt={item.logoAlt} />
                      ) : (
                        <div className="timeline-logo-placeholder">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="4" />
                            <circle cx="12" cy="10" r="3" />
                            <path d="M6 21v-1a6 6 0 0112 0v1" />
                          </svg>
                          Add Logo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="timeline-node">
                    <div className="timeline-node-ring" />
                  </div>
                  <div className="timeline-right">
                    <div className="timeline-badge-new">{item.badge}</div>
                    <div className="timeline-title-new">{item.title}</div>
                    <div className="timeline-org-new">{item.org}</div>
                    <p className="timeline-desc-new">{item.desc}</p>
                    <div className="timeline-chips">
                      {item.chips.map((c) => (
                        <span className="timeline-chip" key={c}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* INTERNSHIP */}
          <section className="internship" id="internship">
            <div className="section-header fade-in">
              <h2 className="section-title">Internship</h2>
              <div className="section-line" />
            </div>
            <div className="intern-grid fade-in">
              {internships.map((intern, i) => (
                <div className="intern-card" key={i}>
                  <div className="intern-company">{intern.company}</div>
                  <div className="intern-role">{intern.role}</div>
                  <div className="intern-period">{intern.period}</div>
                  <p className="intern-desc">{intern.desc}</p>
                  <div className="intern-skills">
                    {intern.skills.map((s) => (
                      <span className="intern-pill" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PROJECTS */}
          <section className="projects" id="projects">
            <div className="section-header fade-in">
              <h2 className="section-title">Projects</h2>
              <div className="section-line" />
            </div>
            <div className="projects-list">
              {projects.map((p, i) => (
                <div
                  className="project-item fade-in"
                  key={p.name}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <span className="project-num">0{i + 1}</span>
                  <div className="project-info">
                    <div className="project-name">{p.name}</div>
                    <div className="project-desc">{p.desc}</div>
                    <div className="project-tech">
                      {p.tech.map((t) => (
                        <span className="tech-pill" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="project-actions">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-btn proj-btn-github"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-btn proj-btn-demo"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live Demo
                    </a>
                    <button
                      className="proj-btn proj-btn-desc"
                      onClick={() => setProjModal(p)}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Description
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CERTIFICATIONS */}
          <section className="certifications" id="certifications">
            <div className="section-header fade-in">
              <h2 className="section-title">Certifications</h2>
              <div className="section-line" />
            </div>
            <div className="cert-grid fade-in">
              {certifications.map((cert, i) => (
                <div className="cert-card" key={i}>
                  <div className="cert-year">{cert.year}</div>
                  <div className="cert-title">{cert.title}</div>
                  <div className="cert-issuer">{cert.issuer}</div>
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-open-btn"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                    View Certificate
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* BEYOND */}
          <section className="beyond" id="beyond">
            <div className="section-header fade-in">
              <h2 className="section-title">Beyond Academics</h2>
              <div className="section-line" />
            </div>
            <div className="beyond-hero-row fade-in">
              <div className="beyond-cards-col">
                <div className="beyond-card-enhanced">
                  <div className="beyond-card-top">
                    <div className="beyond-icon-box">🌱</div>
                    <div className="beyond-card-header">
                      <div className="beyond-card-title">NSS Volunteer</div>
                      <div className="beyond-card-role">
                        National Service Scheme
                      </div>
                    </div>
                  </div>
                  <p className="beyond-card-desc">
                    Actively engaged in community service, awareness drives and
                    social impact initiatives. Contributed to collaborative
                    volunteering programs, rural outreach camps, and cleanliness
                    & health campaigns, making tangible differences in local
                    communities.
                  </p>
                  <div className="beyond-card-tags">
                    {[
                      "Community Service",
                      "Social Impact",
                      "Rural Outreach",
                      "Teamwork",
                      "Leadership",
                    ].map((t) => (
                      <span className="beyond-tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="beyond-stat-strip">
                    <div className="beyond-stat-item">
                      <div className="beyond-stat-num">10+</div>
                      <div className="beyond-stat-lbl">Events</div>
                    </div>
                    <div className="beyond-stat-item">
                      <div className="beyond-stat-num">1+</div>
                      <div className="beyond-stat-lbl">Campaigns</div>
                    </div>
                    <div className="beyond-stat-item">
                      <div className="beyond-stat-num">3</div>
                      <div className="beyond-stat-lbl">Yrs Active</div>
                    </div>
                    <div className="beyond-stat-item">
                      <div className="beyond-stat-num">50+</div>
                      <div className="beyond-stat-lbl">Hrs Service</div>
                    </div>
                  </div>
                </div>
                <div className="beyond-card-enhanced">
                  <div className="beyond-card-top">
                    <div className="beyond-icon-box">🎨</div>
                    <div className="beyond-card-header">
                      <div className="beyond-card-title">
                        Creative Team Lead
                      </div>
                      <div className="beyond-card-role">
                        Design & Visual Direction
                      </div>
                    </div>
                  </div>
                  <p className="beyond-card-desc">
                    Directed visual and creative operations including poster
                    design, event promotions and digital content creation. Led
                    collaborative creative projects from concept to execution,
                    blending aesthetic sensibility with technical skill.
                  </p>
                  <div className="beyond-card-tags">
                    {[
                      "Poster Design",
                      "Event Branding",
                      "Digital Content",
                      "Creative Direction",
                      "UI/UX",
                    ].map((t) => (
                      <span className="beyond-tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="beyond-stat-strip">
                    <div className="beyond-stat-item">
                      <div className="beyond-stat-num">15+</div>
                      <div className="beyond-stat-lbl">Designs</div>
                    </div>
                    <div className="beyond-stat-item">
                      <div className="beyond-stat-num">8+</div>
                      <div className="beyond-stat-lbl">Events Led</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="beyond-collage">
                {collagePhotos.map((photo, i) => (
                  <div className={`collage-photo ${photo.cls}`} key={i}>
                    <img src={photo.src} alt={photo.label} />
                    <div className="collage-label">{photo.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="beyond-strip fade-in">
              <div className="beyond-strip-item">
                <div className="strip-icon">🎤</div>
                <div className="strip-title">Event Organizer</div>
                <p className="strip-text">
                  Helped plan and coordinate technical and cultural events at
                  Silicon University — handling logistics, outreach, and
                  creative execution end-to-end.
                </p>
              </div>
              <div className="beyond-strip-item">
                <div className="strip-icon">📚</div>
                <div className="strip-title">Continuous Learner</div>
                <p className="strip-text">
                  Consistently upskilling through Coursera, Forage, and
                  self-directed projects — believing that curiosity and
                  consistency are the best competitive edges.
                </p>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="contact" id="contact">
            <div className="section-header fade-in">
              <h2 className="section-title">Contact</h2>
              <div className="section-line" />
            </div>
            <div className="contact-inner fade-in">
              <div className="contact-headline">
                Let's build
                <br />
                something
                <br />
                <span className="accent">big.</span>
              </div>
              <div className="contact-links">
                <a
                  href="mailto:sagarika03.naik@gmail.com"
                  className="contact-btn"
                >
                  <span>Send Email</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/sagarikanaik/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn"
                >
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://github.com/sagarika-bit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
                <button
                  className="contact-btn"
                  onClick={() => setCallmeOpen(true)}
                >
                  <span>Call Me</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer>
            <div className="footer-copy">
              © 2026 <span>Sagarika Naik</span>
            </div>
            <div
              className="footer-center"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--muted)",
              }}
            >
              Built with passion, creativity & code ✨
            </div>
            <a href="#hero" className="footer-back">
              Back to Top ↑
            </a>
          </footer>
        </>
      )}
    </>
  );
}
