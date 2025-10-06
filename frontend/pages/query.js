import { useState } from 'react';
import { postQuery } from '../lib/api';
import styles from '../styles/Query.module.css'; // ✅ Correct path

export default function Query() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Submitting...');
    try {
      await postQuery(form);
      setStatus('Submitted — thank you!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('Error submitting. Is the Django backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className={styles.title}>Get In Touch</h1>
          <p className={styles.subtitle}>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
              className={styles.input}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
              className={styles.input}
            />
          </div>

          <div>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Tell us how we can help you..."
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              required
              className={styles.input}
              style={{ resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.button}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {status && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontWeight: '500',
            backgroundColor: status.includes('Error') ? '#fef2f2' : status.includes('thank you') ? '#f0fdf4' : '#f0f9ff',
            color: status.includes('Error') ? '#dc2626' : status.includes('thank you') ? '#16a34a' : '#0369a1',
            border: `1px solid ${status.includes('Error') ? '#fecaca' : status.includes('thank you') ? '#bbf7d0' : '#bae6fd'}`
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}