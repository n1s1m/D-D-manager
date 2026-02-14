'use client';

import { useEffect } from 'react';
import { VercelToolbar } from '@vercel/toolbar/next';

export function Toolbar() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@vercel/toolbar/next').then(() => {});
    }
  }, []);

  return process.env.NODE_ENV === 'development' ? <VercelToolbar /> : null;
}
