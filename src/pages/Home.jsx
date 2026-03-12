import { useState, useEffect } from 'react';
import { fetchProducts, fetchSettings, fetchLocations } from '../utils/api';
import ProductShowcase from '../components/ProductShowcase';

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
    return fallbacks[product.type] || '/products/bun-maska.png';
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
            <span className="hero-tag" key={loc.id}>📍 {loc.name.split('—')[0].trim()}</span>
          ))}
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/menu" className="btn btn-primary">Explore Menu</a>
          <a href="/contact" className="btn btn-outline">Get in Touch</a>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="section">
        <h2 className="section-title">Our Signatures</h2>
        <p className="section-subtitle">Every creation is a masterclass in flavor — from our golden buns to artisanal brews.</p>
        <div className="grid-3">
          {products.filter(p => !p.isOutOfStock).slice(0, 3).map(product => (
            <div className="card" key={product.id}>
              <div style={{ height: '220px', background: 'var(--color-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  style={{ maxHeight: '180px', objectFit: 'contain' }}
                />
              </div>
              <div className="card-body">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{product.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  {product.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-gold)', fontSize: '1.2rem', fontWeight: '700' }}>₹{product.price}</span>
                  <span className="tag tag-available">Available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Teaser */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2 className="section-title" style={{ margin: '0 auto 16px' }}>{settings.vision_title || 'The PUFFIQUE Vision'}</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0 auto 32px', lineHeight: 1.7, fontSize: '1.05rem' }}>
          {settings.vision_text || 'Born in the heart of Odisha, PUFFIQUE bridges traditional bakery soul with modern QSR speed.'}
        </p>
        <a href="/about" className="btn btn-outline">Our Story →</a>
      </section>

      {/* Product Showcase */}
      <ProductShowcase />
    </>
  );
}
