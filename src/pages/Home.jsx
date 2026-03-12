import { useState, useEffect } from 'react';
import { fetchProducts, fetchSettings, fetchLocations, resolveImagePath } from '../utils/api';
import ProductShowcase from '../components/ProductShowcase';
import { MapPin, ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function load() {
      const [p, s, l] = await Promise.all([fetchProducts(), fetchSettings(), fetchLocations()]);
      setProducts(p);
      setSettings(s);
      setLocations(l);
    }
    load();
  }, []);

  const getProductImage = (product) => {
    if (product.image) return product.image;
    const fallbacks = { 'Bun Maska':'/products/bun-maska.png', 'Chai':'/products/mocha drink..png', 'Cheesecake':'/products/cheese cake.png' };
    return resolveImagePath(fallbacks[product.type] || '/products/bun-maska.png');
  };

  return (
    <>
      {/* Announcement Banner */}
      {settings.announcement && (
        <div style={{ background: 'var(--color-gold)', color: '#111', textAlign: 'center', padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600, position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 90 }}>
          {settings.announcement}
        </div>
      )}

      {/* Hero */}
      <section className="hero" style={settings.announcement ? { paddingTop: '160px' } : undefined}>
        <h1 className="hero-title"><span className="gold">{settings.hero_title || 'BITE. SIP. BLISS.'}</span></h1>
        <p className="hero-subtitle">
          {settings.hero_subtitle || "A modern tribute to the golden ratio of butter and brew."}
        </p>
        <div className="hero-tags">
          {locations.map(loc => (
            <span className="hero-tag" key={loc.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="var(--color-gold)" /> 
              {loc.name.split('—')[0].trim()}
            </span>
          ))}
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/menu" className="btn btn-primary">Explore Menu</a>
          <a href="/contact" className="btn btn-outline">Get in Touch</a>
        </div>
        
        <div style={{ marginTop: '60px', color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
          Discover the Experience
          <ChevronDown size={20} className="bounce" />
        </div>
      </section>

      {/* Product Highlights */}
      <section className="section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <Sparkles size={24} color="var(--color-gold)" />
          <h2 className="section-title" style={{ margin: 0 }}>The Masterpiece Collection</h2>
        </div>
        <p className="section-subtitle">
          A symphony of texture and taste. Every creation is an uncompromising devotion to flavor—from our cloud-soft, double-buttered buns to our artisanal, slow-steeped brews.
        </p>
        <div className="grid-3">
          {products.filter(p => !p.isOutOfStock).slice(0, 3).map(product => (
            <div className="card" key={product.id}>
              <div style={{ height: '240px', background: 'var(--color-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  style={{ maxHeight: '190px', objectFit: 'contain', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' }}
                />
              </div>
              <div className="card-body">
                <h3 style={{ fontSize: '1.35rem', marginBottom: '8px', letterSpacing: '0.05em' }}>{product.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  {product.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-gold)', fontSize: '1.35rem', fontWeight: '600' }}>₹{product.price}</span>
                  <span className="tag tag-available">Available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Teaser */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2 className="section-title" style={{ margin: '0 auto 24px' }}>{settings.vision_title || 'The PUFFIQUE Vision'}</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '760px', margin: '0 auto 40px', lineHeight: 1.8, fontSize: '1.1rem' }}>
          {settings.vision_text || 'Born in the heart of Odisha, PUFFIQUE is more than a café—it is a sanctuary for those who appreciate the golden ratio of butter and brew. We bridge traditional bakery soul with uncompromising modern precision.'}
        </p>
        <a href="/about" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Our Story <ArrowRight size={16} />
        </a>
      </section>

      {/* Product Showcase */}
      <ProductShowcase />
    </>
  );
}
