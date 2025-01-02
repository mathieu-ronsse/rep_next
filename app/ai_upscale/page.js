'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoadingButton from '@/components/LoadingButton';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Upscale() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setError(null);
    setPrediction(null);

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsDataURL(file);
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

      while (prediction.status !== "succeeded" && prediction.status !== "failed") {
        await sleep(1000);
        const response = await fetch("/api/predictions/" + prediction.id);
        prediction = await response.json();
        if (!response.ok) {
          throw new Error(prediction.detail);
        }
        setPrediction(prediction);
      }
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
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Select Image
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 rounded-lg p-4">
            {error}
          </div>
        )}

        {preview && (
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            <LoadingButton
              onClick={handleUpscale}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              isLoading={isLoading}
            >
              Upscale
            </LoadingButton>
          </div>
        )}

        {prediction && (
          <div className="space-y-2">
            <p className="text-sm opacity-50">status: {prediction.status}</p>
            {prediction.output && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}