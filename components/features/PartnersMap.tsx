"use client";

import React from 'react';
import dynamic from 'next/dynamic';

export default function PartnersMap() {
  const PartnersMapComponent = React.useMemo(() => {
    return dynamic(
      () => import('./PartnersDisplayMap'),
      {
        loading: () => (
          <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-navy-blue/15 to-mode-blue/10">
            <div className="text-navy-blue animate-pulse">Loading Partners Map...</div>
          </div>
        ),
        ssr: false
      }
    );
  }, []);

  return <PartnersMapComponent />;
}