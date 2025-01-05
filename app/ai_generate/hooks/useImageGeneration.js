import { useState } from 'react';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function useImageGeneration() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async (prompt, modelVersion) => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setPrediction(null);

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

      if (modelVersion === 'flux') {
        // FLUX returns array of images directly
        setPrediction({
          status: 'succeeded',
          output: result
        });
      } else {
        // SDXL returns a prediction that needs polling
        setPrediction(result);
        let currentPrediction = result;

        while (
          currentPrediction.status !== "succeeded" &&
          currentPrediction.status !== "failed"
        ) {
          await sleep(1000);
          const pollResponse = await fetch("/api/predictions/" + currentPrediction.id);
          
          if (!pollResponse.ok) {
            throw new Error("Failed to fetch prediction status");
          }
          
          currentPrediction = await pollResponse.json();
          setPrediction(currentPrediction);
        }

        if (currentPrediction.status === "failed") {
          throw new Error('Image generation failed');
        }
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prediction,
    error,
    isLoading,
    generate
  };
}