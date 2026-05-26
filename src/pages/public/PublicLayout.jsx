import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Home, Info, Phone } from 'lucide-react';

/* ── Custom Cursor ──────────────────────────────────────────────────────────── */
function PremiumCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      // Dot snaps immediately
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Ring lags with lerp
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${pos.current.x}px`;
        ringRef.current.style.top = `${pos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-magnetic]');
      setHovering(!!el);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={`pub-cursor-dot  ${hovering ? 'hovering' : ''} ${clicking ? 'clicking' : ''}`} />
      <div ref={ringRef} className={`pub-cursor-ring ${hovering ? 'hovering' : ''} ${clicking ? 'clicking' : ''}`} />
    </>
  );
}

/* ── Nav ────────────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/about', label: 'About', Icon: Info },
  { to: '/contact', label: 'Contact', Icon: Phone },
];

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="pub-root" style={{ position: 'relative' }}>
      <PremiumCursor />

      {/* ── NAV ── */}
      <nav className={`pub-nav ${scrolled ? 'scrolled' : ''}`}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', transition: 'background 0.3s',
            flexShrink: 0,
          }}>
            <img src="/images/tpi.png" alt="TPI" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </div>
          <div>
            <div className="pub-nav-logo-text-main">Connect Campus</div>
            <div className="pub-nav-logo-text-sub">Tangail Polytechnic Institute</div>
          </div>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={`pub-nav-link ${isActive(to) ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <button className="pub-nav-cta" onClick={() => navigate('/login')}>
          <LogIn size={15} /> Portal Login
        </button>
      </nav>

      {/* ── MAIN ── */}
      <main>
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="pub-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem clamp(1.5rem,5vw,4rem) 2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/images/tpi.png" alt="TPI" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.9375rem', fontWeight: 700, color: 'var(--p-text)', letterSpacing: '-0.01em' }}>Connect Campus</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--p-muted)', lineHeight: 1.7, maxWidth: '28ch' }}>
                The official digital platform of Tangail Polytechnic Institute — Est. 1991.
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <a href="https://www.facebook.com/tangpoly1991" target="_blank" rel="noopener noreferrer"
                  style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', color: 'var(--p-muted)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = 'var(--p-accent-2)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--p-muted)'; }}>
                  fb
                </a>
                <a href="https://tangail.polytech.gov.bd" target="_blank" rel="noopener noreferrer"
                  style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', color: 'var(--p-muted)', textDecoration: 'none', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.02em' }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = 'var(--p-accent-2)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--p-muted)'; }}>
                  www
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--p-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Explore</p>
              {[{ to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { to: '/contact', label: 'Contact' }, { to: '/login', label: 'Portal Login' }].map(l => (
                <Link key={l.to} to={l.to} className="pub-footer-link" style={{ marginBottom: '0.75rem' }}>{l.label}</Link>
              ))}
            </div>

            {/* Departments */}
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--p-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Departments</p>
              {['Computer Science', 'Electrical Tech', 'Civil Tech', 'Mechanical Tech', 'Telecommunication'].map(d => (
                <div key={d} style={{ fontSize: '0.875rem', color: 'var(--p-muted)', marginBottom: '0.625rem' }}>{d}</div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--p-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Contact</p>
              {[
                'Tangail Sadar, Dhaka Division',
                'Bangladesh',
                '+880 29977 14014',
                'tangpoly1991@gmail.com',
              ].map(c => (
                <div key={c} style={{ fontSize: '0.875rem', color: 'var(--p-muted)', marginBottom: '0.625rem' }}>{c}</div>
              ))}
              <a href="https://tangail.polytech.gov.bd" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.875rem', color: 'var(--p-accent-2)', textDecoration: 'none', display: 'block', marginTop: '0.25rem' }}>
                tangail.polytech.gov.bd
              </a>
            </div>
          </div>

          <div className="pub-divider" />
          <div style={{ paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--p-muted)' }}>
              &copy; {new Date().getFullYear()} Connect Campus &mdash; Tangail Polytechnic Institute. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy Policy', 'Terms of Service'].map(l => (
                <a key={l} href="#" style={{ fontSize: '0.8125rem', color: 'var(--p-muted)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--p-text-2)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--p-muted)'}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
