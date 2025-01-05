'use client';

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ModelSelector from "@/components/ModelSelector";
import PromptInput from "@/components/PromptInput";
import LoadingButton from "@/components/LoadingButton";
import OutputImagePreview from "@/components/OutputImagePreview";
import { useImageGeneration } from "./hooks/useImageGeneration";

const breadcrumbItems = [
  { href: '/', label: 'Home' },
  { icon: '🪄', label: 'Generate' }
];

export default function Generate() {
  const [model, setModel] = useState('sdxl');
  const [prompt, setPrompt] = useState('');
  
  const sdxl = useImageGeneration();
  const flux = useImageGeneration();

  return (
    <div className="container max-w-2xl mx-auto px-6 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <h2 className="text-xl italic text-gray-400 mt-4 mb-8">
        Create unique images from text descriptions.
      </h2>

      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-6 w-full">
        <div className="w-full">
          <ModelSelector value={model} onChange={setModel} />
        </div>
        
        <div className="w-full">
          <PromptInput value={prompt} onChange={setPrompt} />
        </div>
        
        <div className="flex gap-4">
          <LoadingButton
            onClick={() => sdxl.generate(prompt, 'sdxl')}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            isLoading={sdxl.isLoading}
          >
            Generate with SDXL
          </LoadingButton>
          
          <LoadingButton
            onClick={() => flux.generate(prompt, 'flux')}
            className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            isLoading={flux.isLoading}
          >
            Generate with FLUX
          </LoadingButton>
        </div>
      </form>

      {(sdxl.error || flux.error) && (
        <div className="bg-red-500/10 text-red-500 rounded-lg p-4 mt-6">
          {sdxl.error || flux.error}
        </div>
      )}

      {(sdxl.prediction || flux.prediction) && (
        <div className="mt-6 space-y-8">
          {sdxl.prediction?.output && (
            <div>
              <h3 className="text-lg font-semibold mb-2">SDXL Output</h3>
              <OutputImagePreview
                src={Array.isArray(sdxl.prediction.output) ? sdxl.prediction.output[sdxl.prediction.output.length - 1] : sdxl.prediction.output}
                alt="SDXL generated image"
              />
              <p className="mt-2 text-sm text-gray-400">status: {sdxl.prediction.status}</p>
            </div>
          )}
          
          {flux.prediction?.output && (
            <div>
              <h3 className="text-lg font-semibold mb-2">FLUX Output</h3>
              <OutputImagePreview
                src={Array.isArray(flux.prediction.output) ? flux.prediction.output[flux.prediction.output.length - 1] : flux.prediction.output}
                alt="FLUX generated image"
              />
              <p className="mt-2 text-sm text-gray-400">status: {flux.prediction.status}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}