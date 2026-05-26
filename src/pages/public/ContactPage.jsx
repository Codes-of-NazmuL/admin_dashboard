import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Globe, Users, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
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
    ref.current.style.transform = `translateY(-4px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
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

/* ── Premium Input ──────────────────────────────────────────────────────────── */
function Input({ type = 'text', placeholder, required, as: Tag = 'input', rows, children }) {
  const [focused, setFocused] = useState(false);
  const style = {
    width: '100%', padding: '0.875rem 1rem',
    background: focused ? 'rgba(30,30,35,1)' : 'rgba(24,24,27,0.9)',
    border: `1px solid ${focused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '10px',
    fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
    color: 'var(--p-text)', outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
    resize: Tag === 'textarea' ? 'vertical' : 'none',
  };
  if (Tag === 'select') {
    return (
      <select required={required}
        style={{ ...style, cursor: 'pointer', appearance: 'none' }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
        {children}
      </select>
    );
  }
  if (Tag === 'textarea') {
    return <textarea rows={rows} placeholder={placeholder} required={required} style={style}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
  }
  return <input type={type} placeholder={placeholder} required={required} style={style}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

/* ── ContactInfoCard ────────────────────────────────────────────────────────── */
function InfoCard({ Icon, title, main, sub, link, color, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <MagneticCard style={{ padding: '1.5rem' }}>
        <div className="pub-icon-badge" style={{ background: color + '18', marginBottom: '1rem', width: '40px', height: '40px' }}>
          <Icon size={17} color={color} strokeWidth={1.75} />
        </div>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--p-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{title}</div>
        {link
          ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--p-accent-2)', display: 'block', textDecoration: 'none', letterSpacing: '-0.01em' }}>{main}</a>
          : <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--p-text)', letterSpacing: '-0.01em' }}>{main}</div>
        }
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--p-muted)', marginTop: '2px' }}>{sub}</div>}
      </MagneticCard>
    </Reveal>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const navigate  = useNavigate();
  const [sent, setSent] = useState(false);
  const bgRef     = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) bgRef.current.style.transform = `scale(1.04) translateY(${window.scrollY * 0.04}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ── */}
      <section className="pub-hero" style={{ minHeight: '52vh' }}>
        <div ref={bgRef} className="pub-hero-bg" style={{ backgroundImage: 'url(/images/slider_four.jpg)' }} />
        <div className="pub-hero-overlay" />
        <div className="pub-hero-noise" />
        <div className="pub-hero-content">
          <div className="pub-hero-eyebrow">
            <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--p-gold)', flexShrink:0 }} />
            Tangail Polytechnic Institute
          </div>
          <h1 className="pub-hero-title" style={{ fontSize:'clamp(2.25rem,5vw,3.75rem)' }}>Contact Us</h1>
          <p className="pub-hero-sub">Get in touch with the institute office or reach out through Connect Campus.</p>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="pub-section pub-section-dark">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px,1fr))', gap: '1rem', marginBottom: '5rem' }}>
            <InfoCard Icon={MapPin}  title="Address"      main="Tangail Sadar, Tangail"  sub="Dhaka Division, Bangladesh"      color="#6366F1" delay={0}   />
            <InfoCard Icon={Phone}   title="Office Phone" main="+8802997714014"           sub="Ext. 1001 · Principal"           color="#10B981" delay={60}  />
            <InfoCard Icon={Mail}    title="Email"        main="tangpoly1991@gmail.com"   sub="Official institute email"         color="#F59E0B" delay={120} />
            <InfoCard Icon={Clock}   title="Office Hours" main="Sat – Thu, 8AM – 5PM"    sub="Friday closed"                   color="#8B5CF6" delay={180} />
            <InfoCard Icon={Globe}   title="Official Site" main="tangail.polytech.gov.bd" link="https://tangail.polytech.gov.bd" color="#06B6D4" delay={240} />
          </div>

          {/* ── PRINCIPAL ── */}
          <Reveal>
            <p className="pub-eyebrow">Key Contact</p>
            <h2 className="pub-headline" style={{ marginBottom: '1.5rem' }}>Institute Principal</h2>
          </Reveal>
          <Reveal delay={80} style={{ marginBottom: '5rem' }}>
            <MagneticCard style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--p-surface-3)', border: '2px solid var(--p-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={22} color="var(--p-muted)" strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.0625rem', fontWeight:700, color:'var(--p-text)', letterSpacing:'-0.01em' }}>Md. Mosharraf Hossain</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--p-muted)', marginBottom: '1rem' }}>মোঃ মোশাররফ হোসেন · Principal (অধ্যক্ষ)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {[['Office Phone','+8802997714014'],['Mobile','+880 1309-132682'],['Email','tangpoly1991@gmail.com'],['Intercom','1001'],['Room','101']].map(([l,v]) => (
                    <div key={l}>
                      <div style={{ fontSize:'0.625rem', color:'var(--p-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
                      <div style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--p-text-2)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </MagneticCard>
          </Reveal>

          {/* ── FORM + MAP ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {/* Form */}
            <Reveal style={{ flex: '1 1 400px' }}>
              <MagneticCard style={{ padding: '2rem' }}>
                <p className="pub-eyebrow">Send a Message</p>
                <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.25rem', fontWeight:700, color:'var(--p-text)', letterSpacing:'-0.02em', marginBottom:'0.375rem' }}>We&apos;ll Get Back to You</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--p-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>Response within 1–2 working days.</p>

                {sent && (
                  <div style={{ padding:'0.875rem 1rem', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'10px', fontSize:'0.875rem', color:'#34D399', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'8px' }}>
                    <CheckCircle size={16} color="#34D399" /> Message sent successfully!
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--p-subtle)', letterSpacing: '0.04em' }}>Name *</label>
                      <Input type="text" placeholder="Your full name" required />
                    </div>
                    <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--p-subtle)', letterSpacing: '0.04em' }}>Email *</label>
                      <Input type="email" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--p-subtle)', letterSpacing: '0.04em' }}>Subject</label>
                    <Input as="select">
                      <option value="" style={{ background: '#18181B' }}>Select a subject...</option>
                      {['General Inquiry','Admission Information','Academic Matters','Result / Certificate','Library / Lab Access','Other'].map(o => (
                        <option key={o} value={o} style={{ background: '#18181B' }}>{o}</option>
                      ))}
                    </Input>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--p-subtle)', letterSpacing: '0.04em' }}>Message *</label>
                    <Input as="textarea" rows={5} placeholder="Write your message here..." required />
                  </div>
                  <button type="submit" className="pub-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
                    <Send size={15} /> Send Message
                  </button>
                </form>
              </MagneticCard>
            </Reveal>

            {/* Map */}
            <Reveal delay={100} style={{ flex: '1 1 400px' }}>
              <MagneticCard style={{ padding: 0, overflow: 'hidden', minHeight: '500px', height: '100%' }}>
                <iframe
                  title="TPI Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.5!2d89.9189!3d24.2513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fdfc2f8b000001%3A0x1!2sTangail%20Polytechnic%20Institute!5e0!3m2!1sen!2sbd!4v1"
                  width="100%" height="100%"
                  style={{ border: 0, display: 'block', minHeight: '500px', filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </MagneticCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── OFFICIAL LINKS ── */}
      <section className="pub-section pub-section-subtle">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Reveal>
            <p className="pub-eyebrow">Resources</p>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.25rem', fontWeight:700, color:'var(--p-text)', letterSpacing:'-0.02em', marginBottom:'1.5rem' }}>Official Links</h3>
          </Reveal>
          <Reveal delay={60}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {[
                { l:'TPI Official Website',             h:'https://tangail.polytech.gov.bd' },
                { l:'Bangladesh National Portal',       h:'https://bangladesh.gov.bd' },
                { l:'BTEB (Technical Education Board)', h:'https://bteb.gov.bd' },
                { l:'BTEB Online Admission',            h:'https://btebadmission.gov.bd' },
                { l:'Directorate of Technical Education',h:'https://techedu.gov.bd' },
              ].map(({ l, h }) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0.5625rem 0.875rem', background:'var(--p-surface-3)', border:'1px solid var(--p-border)', borderRadius:'8px', fontSize:'0.8125rem', fontWeight:500, color:'var(--p-subtle)', textDecoration:'none', transition:'all 0.3s ease' }}
                  onMouseOver={e => { e.currentTarget.style.background='rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.3)'; e.currentTarget.style.color='var(--p-accent-2)'; }}
                  onMouseOut={e  => { e.currentTarget.style.background='var(--p-surface-3)'; e.currentTarget.style.borderColor='var(--p-border)'; e.currentTarget.style.color='var(--p-subtle)'; }}>
                  <ExternalLink size={13} /> {l}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pub-section pub-section-card">
        <Reveal>
          <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
            <p className="pub-eyebrow" style={{ justifyContent: 'center' }}>Campus Portal</p>
            <h2 className="pub-headline" style={{ textAlign: 'center' }}>Access the Digital Campus</h2>
            <p style={{ fontSize: '1rem', color: 'var(--p-subtle)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40ch', margin: '0 auto 2.5rem' }}>
              Students and faculty can login to Connect Campus for schedules, results, notices, and digital resources.
            </p>
            <button className="pub-btn-primary" onClick={() => navigate('/login')} style={{ margin: '0 auto' }}>
              Login to Portal <ArrowRight size={16} />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
