'use client';

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ModelSelector from "@/components/ModelSelector";
import PromptInput from "@/components/PromptInput";
import LoadingButton from "@/components/LoadingButton";
import GenerationOutput from "./components/GenerationOutput";
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

  // Get the active generation based on which model was last used
  const activeGeneration = sdxl.isLoading ? sdxl : flux.isLoading ? flux : sdxl;

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

      {activeGeneration.error && (
        <div className="bg-red-500/10 text-red-500 rounded-lg p-4 mt-6">
          {activeGeneration.error}
        </div>
      )}

      <GenerationOutput 
        prediction={activeGeneration.prediction}
        status={activeGeneration.status}
      />
    </div>
  );
}