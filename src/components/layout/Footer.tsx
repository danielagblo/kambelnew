'use client';

import Link from 'next/link';
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';

interface SocialLinks {
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  footerAbout?: string;
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [footerAbout, setFooterAbout] = useState('Your trusted partner in career development and business excellence. We provide professional consulting and training services to help individuals and organizations achieve their goals.');

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch('/api/site/config', {
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        const links = {
          facebookUrl: data.facebookUrl || '',
          twitterUrl: data.twitterUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          instagramUrl: data.instagramUrl || '',
          youtubeUrl: data.youtubeUrl || '',
        };
        console.log('Footer - fetched social links:', links);
        setSocialLinks(links);
        
        // Set footer about text
        if (data.footerAbout) {
          setFooterAbout(data.footerAbout);
        }
      }
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    }
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/klogo.jpeg" 
              alt="Kambel Consult" 
              className="h-16 w-auto mb-4 rounded-lg"
            />
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              {footerAbout}
            </p>
            <div className="flex space-x-4">
              {socialLinks.facebookUrl && socialLinks.facebookUrl.trim() !== '' && (
                <a 
                  href={socialLinks.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook fa-lg" />
                </a>
              )}
              {socialLinks.twitterUrl && socialLinks.twitterUrl.trim() !== '' && (
                <a 
                  href={socialLinks.twitterUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <i className="fab fa-twitter fa-lg" />
                </a>
              )}
              {socialLinks.linkedinUrl && socialLinks.linkedinUrl.trim() !== '' && (
                <a 
                  href={socialLinks.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin fa-lg" />
                </a>
              )}
              {socialLinks.instagramUrl && socialLinks.instagramUrl.trim() !== '' && (
                <a 
                  href={socialLinks.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram fa-lg" />
                </a>
              )}
              {socialLinks.youtubeUrl && socialLinks.youtubeUrl.trim() !== '' && (
                <a 
                  href={socialLinks.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <i className="fab fa-youtube fa-lg" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/consultancy" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/publications" className="text-gray-400 hover:text-white transition-colors">Publications</Link></li>
              <li><Link href="/masterclass" className="text-gray-400 hover:text-white transition-colors">Masterclass</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get updates on our latest offerings and insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Kambel Consult. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-4 md:mt-0 text-sm">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-conditions" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
                <p className="text-gray-500">
                  Designed By{' '}
                  <a 
                    href="https://bricsky.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    Bricsky Softwares
                  </a>
                </p>
              </div>
            </div>
      </div>
    </footer>
  );
}

