'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Generate() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
          prompt: e.target.prompt.value,
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
    <div className="container max-w-2xl mx-auto p-5">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mr-4">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">
          Dream something with{" "}
          <a href="https://replicate.com/stability-ai/sdxl" className="text-blue-500 hover:text-blue-700">
            SDXL
          </a>
        </h1>
      </div>

      <form className="w-full flex" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow"
          name="prompt"
          placeholder="Enter a prompt to display an image"
        />
        <LoadingButton
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
          isLoading={isLoading}
        >
          Generate
        </LoadingButton>
      </form>

      {error && (
        <div className="bg-red-500/10 text-red-500 rounded-lg p-4 mt-4">
          {error}
        </div>
      )}

      {prediction && (
        <div className="mt-4">
          {prediction.output && (
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={prediction.output[prediction.output.length - 1]}
                alt="Generated image"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}
          <p className="mt-2 text-sm opacity-50">status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}