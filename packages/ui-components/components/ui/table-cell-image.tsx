'use client';

import { ImageWithPlaceholder } from './image-with-placeholder';

export type TableCellImageProps = {
  src: string | null | undefined;
  alt: string;
  placeholder?: string;
};

export function TableCellImage({
  src,
  alt,
  placeholder = '/placeholder-item.png',
}: TableCellImageProps) {
  return (
    <div className="relative h-10 w-10 shrink-0 rounded overflow-hidden bg-muted">
      <ImageWithPlaceholder
        src={src}
        alt={alt}
        placeholder={placeholder}
        className="object-cover"
        sizes="40px"
      />
    </div>
  );
};
