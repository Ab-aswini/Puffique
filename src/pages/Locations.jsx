import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Clock } from 'lucide-react';
import { fetchLocations } from '../utils/api';

export default function Locations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations().then(setLocations);
  }, []);

  return (
    <section className="section" style={{ paddingTop: '120px' }}>
      <h1 className="section-title">Our Stores</h1>
      <p className="section-subtitle">
        {locations.length} locations across Bhubaneswar. Bliss is never more than a few minutes away.
      </p>

      <div className="grid-3">
        {locations.map(loc => (
          <div className="card" key={loc.id}>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={22} color="var(--color-gold)" />
                <h3 style={{ color: 'var(--color-gold)', fontSize: '1.35rem', margin: 0, letterSpacing: '0.02em', fontWeight: '600' }}>{loc.name}</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{loc.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                <Clock size={16} />
                <span>{loc.hours}</span>
              </div>
              <a href={loc.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Get Directions <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
