'use client';

import { useState } from 'react';
import { trackEvent, trackForm } from '@/utils/analytics';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactFormWithAnalytics() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Track quand l'utilisateur commence à remplir le formulaire
  const handleInputFocus = () => {
    if (formData.name === '' && formData.email === '') {
      trackForm.start('Contact Form');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Track successful submission
        trackForm.submit('Contact Form');
        trackEvent('Goal: Contact Form Completed', {
          subject: formData.subject,
        });

        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Track error
        const error = await response.text();
        trackForm.error('Contact Form', error);
        setSubmitStatus('error');
      }
    } catch (error) {
      // Track error
      trackForm.error('Contact Form', 'Network error');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nom
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onFocus={handleInputFocus}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onFocus={handleInputFocus}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Sujet
          </label>
          <input
            type="text"
            id="subject"
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData({
                ...formData,
                subject: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({
                ...formData,
                message: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>

      {submitStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          Message envoyé avec succès !
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          Une erreur est survenue. Veuillez réessayer.
        </div>
      )}
    </div>
  );
}
