'use client';

import { memo, useState } from 'react';

export type ImageWithPlaceholderProps = {
  /** Image URL; when null/undefined or when load fails, placeholder is shown */
  src: string | null | undefined;
  alt: string;
  /** Placeholder image URL (e.g. /placeholder-item.png) */
  placeholder: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export const ImageWithPlaceholder = memo(function ImageWithPlaceholder({
  src,
  alt,
  placeholder,
  fill = true,
  className,
  sizes,
  priority,
}: ImageWithPlaceholderProps) {
  const [error, setError] = useState(false);
  const url = src && !error ? src : placeholder;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      onError={() => setError(true)}
    />
  );
});
