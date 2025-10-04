import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';

function ContactUs() {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // UI state for submission feedback
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear status when user starts typing
        if (status.message) setStatus({ type: '', message: '' });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            // This will call your backend API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Thank you! Your message has been sent successfully.'
                });
                // Reset form
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please check your connection.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h1>
                    <p className="text-gray-600 text-lg">Have a question? We'd love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Email Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Mail className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                    <p className="text-gray-600 text-sm">support@expensetracker.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Phone className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                                    <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <MapPin className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Office</h3>
                                    <p className="text-gray-600 text-sm">123 Business St, Suite 100<br />San Francisco, CA 94105</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-600 rounded-lg shadow-md p-6 text-white">
                            <h3 className="font-semibold mb-2">Quick Response</h3>
                            <p className="text-sm text-blue-100">We typically respond within 24 hours on business days.</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

                            {/* Success/Error Message */}
                            {status.message && (
                                <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${status.type === 'success'
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-red-50 border border-red-200'
                                    }`}>
                                    {status.type === 'success' ? (
                                        <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                                    ) : (
                                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                    )}
                                    <p className={status.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                                        {status.message}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-5">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Subject Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Message Textarea */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">How quickly will I get a response?</h3>
                            <p className="text-gray-600 text-sm">We aim to respond to all inquiries within 24 hours during business days.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">What are your support hours?</h3>
                            <p className="text-gray-600 text-sm">Monday to Friday, 9 AM to 6 PM PST. Emergency support available 24/7.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Do you offer phone support?</h3>
                            <p className="text-gray-600 text-sm">Yes! Call us at +1 (555) 123-4567 during business hours.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Can I schedule a demo?</h3>
                            <p className="text-gray-600 text-sm">Absolutely! Mention it in your message and we'll arrange a time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;