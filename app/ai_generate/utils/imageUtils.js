export const getValidImageUrl = (prediction) => {
  if (!prediction) return null;
  
  // For both models, we now receive a consistent format
  // with status and output fields
  if (prediction.status === 'succeeded') {
    if (typeof prediction.output === 'string') {
      return prediction.output;
    }
    if (Array.isArray(prediction.output)) {
      return prediction.output[0];
    }
  }
  
  console.log('Unhandled prediction format:', prediction);
  return null;
};

export const isValidPrediction = (prediction) => {
  if (!prediction) return false;
  return prediction.status === 'succeeded' && getValidImageUrl(prediction) !== null;
};