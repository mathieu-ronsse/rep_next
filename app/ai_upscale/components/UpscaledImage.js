import ResponsiveImagePreview from '@/components/ResponsiveImagePreview';

export default function UpscaledImage({ prediction }) {
  if (!prediction?.output) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm opacity-50">status: {prediction.status}</p>
      <ResponsiveImagePreview
        src={prediction.output}
        alt="Upscaled"
      />
    </div>
  );
}