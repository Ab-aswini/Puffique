import { useState, useEffect } from 'react';
import { submitLead, fetchSettings, fetchLocations } from '../utils/api';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({});
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    Promise.all([fetchSettings(), fetchLocations()]).then(([s, l]) => { setSettings(s); setLocations(l); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      outlet: formData.get('outlet'),
      message: formData.get('message')
    };

    const result = await submitLead(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      e.target.reset();
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert('Failed to send inquiry. Please try again.');
    }
  };

  return (
    <section className="section" style={{ paddingTop: '120px', maxWidth: '600px' }}>
      <h1 className="section-title">{settings.contact_title || 'Get in Touch'}</h1>
      <p className="section-subtitle">
        {settings.contact_subtitle || "Want to partner, host an event, or share feedback? We'd love to hear from you."}
      </p>

      {success && (
        <div style={{ padding: '14px', background: 'rgba(74, 222, 128, 0.15)', border: '1px solid #4ade80', color: '#4ade80', borderRadius: '8px', textAlign: 'center', marginBottom: '24px' }}>
          Your inquiry is on its way. We'll get back to you soon!
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input name="name" type="text" required placeholder="Your name" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">WhatsApp Number</label>
            <input name="phone" type="tel" required placeholder="+91 0000000000" className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Outlet</label>
            <select name="outlet" className="form-input">
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea name="message" required rows="4" placeholder="How can we help?" className="form-input" style={{ resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </section>
  );
}
