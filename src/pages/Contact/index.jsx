import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { submitContact } from '../../services/newsService';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 font-sans">
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-zinc-950 dark:text-white font-display mb-4">
          हमसे संपर्क करें
        </h1>
        <p className="text-zinc-650 dark:text-zinc-350 text-base md:text-lg leading-relaxed">
          यदि आपके पास कोई समाचार, सुझाव, शिकायत, फोटो, वीडियो या किसी खबर से संबंधित जानकारी है, तो हमसे संपर्क करें। आपकी प्रतिक्रिया हमारे लिए महत्वपूर्ण है।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
            {/* Email Card Section */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">ईमेल:</p>
                <p className="text-base text-zinc-650 dark:text-zinc-350 mt-1">
                  <a href="mailto:indorelatest@gmail.com" className="text-brand-red hover:underline">indorelatest@gmail.com</a>
                </p>
              </div>
            </div>

            {/* Send News Section */}
            <div className="border-t border-zinc-150 dark:border-zinc-800 pt-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                समाचार भेजें
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                यदि आपके पास कोई ऐसी खबर, फोटो या वीडियो है जो जनहित में महत्वपूर्ण है, तो उसे हमें ईमेल करें। हमारी संपादकीय टीम उपलब्ध तथ्यों का सत्यापन करने के बाद आवश्यक होने पर उसे प्रकाशित करेगी।
              </p>
            </div>

            {/* Suggestions & Complaints Section */}
            <div className="border-t border-zinc-150 dark:border-zinc-800 pt-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                सुझाव और शिकायत
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                यदि आपको वेबसाइट पर प्रकाशित किसी खबर, जानकारी या तकनीकी समस्या से संबंधित कोई सुझाव या शिकायत है, तो हमें ईमेल करें। हम आपकी बात पर यथाशीघ्र कार्रवाई करने का प्रयास करेंगे।
              </p>
              <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-850 p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
                <Mail className="w-5 h-5 text-zinc-450 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-550 dark:text-zinc-450">ईमेल:</p>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    <a href="mailto:indorelatest@gmail.com" className="hover:underline">indorelatest@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Thanks Note */}
            <div className="border-t border-zinc-150 dark:border-zinc-800 pt-6 text-center lg:text-left">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                आपके सहयोग और विश्वास के लिए धन्यवाद।
              </p>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {lang === 'en' ? 'Send Message' : 'संदेश भेजें'}
            </h3>

            {success && (
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">
                  {lang === 'en' ? 'Message sent successfully! We will get back to you soon.' : 'संदेश सफलतापूर्व भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।'}
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2">
                  {lang === 'en' ? 'Full Name' : 'पूरा नाम'}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder={lang === 'en' ? 'Your name' : 'आपका नाम'}
                  className="w-full px-4 py-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2">
                {lang === 'en' ? 'Subject' : 'विषय'}
              </label>
              <input
                type="text"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder={lang === 'en' ? 'Topic of message' : 'संदेश का विषय'}
                className="w-full px-4 py-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2">
                {lang === 'en' ? 'Message' : 'संदेश'}
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder={lang === 'en' ? 'Write your message here...' : 'यहाँ अपना संदेश लिखें...'}
                className="w-full px-4 py-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? (lang === 'en' ? 'Sending...' : 'भेज रहे हैं...') : (lang === 'en' ? 'Send Message' : 'संदेश भेजें')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
