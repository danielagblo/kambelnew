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
        const trackingData = {
          path: pathname,
          title: document.title,
          referrer: document.referrer || null,
          contentType,
          contentId,
        };
        
        console.log('Tracking page view:', trackingData);
        
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trackingData),
        });
        
        if (response.ok) {
          console.log('Page view tracked successfully');
        } else {
          console.error('Failed to track page view:', response.status);
        }
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

