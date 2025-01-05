import { useState } from 'react';
import { handleFluxModel, handleSdxlModel } from '../utils/modelUtils';

export function useImageGeneration() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const generate = async (prompt, modelVersion) => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setStatus('starting');

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          modelVersion
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.detail || 'Failed to generate image');
      }

      const handlers = {
        setStatus,
        setPrediction
      };

      if (modelVersion === 'flux') {
        await handleFluxModel(result, handlers);
      } else {
        await handleSdxlModel(result, handlers);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
      setPrediction(null);
      setStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prediction,
    error,
    isLoading,
    status,
    generate
  };
}