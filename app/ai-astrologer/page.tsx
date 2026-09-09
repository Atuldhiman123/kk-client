'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports with SSR enabled
const AiAstrologerDesktop = dynamic(() => import('./AiAstrologerDesktop'), {
  ssr: true,
});
const AiAstrologerMobile = dynamic(() => import('./AiAstrologerMobile'), {
  ssr: true,
});

export default function AiAstrologerPage() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = () => {
      // Allow manual override via URL parameter ?view=mobile or ?view=desktop for testing
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const viewOverride = params.get('view');
        if (viewOverride === 'mobile') {
          setIsMobile(true);
          return;
        }
        if (viewOverride === 'desktop') {
          setIsMobile(false);
          return;
        }

        // Standard mobile check (< 768px matches phone screen sizes)
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkDevice();
    setIsMounted(true);

    const mql = window.matchMedia('(max-width: 767px)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const params = new URLSearchParams(window.location.search);
      const viewOverride = params.get('view');
      if (!viewOverride) {
        setIsMobile(e.matches);
      }
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', handleMediaChange);
    } else {
      window.addEventListener('resize', checkDevice);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleMediaChange);
      } else {
        window.removeEventListener('resize', checkDevice);
      }
    };
  }, []);

  // During initial SSR and pre-mount, render desktop layout by default
  if (!isMounted) {
    return <AiAstrologerDesktop />;
  }

  return isMobile ? <AiAstrologerMobile /> : <AiAstrologerDesktop />;
}
