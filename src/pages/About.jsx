import { useState, useEffect } from 'react';
import { fetchSettings } from '../utils/api';

export default function About() {
  const [s, setS] = useState({});

  useEffect(() => {
    fetchSettings().then(setS);
  }, []);

  const cards = [
    { num: '01', titleKey: 'about_card1_title', descKey: 'about_card1_desc', img: '/heritage/dough.png', alt: 'Artisan Dough' },
    { num: '02', titleKey: 'about_card2_title', descKey: 'about_card2_desc', img: '/heritage/coffee.png', alt: 'Velvet Chai' },
    { num: '03', titleKey: 'about_card3_title', descKey: 'about_card3_desc', img: '/heritage/storefront.png', alt: 'PUFFIQUE Storefront' },
  ];

  return (
    <section className="section" style={{ paddingTop: '120px' }}>
      <h1 className="section-title">{s.about_title || 'Our Story'}</h1>
      <p className="section-subtitle">
        {s.about_subtitle || 'Born in the heart of Odisha, PUFFIQUE bridges traditional bakery soul with modern QSR speed.'}
      </p>

      <div className="grid-3">
        {cards.map(card => (
          <div className="card" key={card.num}>
            <div style={{ height: '220px', overflow: 'hidden' }}>
              <img src={card.img} alt={card.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="card-body">
              <span style={{ fontSize: '2.5rem', color: 'var(--color-gold)', opacity: 0.3, fontWeight: 'bold', lineHeight: 1 }}>{card.num}</span>
              <h3 style={{ color: 'var(--color-gold)', fontSize: '1.4rem', margin: '12px 0' }}>{s[card.titleKey] || card.alt}</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {s[card.descKey] || ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
