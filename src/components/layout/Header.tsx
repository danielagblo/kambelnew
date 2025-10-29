'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/consultancy', label: 'Consultancy' },
    { href: '/publications', label: 'Publications' },
    { href: '/masterclass', label: 'Masterclass' },
    { href: '/blog', label: 'Blog' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/klogo.jpeg" 
              alt="Kambel Consult" 
              className={cn(
                "h-10 sm:h-12 md:h-14 w-auto transition-all duration-300 rounded-lg",
                isScrolled ? "h-10 sm:h-11 md:h-12" : "h-10 sm:h-12 md:h-14"
              )}
            />
            <div className="flex flex-col">
              <span className={cn(
                "text-lg sm:text-xl font-bold leading-tight tracking-wide",
                isScrolled ? "text-primary-600" : "text-white"
              )}>
                KAMBEL
              </span>
              <span className={cn(
                "text-base sm:text-lg font-bold leading-tight tracking-wide",
                isScrolled ? "text-accent-600" : "text-white opacity-90"
              )}>
                CONSULT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'font-medium transition-colors hover:text-primary-600',
                    isScrolled ? 'text-gray-700' : 'text-white'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={cn(
              'fas text-2xl',
              isMobileMenuOpen ? 'fa-times' : 'fa-bars',
              isScrolled ? 'text-gray-900' : 'text-white'
            )} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <ul className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'block font-medium transition-colors hover:text-primary-600',
                      isScrolled ? 'text-gray-700' : 'text-white'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

