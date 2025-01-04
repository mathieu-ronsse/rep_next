'use client';

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ModelSelector from "@/components/ModelSelector";
import PromptInput from "@/components/PromptInput";
import LoadingButton from "@/components/LoadingButton";
import OutputImagePreview from "@/components/OutputImagePreview";

const breadcrumbItems = [
  { href: '/', label: 'Home' },
  { icon: '🪄', label: 'Generate' }
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Generate() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('sdxl');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <div className="container max-w-2xl mx-auto px-6 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <h2 className="text-xl italic text-gray-400 mt-4 mb-8">
        Create unique images from text descriptions.
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full">
        <div className="w-full">
          <ModelSelector value={model} onChange={setModel} />
        </div>
        
        <div className="w-full">
          <PromptInput value={prompt} onChange={setPrompt} />
        </div>
        
        <LoadingButton
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          isLoading={isLoading}
        >
          Generate
        </LoadingButton>
      </form>

      {error && (
        <div className="bg-red-500/10 text-red-500 rounded-lg p-4 mt-6">
          {error}
        </div>
      )}

      {prediction && (
        <div className="mt-6">
          {prediction.output && (
            <OutputImagePreview
              src={Array.isArray(prediction.output) ? prediction.output[prediction.output.length - 1] : prediction.output}
              alt="Generated image"
            />
          )}
          <p className="mt-2 text-sm text-gray-400">status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}