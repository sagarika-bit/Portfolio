import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --bg2: #111111;
    --surface: #161616;
    --border: #222222;
    --accent: #e8ff47;
    --accent2: #ff6b35;
    --text: #f0f0f0;
    --muted: #666666;
    --muted2: #333333;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-display);
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 100;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 150px;
  }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 48px;
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s, background 0.3s, padding 0.3s;
  }
  nav.scrolled {
    border-color: var(--border);
    background: rgba(10,10,10,0.9);
    backdrop-filter: blur(12px);
    padding: 16px 48px;
  }
  .nav-logo {
    font-size: 20px; font-weight: 800; letter-spacing: -0.5px;
    color: var(--text);
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a {
    font-family: var(--font-mono); font-size: 13px; color: var(--muted);
    text-decoration: none; letter-spacing: 0.05em;
    transition: color 0.2s;
    position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0;
    width: 0; height: 1px; background: var(--accent);
    transition: width 0.3s;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta {
    font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em;
    background: var(--accent); color: #000; border: none;
    padding: 10px 20px; cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    font-weight: 400;
  }
  .nav-cta:hover { background: #fff; transform: translateY(-1px); }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 150px 48px 80px;
    position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
    opacity: 0.4;
  }
    .hero-image{
  position:absolute;
  right:70px;
  top:47%;
  transform:translateY(-50%);
}

.hero-image img{
  width:340px;
  height:340px;
  object-fit:cover;
  border-radius:24px;
  border:2px solid var(--accent);
  box-shadow:0 0 30px rgba(232,255,71,0.15);
}
  .hero-image::before{
  content:'';
  position:absolute;
  inset:-15px;
  background:var(--accent);
  filter:blur(80px);
  opacity:0.15;
  z-index:-1;
}
  .hero-image{
  position:absolute;
}
.hero-buttons{
  margin-top:32px;
}

.resume-btn{
  display:inline-flex;
  align-items:center;
  gap:10px;

  padding:14px 28px;

  background:var(--accent);
  color:#000;

  text-decoration:none;
  font-family:var(--font-mono);
  font-size:13px;
  letter-spacing:0.08em;

  border-radius:40px;

  transition:0.3s ease;
  font-weight:600;
}

.resume-btn:hover{
  transform:translateY(-4px);
  box-shadow:0 0 30px rgba(255,43,214,0.35);
}
@media (max-width:768px){

  .hero-image{
    position:relative;
    right:auto;
    top:auto;
    transform:none;
    margin-top:40px;
  }

  .hero-image img{
    width:220px;
    height:220px;
  }
}
  .hero-tag {
    font-family: var(--font-mono); font-size: 13px; color: var(--accent);
    letter-spacing: 0.15em; text-transform: uppercase;
    margin-top: 20px;
    margin-bottom: 10px;
    animation: fadeUp 0.6s ease both;
  }
  .hero-name {
    font-size: clamp(56px, 10vw, 120px);
    font-weight: 800; line-height: 0.9;
    letter-spacing: -3px;
    animation: fadeUp 0.6s ease 0.1s both;
  }
  .hero-name .line2 { color: var(--muted); }
  .hero-subtitle {
    margin-top: 28px; max-width: 700px;
    font-family: var(--font-mono); font-size: 14px; line-height: 1.8;
    color: var(--muted); font-style: italic;
    animation: fadeUp 0.6s ease 0.2s both;
  }
  .hero-bottom {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-top: 50px;
    animation: fadeUp 0.6s ease 0.3s both;
  }
  .hero-scroll {
    display: flex; align-items: center; gap: 12px;
    font-family: var(--font-mono); font-size: 12px; color: var(--muted);
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .scroll-line {
    width: 60px; height: 1px; background: var(--muted2);
    position: relative; overflow: hidden;
  }
  .scroll-line::after {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%; background: var(--accent);
    animation: scrollLine 2s ease-in-out infinite;
  }
  @keyframes scrollLine {
    0% { left: -100%; } 100% { left: 100%; }
  }
  .hero-stats { display: flex; gap: 48px; }
  .stat { text-align: right; }
  .stat-num {
    font-size: 36px; font-weight: 800; letter-spacing: -2px;
    line-height: 1;
  }
  .stat-num span { color: var(--accent); }
  .stat-label {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em;
    margin-top: 4px;
  }

  /* SECTION BASE */
  section { padding: 120px 48px; }
  .section-header {
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 80px;
  }
  .section-num {
    font-family: var(--font-mono); font-size: 12px;
    color: var(--accent); letter-spacing: 0.1em;
  }
  .section-title {
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 800; letter-spacing: -2px; line-height: 1;
  }
  .section-line {
    flex: 1; height: 1px; background: var(--border);
    max-width: 200px;
  }

  /* ABOUT */
  .about { background: var(--bg2); border-top: 1px solid var(--border); }
  .about-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
    align-items: start;
  }
  .about-text p {
    font-size: 18px; line-height: 1.8; color: #aaa;
    font-weight: 400; letter-spacing: -0.2px;
    margin-bottom: 20px;
  }
  .about-text p strong { color: var(--text); }
  .about-aside { display: flex; flex-direction: column; gap: 1px; }
  .aside-item {
    display: flex; justify-content: space-between;
    padding: 20px 0;
    border-bottom: 1px solid var(--border);
    font-family: var(--font-mono); font-size: 13px;
  }
  .aside-label { color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .aside-val { color: var(--text); }

  /* SKILLS */
  .skills { background: var(--bg); }
  .skills-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1px; border: 1px solid var(--border);
  }
  .skill-card {
    background: var(--bg);
    padding: 32px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    transition: background 0.3s;
    cursor: default;
  }
  .skill-card:hover { background: var(--surface); }
  .skill-icon { font-size: 28px; margin-bottom: 16px; }
  .skill-name {
    font-size: 20px; font-weight: 700;
    margin-bottom: 12px; letter-spacing: -0.5px;
    color: #e8ff47;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--muted); background: var(--muted2);
    padding: 4px 10px; letter-spacing: 0.05em;
  }
  .skill-card:hover .skill-tag { background: #1e1e1e; }

  /* PROJECTS */
  .projects { background: var(--bg2); border-top: 1px solid var(--border); }
  .projects-list { display: flex; flex-direction: column; gap: 1px; }
  .project-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  align-items: center;
  gap: 40px;
  padding: 36px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: padding 0.3s;
  position: relative;
  text-decoration: none;
}
  .project-name{
  text-decoration:none;
}
  .project-item::before {
    content: ''; position: absolute; left: -48px; top: 0; bottom: 0;
    width: 2px; background: var(--accent);
    transform: scaleY(0); transform-origin: top;
    transition: transform 0.3s;
  }
  .project-item:hover::before { transform: scaleY(1); }
  .project-item:hover { padding-left: 16px; }
  .project-num {
    font-family: var(--font-mono); font-size: 13px;
    color: var(--muted); letter-spacing: 0.1em;
  }
  .project-info { }
  .project-name {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px
  margin-bottom: 8px;
}
  .project-desc {
    font-family: var(--font-mono); font-size: 13px;
    color: var(--muted); ;
  }
  .project-tech { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .tech-pill {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--accent); border: 1px solid var(--accent);
    padding: 3px 10px; letter-spacing: 0.05em;
    opacity: 0.7;
  }
  .project-arrow {
    font-size: 24px; color: var(--muted);
    transition: color 0.2s, transform 0.3s;
    font-weight: 300;
  }
  .project-item:hover .project-arrow {
    color: var(--accent); transform: translate(4px, -4px);
  }

  .certifications{
  padding:120px !important;
  background: var(--bg);
  border-top: 1px solid var(--border);
}

.cert-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:24px;
}

.cert-card{
  background:var(--surface);
  border:1px solid var(--border);
  padding:28px;
  border-radius:20px;
  transition:0.3s ease;
  text-decoration: none;
  color: var(--text);
  display: block;
}

.cert-card:hover{
  transform:translateY(-6px);
  border-color:var(--accent);
  box-shadow:0 0 30px rgba(232,255,71,0.08);
  text-decoration: none;
  color: var(--text);
}

.cert-year{
  color:var(--accent);
  font-family:var(--font-mono);
  margin-bottom:12px;
  font-size:13px;
}

.cert-title{
  font-size:22px;
  font-weight:700;
  margin-bottom:10px;
}

.cert-issuer{
  color:var(--muted);
  font-family:var(--font-mono);
  font-size:13px;
}

.beyond{
  background: var(--bg2);
  border-top: 1px solid var(--border);
}

.beyond-container{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:60px;
}

.beyond-left{
  flex:1;
  display:flex;
  flex-direction:column;
  gap:24px;
}

.beyond-card{
  display:flex;
  gap:20px;
  background:var(--surface);
  border:1px solid var(--border);
  padding:24px;
  border-radius:24px;
  transition:0.3s ease;
}

.beyond-card:hover{
  transform:translateY(-6px);
  border-color:var(--accent);
}

.beyond-icon{
  font-size:28px;
}

.beyond-card h3{
  font-size:22px;
  margin-bottom:10px;
}

.beyond-card p{
  color:var(--muted);
  line-height:1.7;
  font-size:14px;
}

.beyond-right{
  flex:1;
  position:relative;
  min-height:420px;
}

.beyond-right img{
  position:absolute;
  width:220px;
  height:280px;
  object-fit:cover;
  border-radius:24px;
  border:2px solid var(--border);
  transition:0.4s ease;
}

.beyond-right img:hover{
  transform:scale(1.04) rotate(0deg);
  z-index:5;
}

.img1{
  top:0;
  left:40px;
  transform:rotate(-8deg);
}

.img2{
  top:120px;
  left:220px;
  transform:rotate(8deg);
}

.img3{
  top:200px;
  left:60px;
  transform:rotate(-4deg);
}

.img4{
  top:40px;
  left:380px;
  transform:rotate(-10deg);
}

.img5{
  top:240px;
  left:370px;
  transform:rotate(10deg);
}
@media(max-width:768px){

  .beyond-container{
    flex-direction:column;
  }

  .beyond-right{
    width:100%;
    min-height:500px;
  }

  .beyond-right img{
    width:170px;
    height:220px;
  }

  .img2{
    left:140px;
  }
}

  /* CONTACT */
  .contact { background: var(--bg); border-top: 1px solid var(--border); }
  .contact-inner{
  width:100%;
  display:grid;
  grid-template-columns:1.1fr 0.9fr;
  gap:80px;
  align-items:start;
}
  .contact-right{
  background:rgba(255,255,255,0.03);
  border:1px solid var(--border);
  border-radius:28px;
  padding:32px;
  backdrop-filter:blur(10px);
}
  .contact-links{
  display:flex;
  flex-direction:column;
  gap:24px;
}
  .contact-link{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:20px 0;
  border-bottom:1px solid rgba(255,255,255,0.08);
  text-decoration:none;
  color:var(--text);
  transition:0.3s ease;
}

.contact-link:hover{
  padding-left:10px;
}
  .contact-link:hover{
  padding-left:10px;
}
  .contact-headline {
    font-size: clamp(40px, 6vw, 80px);
    font-weight: 800; letter-spacing: -3px; line-height: 0.95;
    margin-bottom: 48px;
  }
  .contact-headline .accent { color: var(--accent); }
  .contact-links { display: flex; flex-direction: column; gap: 1px; }
  .contact-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none; color: var(--text);
    transition: padding 0.2s;
    group: true;
  }
  .contact-link:hover { padding-left: 16px; }
  .link-label {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--muted); text-transform: uppercase;
    letter-spacing: 0.15em; margin-bottom: 4px;
  }
  .link-val { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
  .link-arrow {
    font-size: 20px; color: var(--muted);
    transition: color 0.2s, transform 0.2s;
  }
  .contact-link:hover .link-arrow {
    color: var(--accent); transform: translate(4px, -4px);
  }

  .contact-links{
  display:flex;
  flex-direction:column;
  gap:20px;
}

.contact-btn{
  display:flex;
  align-items:center;
  justify-content:space-between;

  padding:18px 24px;

  background:var(--surface);
  border:1px solid var(--border);

  border-radius:18px;

  color:var(--text);
  text-decoration:none;

  font-family:var(--font-mono);
  font-size:14px;
  letter-spacing:0.08em;

  transition:0.3s ease;
}

.contact-btn:hover{
  transform:translateY(-4px);
  border-color:var(--accent);
  box-shadow:0 0 25px rgba(232,255,71,0.08);
}

  /* FOOTER */
  footer {
    padding: 32px 48px;
    border-top: 1px solid var(--border);
    display: grid; 
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }
  .footer-copy {
  justify-self: start;
    font-family: var(--font-mono); font-size: 12px; color: var(--muted);
  }
  .footer-copy span { color: var(--accent); }
  
  .footer-center{
  display:flex;
  justify-self:center;
  align-items:center;
  }
  .footer-back {
  justify-self: end;
    font-family: var(--font-mono); font-size: 12px;
    color: var(--muted); text-decoration: none; letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .footer-back:hover { color: var(--accent); }

  

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-in.visible { opacity: 1; transform: none; }

  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    nav.scrolled { padding: 14px 24px; }
    .nav-links, .nav-cta { display: none; }
    .hero { padding: 0 24px 60px; }
    .hero-stats { gap: 24px; }
    section { padding: 80px 24px; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .project-item { grid-template-columns: 60px 1fr auto; gap: 16px; }
    footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
  }
`;

const skills = [
  {
    icon: "⬠",
    name: "Languages",
    tags: ["Java", "C/C++", "Python(Basics)", "JavaScript", "SQL"],
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
    name: "Security Frameworks & Tools",
    tags: [
      "JWT(JSON Web Tokens)",
      "Role-Based Access Control (RBAC)",
      "Secure Coding",
    ],
  },
  {
    icon: "⬟",
    name: "Tools & Platforms",
    tags: ["Git/Github", "NASA FIRMS API", "Linux"],
  },
];

const projects = [
  {
    name: "NeuroFleet-X",
    desc: "Full-stack fleet management system with real-time dashboards, telemetry tracking, AI-based route optimization and predictive maintenance features.",
    tech: ["React.js", "GPS", "AI", "RBAC"],
    link: "#",
  },

  {
    name: "Wildfire Detection System",
    desc: "Real-time wildfire monitoring platform using NASA FIRMS API with interactive heatmaps, live location tracking and advanced filtering.",
    tech: ["React.js", "NASA API", "Maps", "Caching"],
    link: "#",
  },

  {
    name: "Cybersecurity Awareness Platform",
    desc: "Educational cybersecurity platform focused on awareness, secure practices and basic vulnerability prevention.",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "#",
  },
  {
    name: "Weather Dashboard",
    desc: "Interactive weather dashboard with live weather updates, forecasts, dynamic UI components and API integration.",
    tech: ["React.js", "Weather API", "CSS", "JavaScript"],
    link: "#",
  },

  {
    name: "Portfolio Website",
    desc: "Modern futuristic portfolio website showcasing projects, certifications, leadership experience and creative work.",
    tech: ["React.js", "CSS", "JavaScript"],
    link: "#",
  },
  {
    name: "Smart Wearable Gunshot Detection",
    desc: "IoT-based wearable security system using Arduino, LoRa and Bluetooth with real-time alert transmission and GPS-based localization.",
    tech: ["Arduino", "IoT", "LoRa", "Bluetooth"],
    link: "#",
  },
];

const certifications = [
  {
    title: "Cybersecurity Trainee - Palo Alto Networks",
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
    title: "JPMorgan Chase Software Engineering job simulation",
    issuer: "Coursera",
    year: "2025",
    file: "/certificates/jpmorgan.pdf",
  },
  {
    title: "Foundations of cybersecurity-Google",
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
    title: "Self- Driving Cars Specialization",
    issuer: "Coursera",
    year: "2025",
    file: "/certificates/SDC.pdf",
  },
];

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".fade-in")
      .forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>
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

        <div className="hero-tag">CYBERSECURITY • WEB DEVELOPMENT • AI/ML</div>

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
            Resume
          </a>
        </div>
        <div className="hero-bottom">
          <div className="hero-scroll">
            <div className="scroll-line" />
            scroll to explore
          </div>
          <div className="hero-stats">
            <div className="stat"></div>
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
                Driven by creativity and powered by code
              </strong>
              I build modern digital experiences that are both functional and
              visually striking. I enjoy crafting interactive UI designs, smooth
              animations, and immersive web experiences that blend creativity
              with technology.
            </p>
            <p>
              <strong style={{ fontWeight: "bold", color: "#e8ff47" }}>
                With a strong passion for cybersecurity
              </strong>
              , I love exploring secure systems, ethical hacking, threat
              analysis, and modern digital defense techniques. Alongside
              cybersecurity, I actively dive into Generative AI and AI/ML to
              create intelligent, innovative, and future-focused solutions. I
              believe technology is not just about writing code — it’s about
              building experiences, solving real problems, and turning
              imagination into impactful digital reality.
            </p>
          </div>
          <div className="about-aside">
            {[
              ["Location", "Bhubaneswar, India"],
              ["Available", "Open to opportunities"],
              ["Pronouns", "She/Her"],
              ["Languages", "English, Hindi, Odia"],
              ["Education", "B.Tech. Computer Science"],
            ].map(([label, val]) => (
              <div className="aside-item" key={label}>
                <span className="aside-label">{label}</span>
                <span className="aside-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
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
                  <span className="skill-tag" key={t}>
                    {t}
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
            <a
              href={p.link}
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
              <span className="project-arrow">↗</span>
            </a>
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
            <a
              href={cert.file}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-card"
              key={i}
            >
              <div className="cert-year">{cert.year}</div>

              <div className="cert-title">{cert.title}</div>

              <div className="cert-issuer">{cert.issuer}</div>
            </a>
          ))}
        </div>
      </section>

      {/* BEYOND ACADEMICS */}
      <section className="beyond" id="beyond">
        <div className="section-header fade-in">
          <h2 className="section-title">Beyond Academics</h2>
          <div className="section-line" />
        </div>

        <div className="beyond-container fade-in">
          {/* LEFT */}
          <div className="beyond-left">
            <div className="beyond-card">
              <div className="beyond-icon">🌱</div>

              <div>
                <h3>NSS Volunteer</h3>

                <p>
                  Actively engaged in community service, awareness drives and
                  social impact initiatives through NSS while contributing to
                  collaborative volunteering programs.
                </p>
              </div>
            </div>

            <div className="beyond-card">
              <div className="beyond-icon">🎨</div>

              <div>
                <h3>Creative Team Lead</h3>

                <p>
                  Directed visual and creative operations including poster
                  design, event promotions and digital content creation while
                  leading collaborative creative projects.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="beyond-right">
            <img src="/nss1.jpeg" alt="" className="img1" />
            <img src="/nss2.jpeg" alt="" className="img2" />
            <img src="/nss3.jpeg" alt="" className="img3" />
            <img src="/nss5.png" alt="" className="img4" />
            <img src="/nss4.png" alt="" className="img5" />
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
            {/* EMAIL */}
            <a href="mailto:sagarika03.naik@gmail.com" className="contact-btn">
              Send Email ↗
            </a>

            {/* LINKEDIN */}
            <a
              href="https://www.linkedin.com/in/sagarikanaik/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              LinkedIn ↗
            </a>

            {/* GITHUB */}
            <a
              href="https://github.com/sagarikanaik"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              GitHub ↗
            </a>

            {/* CONTACT CARD */}
            <a
              href="/contact-card.html"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              Call Me ↗
            </a>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">© 2026 Sagarika Naik</div>

        <div className="footer-center">
          Built with passion, creativity & code ✨
        </div>

        <div className="footer-back">
          <a href="#hero">Back to Top ↑</a>
        </div>
      </footer>
    </>
  );
}
