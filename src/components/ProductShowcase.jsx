import { useState, useEffect, useRef, useCallback } from 'react';
import './ProductShowcase.css';
import { resolveImagePath } from '../utils/api';

/* ================================
   PRODUCT DATA
   ================================ */
const showcaseProducts = [
  {
    id: 1,
    name: 'Bun Maska',
    bgText: 'MASKA',
    flavor: 'Signature Butter Bun',
    price: '₹40',
    c1: '#6B4F2A',
    c2: '#1C1408',
    image: resolveImagePath('/products/bun-maska.png'),
    sizes: ['Regular', 'Double', 'Mini'],
    desc: 'A quintessential pairing of soft, freshly baked brioche slathered in rich, creamy butter. The perfect companion for your morning chai.',
  },
  {
    id: 2,
    name: 'French Caramel Tea',
    bgText: 'CHAI',
    flavor: 'French Caramel Blend',
    price: '₹30',
    c1: '#5A3F28',
    c2: '#181010',
    image: resolveImagePath('/products/download-2.png'),
    sizes: ['Cutting', 'Regular', 'Large'],
    desc: 'An exquisite fusion of traditional robust tea leaves steeped flawlessly with a velvety, sweet French caramel undertone.',
  },
  {
    id: 3,
    name: 'Blueberry Cheesecake',
    bgText: 'CHEESE',
    flavor: 'NYC-style Blueberry',
    price: '₹150',
    c1: '#3D2B66',
    c2: '#0E0818',
    image: resolveImagePath('/products/cheese cake.png'),
    sizes: ['Slice', 'Half', 'Full'],
    desc: 'A luxuriously dense NYC-style cheesecake topped with a vibrant, tart wild blueberry compote on a buttery graham crust.',
  },
  {
    id: 4,
    name: 'Iced Mocha',
    bgText: 'MOCHA',
    flavor: 'Chilled Iced Coffee',
    price: '₹60',
    c1: '#3D2E22',
    c2: '#0C0806',
    image: resolveImagePath('/products/mocha drink..png'),
    sizes: ['Small', 'Regular', 'Large'],
    desc: 'Deep espresso intricately blended with rich artisan cocoa and chilled milk, served over ice for a brisk, chocolatey refreshment.',
  },
];

/* ================================
   COLOR LERP HELPERS
   ================================ */
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => {
    const h = Math.round(Math.max(0, Math.min(255, v))).toString(16);
    return h.length === 1 ? '0' + h : h;
  }).join('');
}

function lerpColor(hex1, hex2, t) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
}

/* ================================
   COMPONENT
   ================================ */
export default function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeSize, setActiveSize] = useState(0);
  const [gradientColors, setGradientColors] = useState({
    c1: showcaseProducts[0].c1,
    c2: showcaseProducts[0].c2,
  });

  const scrollRef = useRef(null);
  const sectionRefs = useRef([]);
  const animFrameRef = useRef(null);
  const lastWheelTime = useRef(0);
  const colorsRef = useRef({ c1: showcaseProducts[0].c1, c2: showcaseProducts[0].c2 });

  useEffect(() => { colorsRef.current = gradientColors; }, [gradientColors]);

  /* Smooth gradient transition via requestAnimationFrame */
  const animateGradient = useCallback((toC1, toC2) => {
    const fromC1 = colorsRef.current.c1;
    const fromC2 = colorsRef.current.c2;
    let start = null;
    const DURATION = 700;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    function step(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / DURATION, 1);
      const eased = 1 - (1 - t) * (1 - t);

      setGradientColors({
        c1: lerpColor(fromC1, toC1, eased),
        c2: lerpColor(fromC2, toC2, eased),
      });

      if (t < 1) animFrameRef.current = requestAnimationFrame(step);
    }

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  /* Navigate to section */
  const goToSection = useCallback((index) => {
    if (index < 0 || index >= showcaseProducts.length || index === currentIndex || isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(index);
    setActiveSize(0);

    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }

    const data = showcaseProducts[index];
    animateGradient(data.c1, data.c2);

    setTimeout(() => setIsTransitioning(false), 800);
  }, [currentIndex, isTransitioning, animateGradient]);

  /* Wheel */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const COOLDOWN = 1000;

    function onWheel(e) {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime.current < COOLDOWN) return;
      lastWheelTime.current = now;
      if (e.deltaY > 0) goToSection(currentIndex + 1);
      else if (e.deltaY < 0) goToSection(currentIndex - 1);
    }

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [currentIndex, goToSection]);

  /* Touch */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let startY = 0;

    function onStart(e) { startY = e.changedTouches[0].screenY; }
    function onEnd(e) {
      const diff = startY - e.changedTouches[0].screenY;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goToSection(currentIndex + 1) : goToSection(currentIndex - 1);
      }
    }
    function onMove(e) { e.preventDefault(); }

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchmove', onMove);
    };
  }, [currentIndex, goToSection]);

  /* Keyboard */
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goToSection(currentIndex + 1); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goToSection(currentIndex - 1); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [currentIndex, goToSection]);

  /* Cleanup */
  useEffect(() => () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); }, []);

  const activeProduct = showcaseProducts[currentIndex];
  const [imageErrors, setImageErrors] = useState({});

  return (
    <div className="showcase-wrapper">
      {/* Background */}
      <div
        className="showcase-gradient-bg"
        style={{ background: `radial-gradient(ellipse at center, ${gradientColors.c1} 0%, ${gradientColors.c2} 100%)` }}
      />

      {/* Left Info */}
      <div className="showcase-overlay">
        <div className="showcase-left">
          <h2>Taste<br />Perfection</h2>
          <p>Crafted with passion, each creation is a masterclass in flavor. From our signature buns to artisanal brews.</p>
        </div>
      </div>

      {/* Bottom Sheet UI (Groups right/bottom info for mobile) */}
      <div className="showcase-bottom-sheet">
        <div className="sheet-content">
          <h3 className="sheet-title">{activeProduct.name}</h3>
          <p className="sheet-desc">{activeProduct.desc}</p>
          
          <div className="sheet-controls">
            <div className="showcase-sizes">
              {activeProduct.sizes.map((size, i) => (
                <button
                  key={size}
                  className={`showcase-size-pill ${i === activeSize ? 'active' : ''}`}
                  onClick={() => setActiveSize(i)}
                >
                  {size}
                </button>
              ))}
            </div>
            
            <div className="sheet-action">
              <span className="showcase-price">{activeProduct.price}</span>
              <a href="/menu" className="showcase-cta">Order Now</a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="showcase-dots">
        {showcaseProducts.map((p, i) => (
          <div
            key={p.id}
            className={`showcase-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goToSection(i)}
          />
        ))}
      </div>

      {/* Scroll Sections */}
      <div className="showcase-scroll" ref={scrollRef}>
        {showcaseProducts.map((product, index) => (
          <div
            key={product.id}
            className={`showcase-section ${index === currentIndex ? 'active' : ''}`}
            ref={(el) => (sectionRefs.current[index] = el)}
          >
            <div className="showcase-section-inner">
              <h2 className="showcase-bg-text">{product.bgText}</h2>
              {!imageErrors[product.id] ? (
                <img
                  className="showcase-product-img"
                  src={product.image}
                  alt={product.name}
                  onError={() => setImageErrors(prev => ({ ...prev, [product.id]: true }))}
                />
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '4rem', fontFamily: 'var(--font-heading)' }}>
                  {product.bgText}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
