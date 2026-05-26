import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Monitor, Zap, Building, HardHat, Wifi, Users, Globe, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, style = {} }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.985)', transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, willChange: 'opacity,transform', ...style }}>
      {children}
    </div>
  );
}

/* ── MagneticCard ───────────────────────────────────────────────────────────── */
function MagneticCard({ children, style = {} }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    ref.current.style.transform = `translateY(-4px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    ref.current.style.setProperty('--mouse-x', `${e.clientX - left}px`);
    ref.current.style.setProperty('--mouse-y', `${e.clientY - top}px`);
  }, []);
  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translateY(0) rotateY(0) rotateX(0)';
  }, []);
  return (
    <div ref={ref} className="pub-card" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="pub-card-glow" />
      {children}
    </div>
  );
}

/* ── BlurUpImg ──────────────────────────────────────────────────────────────── */
function BlurUpImg({ src, alt, style = {} }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img src={src} alt={alt} onLoad={() => setLoaded(true)} style={{
      display: 'block', width: '100%', height: '100%', objectFit: 'cover',
      filter: loaded ? 'blur(0)' : 'blur(20px)',
      transform: loaded ? 'scale(1)' : 'scale(1.04)',
      opacity: loaded ? 1 : 0.7,
      transition: 'filter 0.8s ease, transform 0.8s ease, opacity 0.5s ease',
      ...style,
    }} />
  );
}

/* ── DATA ───────────────────────────────────────────────────────────────────── */
const MILESTONES = [
  { y: '1991', t: 'Establishment', d: 'Founded with 40 students in Diploma-in-Engineering in Electrical Technology under the Directorate of Technical Education, Government of Bangladesh.' },
  { y: '1994', t: 'Civil & Mechanical Added', d: 'Civil Technology and Mechanical Technology departments were introduced, expanding capacity to serve more students across the region.' },
  { y: '1997', t: 'Computer Science & Technology', d: 'The CST department was launched — marking TPI\'s entry into the digital age of technical education.' },
  { y: '2005', t: 'Telecommunication & Construction', d: 'Two additional departments completing the current set of six diploma programs.' },
  { y: '2010', t: 'Infrastructure Expansion', d: 'Major campus development — new laboratories, workshops, a central library, and dedicated buildings per department.' },
  { y: '2024', t: 'Connect Campus Launched', d: 'Digital campus management platform introduced to unify academic records, communication, and administrative services.' },
];

const DEPTS = [
  { name: 'Computer Science & Technology', short: 'CST', Icon: Monitor, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', seats: 100, shifts: 2, labs: ['Software Lab', 'Hardware Lab', 'Network Lab', 'Multimedia Lab'], courses: ['OOP', 'Web Development', 'Database Mgmt', 'Cyber Security', 'Microcontroller', 'Network Admin'], career: 'Sub-Assistant Engineer in govt/private sector; freelancing in web, graphics; employment in Middle East, Japan, Korea, Canada, Australia, UK, Singapore.' },
  { name: 'Electrical Technology', short: 'EET', Icon: Zap, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', seats: 100, shifts: 2, labs: ['Electrical Machines Lab', 'Basic Electrical Lab', 'Electronics Lab', 'Power Lab'], courses: ['Circuit Analysis', 'Electrical Machines', 'Power Electronics', 'Industrial Drives', 'PLC & Automation', 'Renewable Energy'], career: 'Employment in power generation, distribution, and industrial sectors across Bangladesh and abroad.' },
  { name: 'Civil Technology', short: 'CT', Icon: Building, color: '#10B981', bg: 'rgba(16,185,129,0.08)', seats: 100, shifts: 2, labs: ['Surveying Lab', 'Concrete Lab', 'Soil Testing Lab', 'Drawing Room'], courses: ['Structural Engineering', 'Surveying', 'Soil Mechanics', 'Construction Mgmt', 'Estimation', 'Environmental Eng.'], career: 'Sub-Assistant Engineer in LGED, Roads & Highways, PWD; construction project management in private sector.' },
  { name: 'Mechanical Technology', short: 'MT', Icon: HardHat, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', seats: 100, shifts: 2, labs: ['Machine Shop', 'Welding Shop', 'Fitting Shop', 'Automotive Lab'], courses: ['Engineering Drawing', 'Applied Mechanics', 'Thermodynamics', 'Manufacturing', 'Machine Design', 'Fluid Mechanics'], career: 'Employment in garments, shipbuilding, automobile sector, and manufacturing plants locally and abroad.' },
  { name: 'Telecommunication Technology', short: 'TT', Icon: Wifi, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', seats: 50, shifts: 1, labs: ['Telecom Lab', 'Fiber Optics Lab', 'Antenna Lab'], courses: ['Signal Processing', 'Fiber Optics', 'Mobile Communication', 'Antenna Theory', 'Network Protocols', 'Satellite Comms'], career: 'Employment in telecom companies — Grameenphone, Robi, Banglalink, BTCL and international telecom sectors.' },
  { name: 'Construction Technology', short: 'CoT', Icon: Building, color: '#06B6D4', bg: 'rgba(6,182,212,0.08)', seats: 50, shifts: 1, labs: ['Construction Lab', 'Materials Lab', 'Workshop'], courses: ['Building Construction', 'Project Planning', 'Material Science', 'Estimation', 'Safety Mgmt', 'CAD for Construction'], career: 'Site engineer and project coordinator roles in construction companies and real estate developers.' },
];

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const navigate = useNavigate();
  const [activeDept, setActiveDept] = useState(0);

  const bgRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) bgRef.current.style.transform = `scale(1.04) translateY(${window.scrollY * 0.04}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const d = DEPTS[activeDept];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ── */}
      <section className="pub-hero" style={{ minHeight: '56vh' }}>
        <div ref={bgRef} className="pub-hero-bg" style={{ backgroundImage: 'url(/images/Slider_one.jpg)' }} />
        <div className="pub-hero-overlay" />
        <div className="pub-hero-noise" />
        <div className="pub-hero-content">
          <div className="pub-hero-eyebrow">
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--p-gold)', flexShrink: 0 }} />
            Tangail Polytechnic Institute · Est. 1991
          </div>
          <h1 className="pub-hero-title" style={{ fontSize: 'clamp(2.25rem,5vw,3.75rem)' }}>About the Institute</h1>
          <p className="pub-hero-sub">Over three decades of technical excellence — টাঙ্গাইল পলিটেকনিক ইনস্টিটিউট.</p>
        </div>
      </section>

      {/* ── QUICK FACTS ── */}
      <div className="pub-stats-row">
        {[['1991', 'Est.'], ['6', 'Departments'], ['BTEB', 'Board'], ['4 Yrs', 'Duration'], ['2', 'Shifts/Dept']].map(([v, l], i) => (
          <div key={i} className="pub-stat-cell" style={{ borderRight: i < 4 ? '1px solid var(--p-border)' : 'none' }}>
            <div className="pub-stat-number" style={{ fontSize: '1.75rem' }}>{v}</div>
            <div className="pub-stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* ── INTRODUCTION ── */}
      <section className="pub-section pub-section-dark">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3.5rem', alignItems: 'flex-start' }}>
          <Reveal style={{ flex: '1 1 380px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--p-border)', aspectRatio: '4/3', position: 'relative' }}>
              <BlurUpImg src="/images/slider_three.jpg" alt="TPI Campus" style={{ position: 'absolute', inset: 0 }} />
            </div>
          </Reveal>
          <Reveal delay={120} style={{ flex: '1 1 360px' }}>
            <p className="pub-eyebrow">Introduction</p>
            <h2 className="pub-headline">টাঙ্গাইল পলিটেকনিক ইনস্টিটিউট</h2>
            {[
              'Tangail Polytechnic Institute is a government polytechnic located in Tangail Sadar, Dhaka Division, Bangladesh. It operates under the Directorate of Technical Education, Ministry of Education.',
              'Founded in 1991 with 40 students in Electrical Technology, the institute expanded significantly over the following decade, adding Computer Science, Civil, Mechanical, Telecommunication, and Construction departments.',
              'All programs are conducted under the Bangladesh Technical Education Board (BTEB) — a 4-year, 8-semester diploma with practical laboratory components and industrial attachment.',
            ].map((t, i) => (
              <p key={i} style={{ fontSize: '0.9375rem', color: 'var(--p-subtle)', lineHeight: 1.8, marginBottom: '0.875rem', maxWidth: '52ch' }}>{t}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="pub-section pub-section-subtle">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">Purpose</p>
            <h2 className="pub-headline" style={{ marginBottom: '3rem' }}>Mission &amp; Vision</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1rem' }}>
            {[
              { t: 'Mission', pts: ['Quality technical education aligned with national and global industry needs', 'Produce skilled Diploma Engineers for Bangladesh\'s development', 'Foster practical skills, ethical values, and professional attitudes', 'Equal access to technical education for all sections of society'] },
              { t: 'Vision', pts: ['Center of excellence in polytechnic education in Bangladesh', 'Graduates ready for employment locally and abroad', 'Modern teaching methodologies and updated lab infrastructure', 'Strong industry-academia partnerships for student employability'] },
              { t: 'Objectives', pts: ['Implement BTEB curriculum with emphasis on practical application', 'Maintain up-to-date labs, workshops, and training facilities', 'Create pathways for higher education through B.Sc. Engineering', 'Support student entrepreneurship and self-employment'] },
            ].map(({ t, pts }, i) => (
              <Reveal key={i} delay={i * 80}>
                <MagneticCard style={{ padding: '1.75rem', height: '100%' }}>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--p-text)', marginBottom: '1rem', letterSpacing: '-0.01em' }}>{t}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {pts.map((p, j) => (
                      <li key={j} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--p-subtle)', lineHeight: 1.6 }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--p-muted)', marginTop: '6px', flexShrink: 0 }} />{p}
                      </li>
                    ))}
                  </ul>
                </MagneticCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINCIPAL ── */}
      <section className="pub-section pub-section-dark">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">Administration</p>
            <h2 className="pub-headline" style={{ marginBottom: '2rem' }}>Institute Principal</h2>
          </Reveal>
          <Reveal delay={80}>
            <MagneticCard style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.75rem', alignItems: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--p-surface-3)', border: '2px solid var(--p-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={26} color="var(--p-muted)" strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.125rem', fontWeight: 700, color: 'var(--p-text)', letterSpacing: '-0.01em' }}>Md. Mosharraf Hossain</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--p-muted)', marginBottom: '1rem' }}>মোঃ মোশাররফ হোসেন · Principal (অধ্যক্ষ)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {[['Office Phone', '+8802997714014'], ['Mobile', '+880 1309-132682'], ['Email', 'tangpoly1991@gmail.com'], ['Intercom', '1001'], ['Room', '101']].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: '0.625rem', color: 'var(--p-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--p-text-2)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </MagneticCard>
          </Reveal>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="pub-section pub-section-subtle">
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">History</p>
            <h2 className="pub-headline" style={{ marginBottom: '3rem' }}>Key Milestones</h2>
          </Reveal>
          <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
            <div className="pub-timeline-line" />
            {MILESTONES.map(({ y, t, d }, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="pub-timeline-item" style={{ position: 'relative', marginBottom: '2.25rem' }}>
                  <div className="pub-timeline-dot" />
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--p-accent-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{y}</div>
                  <h4 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--p-text)', marginBottom: '0.375rem', letterSpacing: '-0.01em' }}>{t}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--p-subtle)', lineHeight: 1.65, maxWidth: '52ch' }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section className="pub-section pub-section-dark">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">Programs</p>
            <h2 className="pub-headline" style={{ marginBottom: '2rem' }}>Academic Departments</h2>
          </Reveal>
          {/* Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {DEPTS.map(({ short, Icon, color }, i) => {
              const active = activeDept === i;
              return (
                <button key={i} onClick={() => setActiveDept(i)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 0.875rem',
                  background: active ? 'var(--p-accent)' : 'var(--p-surface-3)',
                  color: active ? '#fff' : 'var(--p-muted)',
                  border: '1px solid', borderColor: active ? 'var(--p-accent)' : 'var(--p-border)',
                  borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Inter',sans-serif",
                  transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <Icon size={13} color={active ? '#fff' : color} />
                  {short}
                </button>
              );
            })}
          </div>
          {/* Active Dept */}
          <Reveal key={activeDept}>
            <MagneticCard style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '3px', background: d.color }} />
              <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                    <div className="pub-icon-badge" style={{ background: d.bg }}>
                      <d.Icon size={20} color={d.color} strokeWidth={1.75} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.0625rem', fontWeight: 700, color: 'var(--p-text)', letterSpacing: '-0.01em' }}>{d.name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--p-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Diploma in Engineering · {d.short}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                    {[['Seats/Shift', d.seats], ['Shifts', d.shifts], ['Total Cap.', d.seats * d.shifts * 4]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: '0.625rem', color: 'var(--p-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.25rem', fontWeight: 800, color: 'var(--p-text)', letterSpacing: '-0.02em' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.6875rem', color: 'var(--p-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Laboratories</div>
                  {d.labs.map(lab => (
                    <div key={lab} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--p-subtle)', marginBottom: '0.375rem' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />{lab}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ marginBottom: '0.75rem', fontSize: '0.6875rem', color: 'var(--p-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Key Subjects</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.5rem' }}>
                    {d.courses.map(c => (
                      <span key={c} style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', background: 'var(--p-surface-3)', color: 'var(--p-subtle)', border: '1px solid var(--p-border)', borderRadius: '5px', fontWeight: 500 }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.6875rem', color: 'var(--p-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Career Prospects</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--p-subtle)', lineHeight: 1.7, maxWidth: '52ch' }}>{d.career}</p>
                </div>
              </div>
            </MagneticCard>
          </Reveal>
        </div>
      </section>

      {/* ── ADMISSION ── */}
      <section className="pub-section pub-section-subtle">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">Admissions</p>
            <h2 className="pub-headline" style={{ marginBottom: '2.5rem' }}>How to Apply</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { n: '01', t: 'Eligibility', d: 'SSC or equivalent with minimum GPA 2.00 (without 4th subject). Vocational graduates may have different criteria.' },
              { n: '02', t: 'Application', d: 'Apply online via the BTEB admission portal during the official admission window each year.' },
              { n: '03', t: 'Merit Selection', d: 'Students selected based on SSC results and department preference. Quota seats available for various categories.' },
              { n: '04', t: 'Enrollment', d: 'Selected students must complete enrollment by submitting required documents and paying the admission fee.' },
            ].map(({ n, t, d }, i) => (
              <Reveal key={i} delay={i * 70}>
                <MagneticCard style={{ padding: '1.75rem' }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '3rem', fontWeight: 900, color: 'var(--p-surface-3)', lineHeight: 1, marginBottom: '0.875rem', letterSpacing: '-0.04em' }}>{n}</div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--p-text)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{t}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--p-subtle)', lineHeight: 1.65 }}>{d}</p>
                </MagneticCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <MagneticCard style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--p-text)', letterSpacing: '-0.01em' }}>Apply via BTEB Admission Portal</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--p-muted)', marginTop: '2px' }}>Online applications are processed centrally by the Bangladesh Technical Education Board.</div>
              </div>
              <a href="https://btebadmission.gov.bd" target="_blank" rel="noopener noreferrer" className="pub-btn-primary" style={{ textDecoration: 'none', fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
                <ExternalLink size={14} /> BTEB Admission Portal
              </a>
            </MagneticCard>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pub-section pub-section-card">
        <Reveal>
          <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
            <p className="pub-eyebrow" style={{ justifyContent: 'center' }}>Questions?</p>
            <h2 className="pub-headline" style={{ textAlign: 'center' }}>Have More Questions?</h2>
            <p style={{ fontSize: '1rem', color: 'var(--p-subtle)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40ch', margin: '0 auto 2.5rem' }}>
              Reach out to the office directly or access the official TPI website for the latest information.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="pub-btn-primary" onClick={() => navigate('/contact')}>
                Contact Us <ArrowRight size={16} />
              </button>
              <a href="https://tangail.polytech.gov.bd" target="_blank" rel="noopener noreferrer" className="pub-btn-ghost">
                <Globe size={15} /> Official Website
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
