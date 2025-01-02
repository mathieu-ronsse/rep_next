'use client';

import Image from 'next/image';

export default function UpscaledImage({ prediction }) {
  if (!prediction?.output) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm opacity-50">status: {prediction.status}</p>
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={prediction.output}
          alt="Upscaled"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>
    </div>
  );
}