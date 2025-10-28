'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await fetch('/api/site/config');
      if (response.ok) {
        const data = await response.json();
        setContent(data.privacyPolicy || 'Privacy Policy content not yet configured.');
      }
    } catch (error) {
      console.error('Failed to fetch privacy policy:', error);
      setContent('Unable to load privacy policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <Container className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            How we collect, use, and protect your information
          </p>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <Container>
          <Card>
            <CardBody className="p-8">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <i className="fas fa-spinner fa-spin text-4xl text-primary-600" />
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {content}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </section>

      <Footer />
    </>
  );
}

