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
      
      let prediction = await response.json();
      if (response.status !== 201) {
        throw new Error(prediction.detail);
      }
      setPrediction(prediction);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const response = await fetch("/api/predictions/" + prediction.id);
        prediction = await response.json();
        if (response.status !== 200) {
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

  return {
    prediction,
    error,
    isLoading,
    generate
  };
}