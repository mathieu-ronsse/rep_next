import { pollPrediction } from './predictionPolling';

export const handleFluxModel = (result, { setStatus, setPrediction }) => {
  setStatus('succeeded');
  setPrediction(result);
};

export const handleSdxlModel = async (result, { setStatus, setPrediction }) => {
  setPrediction(result);
  let currentPrediction = result;
  setStatus(currentPrediction.status);

  while (
    currentPrediction.status !== "succeeded" &&
    currentPrediction.status !== "failed"
  ) {
    await sleep(1000);
    currentPrediction = await pollPrediction(currentPrediction.id);
    setPrediction(currentPrediction);
    setStatus(currentPrediction.status);
  }

  if (currentPrediction.status === "failed") {
    throw new Error('Image generation failed');
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));