import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Monitor, Zap, Building, HardHat, Wifi, Users, BookOpen, Award, Calendar, ExternalLink, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, direction = 'up', style = {} }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold: 0.08 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const transform = v ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.985)';
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform,
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: 'opacity, transform',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── BlurUpImage ────────────────────────────────────────────────────────────── */
function BlurUpImg({ src, alt, style = {} }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src} alt={alt}
      onLoad={() => setLoaded(true)}
      style={{
        display: 'block', width: '100%', height: '100%', objectFit: 'cover',
        filter: loaded ? 'blur(0)' : 'blur(20px)',
        transform: loaded ? 'scale(1)' : 'scale(1.04)',
        opacity: loaded ? 1 : 0.7,
        transition: 'filter 0.8s ease, transform 0.8s ease, opacity 0.5s ease',
        ...style,
      }}
    />
  );
}

/* ── MagneticCard ───────────────────────────────────────────────────────────── */
function MagneticCard({ children, className = 'pub-card', style = {}, strength = 8 }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    ref.current.style.transform = `translateY(-4px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
    ref.current.style.setProperty('--mouse-x', `${(e.clientX - left)}px`);
    ref.current.style.setProperty('--mouse-y', `${(e.clientY - top)}px`);
  }, [strength]);
  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translateY(0) rotateY(0) rotateX(0)';
  }, []);

  return (
    <div ref={ref} className={className} style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', ...style }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="pub-card-glow" />
      {children}
    </div>
  );
}

/* ── Counter ────────────────────────────────────────────────────────────────── */
function Counter({ end, suffix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const step = Math.max(1, Math.ceil(end / 60));
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, end);
          setN(cur);
          if (cur >= end) clearInterval(t);
        }, 22);
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ── DATA ───────────────────────────────────────────────────────────────────── */
const DEPTS = [
  { name: 'Computer Science & Technology', short: 'CST', Icon: Monitor, color: '#6366F1', bg: 'rgba(99,102,241,0.08)', seats: 100, shifts: 2, labs: ['Software Lab', 'Hardware Lab', 'Network Lab', 'Multimedia Lab'], desc: 'Programming, networking, database management, software and web development.' },
  { name: 'Electrical Technology', short: 'EET', Icon: Zap, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', seats: 100, shifts: 2, labs: ['Electrical Machines Lab', 'Basic Electrical Lab', 'Electronics Lab', 'Power Lab'], desc: 'Power systems, electrical machines, industrial electronics and control systems.' },
  { name: 'Civil Technology', short: 'CT', Icon: Building, color: '#10B981', bg: 'rgba(16,185,129,0.08)', seats: 100, shifts: 2, labs: ['Surveying Lab', 'Concrete Lab', 'Soil Testing Lab', 'Drawing Room'], desc: 'Structural design, surveying, construction management and estimation.' },
  { name: 'Mechanical Technology', short: 'MT', Icon: HardHat, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', seats: 100, shifts: 2, labs: ['Machine Shop', 'Welding Shop', 'Fitting Shop', 'Automotive Lab'], desc: 'Manufacturing processes, thermodynamics, machine design and maintenance.' },
  { name: 'Telecommunication Technology', short: 'TT', Icon: Wifi, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', seats: 50, shifts: 1, labs: ['Telecom Lab', 'Fiber Optics Lab', 'Antenna Lab'], desc: 'Signal processing, fiber optics, mobile communication and antenna systems.' },
  { name: 'Construction Technology', short: 'CoT', Icon: Building, color: '#06B6D4', bg: 'rgba(6,182,212,0.08)', seats: 50, shifts: 1, labs: ['Construction Lab', 'Materials Lab', 'Workshop'], desc: 'Building construction, project planning, estimation and site management.' },
];

const RESOURCES = [
  { Icon: Award, title: 'Exam Results', desc: 'Semester results and grade sheets issued by BTEB for all departments.', color: '#6366F1' },
  { Icon: Calendar, title: 'Class Routine', desc: 'Daily schedules, shift timings, and exam timetables for each department.', color: '#10B981' },
  { Icon: Users, title: 'Faculty Directory', desc: 'Teachers, instructors, and admin staff profiles and contact information.', color: '#F59E0B' },
  { Icon: BookOpen, title: 'Notices & Circulars', desc: 'Official announcements, admission notices, and academic circulars from the office.', color: '#8B5CF6' },
];

const GALLERY_IMGS = [
  '/images/Slider_one.jpg', '/images/Slider_two.jpg',
  '/images/slider_three.jpg', '/images/slider_four.jpg',
  '/images/slider_five.jpg', '/images/slider_six.jpg',
];

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();

  // Parallax hero
  const bgRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.04) translateY(${window.scrollY * 0.04}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="pub-hero">
        <div ref={bgRef} className="pub-hero-bg" style={{ backgroundImage: 'url(/images/Slider_two.jpg)' }} />
        <div className="pub-hero-overlay" />
        <div className="pub-hero-noise" />

        <div className="pub-hero-content">
          <div className="pub-hero-eyebrow">
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--p-gold)', flexShrink: 0 }} />
            Established 1991 · Tangail, Bangladesh
          </div>

          <h1 className="pub-hero-title">
            Tangail<br />
            <span>Polytechnic</span><br />
            Institute
          </h1>

          <p className="pub-hero-sub">
            The official digital campus for students, faculty, and administration of টাঙ্গাইল পলিটেকনিক ইনস্টিটিউট — under the Directorate of Technical Education.
          </p>

          <div className="pub-hero-actions">
            <button className="pub-btn-primary" onClick={() => navigate('/login')}>
              Access Portal <ArrowRight size={16} />
            </button>
            <a className="pub-btn-ghost" href="https://tangail.polytech.gov.bd" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={15} /> Official Website
            </a>
          </div>
        </div>

        <div className="pub-hero-scroll-hint">
          <span style={{ fontSize: '0.625rem', color: 'var(--p-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <div className="pub-hero-scroll-line" />
          <ChevronDown size={14} color="var(--p-muted)" />
        </div>
      </section>

      {/* ─────────────────── STATS ─────────────────── */}
      <div className="pub-stats-row">
        {[
          { v: 2500, s: '+', l: 'Students Enrolled' },
          { v: 120, s: '+', l: 'Faculty & Staff' },
          { v: 6, s: '', l: 'Diploma Departments' },
          { v: 34, s: ' yrs', l: 'Of Excellence' },
        ].map((s, i) => (
          <div key={i} className="pub-stat-cell">
            <div className="pub-stat-number"><Counter end={s.v} suffix={s.s} /></div>
            <div className="pub-stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ─────────────────── RESOURCES ─────────────────── */}
      <section className="pub-section pub-section-dark">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">Quick Access</p>
            <h2 className="pub-headline">Student &amp; Staff Resources</h2>
            <p className="pub-subtext" style={{ marginBottom: '3.5rem' }}>
              Everything you need — results, timetables, faculty, and official notices — in one place.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem' }}>
            {RESOURCES.map(({ Icon, title, desc, color }, i) => (
              <Reveal key={i} delay={i * 80}>
                <MagneticCard style={{ padding: '1.75rem' }}>
                  <div className="pub-icon-badge" style={{ background: color + '18', marginBottom: '1.25rem' }}>
                    <Icon size={20} color={color} strokeWidth={1.75} />
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.0625rem', fontWeight: 700, color: 'var(--p-text)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--p-subtle)', lineHeight: 1.65 }}>{desc}</p>
                </MagneticCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── DEPARTMENTS ─────────────────── */}
      <section className="pub-section pub-section-subtle">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">Academics</p>
            <h2 className="pub-headline">6 Diploma Programs</h2>
            <p className="pub-subtext" style={{ marginBottom: '3.5rem' }}>
              All programs run under BTEB curriculum — 4-year Diploma-in-Engineering with practical lab components and industry attachment.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: '1rem' }}>
            {DEPTS.map(({ name, short, Icon, color, bg, seats, shifts, labs, desc }, i) => (
              <Reveal key={i} delay={i * 60}>
                <MagneticCard style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Top bar */}
                  <div style={{ height: '3px', background: color, opacity: 0.7 }} />
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                      <div className="pub-icon-badge" style={{ background: bg }}>
                        <Icon size={18} color={color} strokeWidth={1.75} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: 'var(--p-text)', letterSpacing: '-0.01em' }}>{name}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--p-muted)', marginTop: '2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Diploma · {short}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--p-subtle)', lineHeight: 1.6, marginBottom: '1rem' }}>{desc}</p>
                    <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.875rem' }}>
                      {[['Seats', `${seats}/shift`], ['Shifts', shifts], ['Total', seats * shifts * 4]].map(([l, v]) => (
                        <div key={l}>
                          <div style={{ fontSize: '0.625rem', color: 'var(--p-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--p-text-2)' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--p-border)', paddingTop: '0.875rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {labs.map(lab => (
                        <span key={lab} style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', background: 'var(--p-surface-3)', color: 'var(--p-muted)', borderRadius: '4px', border: '1px solid var(--p-border)', fontWeight: 500 }}>{lab}</span>
                      ))}
                    </div>
                  </div>
                </MagneticCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── PRINCIPAL ─────────────────── */}
      <section className="pub-section pub-section-dark">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3rem', alignItems: 'start' }}>
              {/* Card */}
              <div style={{ width: '200px' }}>
                <MagneticCard style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--p-surface-3)', border: '2px solid var(--p-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Users size={28} color="var(--p-muted)" strokeWidth={1.5} />
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: 'var(--p-text)', letterSpacing: '-0.01em' }}>Md. Mosharraf Hossain</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--p-muted)', marginTop: '4px' }}>Principal (অধ্যক্ষ)</div>
                  <div style={{ height: '1px', background: 'var(--p-border)', margin: '0.875rem 0' }} />
                  {[['Office', '+8802997714014'], ['Mobile', '+880 1309-132682'], ['Ext.', '1001'], ['Room', '101']].map(([l, v]) => (
                    <div key={l} style={{ fontSize: '0.75rem', color: 'var(--p-muted)', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--p-subtle)' }}>{l}: </span>{v}
                    </div>
                  ))}
                </MagneticCard>
              </div>

              {/* Message */}
              <div>
                <p className="pub-eyebrow">From the Principal's Desk</p>
                <h2 className="pub-headline">A Message of Welcome</h2>
                {[
                  'Tangail Polytechnic Institute has been shaping the technical workforce of Bangladesh since 1991. Our mission is to provide quality technical education that is both theoretically sound and practically relevant.',
                  'We offer six diploma programs aligned with the BTEB curriculum, supported by modern laboratories, dedicated teachers, and a structured academic environment that prepares graduates for the global marketplace.',
                  'The Connect Campus portal is our step towards bringing all academic services — results, routines, communication — into one unified digital platform for our entire community.',
                ].map((t, i) => (
                  <p key={i} style={{ fontSize: '0.9375rem', color: 'var(--p-subtle)', lineHeight: 1.8, marginBottom: '0.875rem', maxWidth: '68ch' }}>{t}</p>
                ))}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--p-border)', paddingTop: '1rem' }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: 'var(--p-text)' }}>Md. Mosharraf Hossain</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--p-muted)', marginTop: '2px' }}>Principal, Tangail Polytechnic Institute · tangpoly1991@gmail.com</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── ABOUT PREVIEW ─────────────────── */}
      <section className="pub-section pub-section-subtle">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3.5rem', alignItems: 'center' }}>
          <Reveal style={{ flex: '1 1 400px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--p-border)', aspectRatio: '4/3', position: 'relative' }}>
              <BlurUpImg src="/images/slider_three.jpg" alt="TPI Campus" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            </div>
          </Reveal>
          <Reveal delay={120} style={{ flex: '1 1 360px' }}>
            <p className="pub-eyebrow">About TPI</p>
            <h2 className="pub-headline">Technical Education Since 1991</h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--p-subtle)', lineHeight: 1.8, marginBottom: '0.875rem', maxWidth: '52ch' }}>
              Founded under the Directorate of Technical Education, Ministry of Education, TPI serves students from Tangail district and the wider Dhaka Division.
            </p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--p-subtle)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '52ch' }}>
              Started with Electrical Technology in 1991, the institute has grown to six full departments with modern labs meeting BTEB standards.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              {[['Established', '1991'], ['Board', 'BTEB'], ['Program', 'Diploma-in-Eng.'], ['Duration', '4 Years']].map(([l, v]) => (
                <div key={l} style={{ padding: '1rem', background: 'var(--p-surface-3)', borderRadius: '10px', border: '1px solid var(--p-border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--p-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.0625rem', fontWeight: 700, color: 'var(--p-text)', marginTop: '2px' }}>{v}</div>
                </div>
              ))}
            </div>
            <button className="pub-btn-primary" onClick={() => navigate('/about')} style={{ background: 'var(--p-surface-3)', border: '1px solid var(--p-border-2)', color: 'var(--p-text-2)', boxShadow: 'none' }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--p-accent)'; e.currentTarget.style.border = '1px solid var(--p-accent)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--p-surface-3)'; e.currentTarget.style.border = '1px solid var(--p-border-2)'; e.currentTarget.style.color = 'var(--p-text-2)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Read More <ArrowRight size={15} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── GALLERY ─────────────────── */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) 0', background: 'var(--p-base)', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)', marginBottom: '2.5rem' }}>
          <Reveal>
            <p className="pub-eyebrow">Gallery</p>
            <h2 className="pub-headline">Campus Life</h2>
          </Reveal>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="pub-gallery-track">
            {[...GALLERY_IMGS, ...GALLERY_IMGS].map((src, i) => (
              <div key={i} className="pub-gallery-item">
                <BlurUpImg src={src} alt={`Campus ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── CTA ─────────────────── */}
      <section className="pub-section pub-section-card">
        <Reveal>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <p className="pub-eyebrow" style={{ justifyContent: 'center' }}>Get Started</p>
            <h2 className="pub-headline" style={{ textAlign: 'center' }}>Ready to Join the Campus Portal?</h2>
            <p style={{ fontSize: '1rem', color: 'var(--p-subtle)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '44ch', margin: '0 auto 2.5rem' }}>
              Login to access schedules, results, faculty info, and stay connected with the TPI community.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="pub-btn-primary" onClick={() => navigate('/login')}>
                Login to Portal <ArrowRight size={16} />
              </button>
              <button className="pub-btn-ghost" onClick={() => navigate('/about')}>
                Learn More
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────────────── LOCATION ─────────────────── */}
      <section className="pub-section pub-section-subtle">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">Location</p>
            <h2 className="pub-headline" style={{ marginBottom: '2.5rem' }}>Find Us</h2>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--p-border)' }}>
              <iframe
                title="TPI Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.5!2d89.9189!3d24.2513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fdfc2f8b000001%3A0x1!2sTangail%20Polytechnic%20Institute!5e0!3m2!1sen!2sbd!4v1"
                width="100%" height="360" style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {[
                ['Address', 'Tangail Sadar, Tangail, Dhaka Division, Bangladesh'],
                ['Office Phone', '+8802997714014 (Ext. 1001)'],
                ['Email', 'tangpoly1991@gmail.com'],
                ['Website', 'tangail.polytech.gov.bd'],
              ].map(([l, v]) => (
                <div key={l} style={{ flex: '1 1 180px', padding: '1.25rem', background: 'var(--p-surface-3)', borderRadius: '12px', border: '1px solid var(--p-border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--p-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>{l}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--p-text-2)' }}>{v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
