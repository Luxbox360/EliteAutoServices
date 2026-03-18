import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { getVehicleImageUrl } from '../utils/image-utils';

interface ContactPageProps {
  vehicleInfo?: {
    id: number;
    year: number;
    make: string;
    model: string;
    price: number;
    image: string;
  } | null;
}

export default function ContactPage({ vehicleInfo }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (vehicleInfo) {
      setFormData(prev => ({
        ...prev,
        message: `I am interested in the ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} ($${vehicleInfo.price.toLocaleString()}). `
      }));
    }
  }, [vehicleInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/contact-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vehicle_id: vehicleInfo?.id
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header for Contact */}
      <div className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our team is ready to assist you with any questions about our inventory or services.
          </p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              {vehicleInfo && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Inquiring About</h3>
                  <div className="flex gap-4">
                    <img 
                      src={getVehicleImageUrl(vehicleInfo.image)} 
                      alt="" 
                      className="w-24 h-16 object-cover rounded border border-gray-100"
                    />
                    <div>
                      <h4 className="font-bold text-lg">{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h4>
                      <p className="text-black font-bold">${vehicleInfo.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-3xl font-bold tracking-tight mb-6 uppercase">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-10">
                Have questions about a specific vehicle or want to schedule a test drive? 
                Contact us today and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-black text-white p-3 rounded">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">Call Us</h4>
                    <a href="tel:+12815202646" className="text-gray-600 hover:text-black transition-colors">(281) 520-2646</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white p-3 rounded">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">WhatsApp</h4>
                    <a href="https://wa.me/12815202646" className="text-gray-600 hover:text-black transition-colors" target="_blank" rel="noopener noreferrer">+1 (281) 520-2646</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-black text-white p-3 rounded">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">Email</h4>
                    <a href="mailto:info@eliteautoservices.com" className="text-gray-600 hover:text-black transition-colors">info@eliteautoservices.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'success' && (
                  <div className="bg-green-50 text-green-600 p-4 rounded-md text-sm font-bold uppercase mb-4">
                    Thank you! We will contact you soon.
                  </div>
                )}
                {status === 'error' && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-bold uppercase mb-4">
                    Something went wrong. Please try again.
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:ring-black focus:border-black"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:ring-black focus:border-black"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[\d\s\-\+\(\)]*$/.test(val)) {
                          setFormData({ ...formData, phone: val });
                        }
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:ring-black focus:border-black"
                      placeholder="(555) 000-0000"
                    />                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Message</label>
                  <textarea
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-3 text-sm focus:ring-black focus:border-black"
                    placeholder="Tell us what you're looking for..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full bg-black text-white font-bold py-4 rounded uppercase tracking-widest hover:bg-gray-800 transition-colors ${
                    status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
