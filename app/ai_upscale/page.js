'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import UpscaledImage from './components/UpscaledImage';
import { validateImageFile, readImageFile } from './utils/imageProcessing';
import { waitForPrediction } from './utils/predictionPolling';

export default function Upscale() {
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = async (file) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    try {
      const imageData = await readImageFile(file);
      setPreview(imageData);
      setError(null);
      setPrediction(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpscale = async () => {
    if (!preview) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: preview,
        }),
      });

      let prediction = await response.json();
      if (!response.ok) {
        throw new Error(prediction.detail);
      }

      setPrediction(prediction);
      await waitForPrediction(prediction, setPrediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mr-4">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Upscale Image</h1>
      </div>

      <div className="space-y-4">
        <ImageUploader onImageSelect={handleImageSelect} />

        {error && (
          <div className="bg-red-500/10 text-red-500 rounded-lg p-4">
            {error}
          </div>
        )}

        <ImagePreview 
          src={preview}
          onUpscale={handleUpscale}
          isLoading={isLoading}
        />

        <UpscaledImage prediction={prediction} />
      </div>
    </div>
  );
}