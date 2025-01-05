// Helper functions for image handling
export const getValidImageUrl = (prediction) => {
  if (!prediction?.output) return null;
  
  // Handle array of images (FLUX model)
  if (Array.isArray(prediction.output)) {
    const lastImage = prediction.output[prediction.output.length - 1];
    return lastImage || null;
  }
  
  // Handle single image URL (SDXL model)
  return prediction.output || null;
};

export const isValidPrediction = (prediction) => {
  if (!prediction) return false;
  
  const hasValidOutput = prediction.output && (
    (Array.isArray(prediction.output) && prediction.output.length > 0) ||
    (typeof prediction.output === 'string' && prediction.output.length > 0)
  );
  
  return hasValidOutput && prediction.status === 'succeeded';
};