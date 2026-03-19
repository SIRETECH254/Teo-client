import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiLinkedin, FiSend } from 'react-icons/fi';
import { useSubmitContact } from '../../tanstack/useContact';
import toast from 'react-hot-toast';

const Contact = () => {
  const submitContact = useSubmitContact();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitContact.mutateAsync(formData);
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="page-container py-8 space-y-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Top Section: Map & Get in Touch */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Map Section - 65% on lg */}
          <div className="w-full lg:w-[65%] h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3697.8352276203846!2d36.71497717460087!3d-1.3709677986160578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f05e501aa7cff%3A0xb99d9f763ec7127c!2sOlolua%20Ridge%20Apartments!5e1!3m2!1sen!2ske!4v1773813915995!5m2!1sen!2ske" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            />
          </div>

          {/* Get in Touch Section - 35% on lg */}
          <div className="w-full lg:w-[35%] flex flex-col gap-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-full">
            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
            
            <div className="flex flex-col gap-8 mt-2">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+254 700 000 000</p>
                  <p className="text-gray-600">+254 711 111 111</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">Ololua Ridge Apartments</p>
                  <p className="text-gray-600">Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                  <FiMail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">info@teoclient.com</p>
                  <p className="text-gray-600">support@teoclient.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                  <FiLinkedin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">LinkedIn</h3>
                  <a href="#" className="text-brand-primary hover:underline">Connect with us</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Form */}
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Reach Us</h2>
              <p className="text-gray-600">
                Send us a detailed message and our team will get back to you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="input resize-none"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitContact.isPending}
                  className="btn-primary w-full md:w-auto min-w-[200px]"
                >
                  {submitContact.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message
                      <FiSend className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
