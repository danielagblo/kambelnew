'use client';

import { useState, useEffect, FormEvent } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

interface SiteConfig {
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  location?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteConfig();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const response = await fetch('/api/site/config');
      if (response.ok) {
        const data = await response.json();
        setSiteConfig(data);
      }
    } catch (error) {
      console.error('Failed to fetch site config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <Container className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">Contact Us</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">
            Get in touch with us. We'd love to hear from you!
          </p>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <i className="fas fa-spinner fa-spin text-3xl text-primary-600" />
                </div>
              ) : (
                <>
                  {siteConfig.contactEmail && (
                    <Card>
                      <CardBody>
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                            <i className="fas fa-envelope text-primary-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                            <p className="text-gray-600">{siteConfig.contactEmail}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {siteConfig.contactPhone && (
                    <Card>
                      <CardBody>
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                            <i className="fas fa-phone text-primary-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                            <p className="text-gray-600">{siteConfig.contactPhone}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {(siteConfig.address || siteConfig.location) && (
                    <Card>
                      <CardBody>
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                            <i className="fas fa-map-marker-alt text-primary-600 text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                            <p className="text-gray-600">
                              {siteConfig.address && <>{siteConfig.address}<br /></>}
                              {siteConfig.location}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Social Media - Only show if at least one link exists */}
                  {(siteConfig.facebookUrl || siteConfig.twitterUrl || siteConfig.linkedinUrl || siteConfig.instagramUrl || siteConfig.youtubeUrl) && (
                    <Card>
                      <CardBody>
                        <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                          {siteConfig.facebookUrl && (
                            <a
                              href={siteConfig.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                              <i className="fab fa-facebook" />
                            </a>
                          )}
                          {siteConfig.twitterUrl && (
                            <a
                              href={siteConfig.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                              <i className="fab fa-twitter" />
                            </a>
                          )}
                          {siteConfig.linkedinUrl && (
                            <a
                              href={siteConfig.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                              <i className="fab fa-linkedin" />
                            </a>
                          )}
                          {siteConfig.instagramUrl && (
                            <a
                              href={siteConfig.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                              <i className="fab fa-instagram" />
                            </a>
                          )}
                          {siteConfig.youtubeUrl && (
                            <a
                              href={siteConfig.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                            >
                              <i className="fab fa-youtube" />
                            </a>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardBody className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Your Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                      <Input
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>

                    <Input
                      label="Subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                    />

                    <Textarea
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />

                    <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                      <i className="fas fa-paper-plane mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}

