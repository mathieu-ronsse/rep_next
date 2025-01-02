import ImagePreview from '@/components/ImagePreview';

export default function UpscaledImage({ prediction }) {
  if (!prediction?.output) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm opacity-50">status: {prediction.status}</p>
      <div className="max-w-[500px] mx-auto">
        <ImagePreview
          src={prediction.output}
          alt="Upscaled"
        />
      </div>
    </div>
  );
}