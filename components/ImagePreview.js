import Image from 'next/image';

export default function ImagePreview({ src, alt = "Preview Image" }) {
  // Return null if src is falsy or an empty string
  if (!src || src === '') return null;

  // Validate that src is a valid URL or base64 string
  const isValidSrc = src.startsWith('data:') || src.startsWith('http');
  if (!isValidSrc) return null;

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 768px"
        priority
      />
    </div>
  );
}