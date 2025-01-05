// Helper functions for image handling
export const getValidImageUrl = (prediction) => {
  if (!prediction) return null;
  
  // Handle array of images (FLUX model)
  if (Array.isArray(prediction)) {
    // Get the last image from the array
    return prediction[prediction.length - 1] || null;
  }
  
  // Handle single image URL (SDXL model)
  return prediction.output || null;
};

export const isValidPrediction = (prediction) => {
  if (!prediction) return false;
  
  // Handle FLUX model response (array of images)
  if (Array.isArray(prediction)) {
    return prediction.length > 0;
  }
  
  // Handle SDXL model response (prediction object)
  return prediction.status === 'succeeded' && prediction.output;
};