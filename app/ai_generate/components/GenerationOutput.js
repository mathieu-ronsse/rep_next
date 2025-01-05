import OutputImagePreview from '@/components/OutputImagePreview';
import { getValidImageUrl, isValidPrediction } from '../utils/imageUtils';

export default function GenerationOutput({ prediction }) {
  if (!prediction) return null;

  const imageUrl = getValidImageUrl(prediction);
  
  // Only render if we have a valid image URL
  if (!imageUrl) return null;

  return (
    <div className="mt-6">
      <OutputImagePreview
        src={imageUrl}
        alt="Generated image"
      />
      <p className="mt-2 text-sm text-gray-400 text-center">
        status: {prediction.status}
      </p>
    </div>
  );
}