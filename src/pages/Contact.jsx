import { useEffect, useState } from 'react';
import { submitLead, fetchSettings, fetchLocations } from '../utils/api';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const { theme } = useTheme();
  const [settings, setSettings] = useState({});
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    Promise.all([fetchSettings(), fetchLocations()]).then(([s, l]) => { setSettings(s); setLocations(l); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null); // Clear previous status

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
      setSubmitStatus('success');
      e.target.reset();
      setTimeout(() => setSubmitStatus(null), 5000);
    } else {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <section className="section" style={{ paddingTop: '120px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 className="section-title">{settings.contact_title || 'Get in Touch'}</h1>
        <p className="section-subtitle">
          {settings.contact_subtitle || "Want to partner, host an event, or share feedback? We'd love to hear from you."}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
        
        {/* Contact Information & Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="card" style={{ padding: '32px', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.4rem', marginBottom: '24px', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
              Headquarters & Main Outlet
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Infocity — Plaza Mall, Patia<br/>Bhubaneswar, Odisha 751024</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <span>hello@puffique.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={20} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <span>7:00 AM – 11:00 PM (Daily)</span>
              </div>
            </div>
          </div>

          {/* Map - Dynamic Filtering */}
          <div style={{ marginTop: '32px' }}>
            <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Our Location</h3>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', height: '280px', background: 'var(--color-dark-surface)' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14963.636611593688!2d85.81180031175402!3d20.3453880407137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909a3dc37dfed%3A0xe53be0fed9bd0f75!2sInfocity%2C%20Chandrasekharpur%2C%20Bhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1709848523456!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: theme === 'dark' ? 'invert(90%) hue-rotate(180deg) contrast(85%) opacity(0.85)' : 'none' }}
                title="Puffique Main Outlet Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitStatus === 'success' && (
            <div style={{ padding: '16px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', color: '#4ade80', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', fontWeight: 500, letterSpacing: '0.02em' }}>
              Your inquiry is on its way. We'll get back to you soon!
            </div>
          )}

          {submitStatus === 'error' && (
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', fontWeight: 500 }}>
              Something went wrong. Please try again or call us directly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="card" style={{ padding: '40px', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '24px', fontWeight: 600 }}>Send us a message</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                  <option value="corporate">Corporate / Catering</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea name="message" required rows="4" placeholder="How can we help?" className="form-input" style={{ resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1, marginTop: '8px' }}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
