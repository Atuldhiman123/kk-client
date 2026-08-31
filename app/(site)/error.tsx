'use client';

import { useEffect } from 'react';
import { Button } from 'antd';

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">Something went wrong</h1>
      <p className="max-w-md text-sm text-neutral-600">
        We couldn&apos;t load this page right now. Please try again in a moment, or refresh the page.
      </p>
      <Button type="primary" onClick={() => reset()} className="!rounded-full !bg-orange-600 !px-8 !font-bold">
        Try again
      </Button>
    </div>
  );
}
