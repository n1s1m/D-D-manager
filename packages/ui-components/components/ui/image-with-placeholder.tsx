'use client';

import { memo, useState } from 'react';
import Image from 'next/image';

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
    <Image
      src={url}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
      onError={() => setError(true)}
    />
  );
});
