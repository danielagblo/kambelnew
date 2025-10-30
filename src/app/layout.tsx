import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';
import ToasterClient from '@/components/analytics/ToasterClient';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Kambel Consult - Professional Consulting and Training Services',
  description: 'Your trusted partner in career development and business excellence',
  keywords: ['consulting', 'career development', 'business', 'training', 'professional development'],
  icons: {
    icon: '/klogo.jpeg',
    shortcut: '/klogo.jpeg',
    apple: '/klogo.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/klogo.jpeg" type="image/jpeg" />
        <link rel="shortcut icon" href="/klogo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/klogo.jpeg" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <AnalyticsProvider />
        {children}
        <ToasterClient />
      </body>
    </html>
  );
}

