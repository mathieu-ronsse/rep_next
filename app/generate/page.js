"use client"
import { useState } from "react";

export default function GeneratePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REPLICATE_API_KEY;  // Hardcode your API token for debugging

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Using token:", apiKey);

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Token ${apiKey}`,  // Use the hardcoded token
        },
        body: JSON.stringify({
          version: "black-forest-labs/flux-schnell",
          input: {
            prompt: "car on a road",
          },
        }),
      });
  
      // Log the response for debugging
      const responseText = await response.text(); // Use text() to inspect raw response
      console.log("Raw response:", responseText); // Logs raw response for debugging
  
      // Check if the response body is empty
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      // Try parsing the JSON only if the response is not empty
      const prediction = responseText ? JSON.parse(responseText) : null;
  
      if (prediction && prediction.status === "succeeded" && prediction.output) {
        setImages(prediction.output);
      } else {
        setError("Failed to generate images. Please try again.");
      }
    } catch (err) {
      console.error("Error during image generation:", err);
      setError(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Generate Images</h1>
      <button
        onClick={generateImage}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Generated image ${index}`}
            style={{ maxWidth: "300px", margin: "10px" }}
          />
        ))}
      </div>
    </div>
  );
}
