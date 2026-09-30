'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution } from '@/features/leads/attribution';
export function AttributionCapture() {
  const path = usePathname();
  useEffect(() => {
    captureAttribution();
  }, [path]);
  return null;
}
