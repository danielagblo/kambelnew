'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PageTrackerProps {
  contentType?: string;
  contentId?: string;
}

export default function PageTracker({ contentType, contentId }: PageTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Track the page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            title: document.title,
            referrer: document.referrer || null,
            contentType,
            contentId,
          }),
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Analytics tracking error:', error);
      }
    };

    // Delay tracking to avoid blocking page load
    const timeoutId = setTimeout(trackPageView, 500);

    return () => clearTimeout(timeoutId);
  }, [pathname, contentType, contentId]);

  return null; // This component doesn't render anything
}

