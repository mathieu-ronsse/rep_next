import { NextResponse } from "next/server";
import Replicate from "replicate";
import { MODEL_VERSIONS } from "@/app/ai_generate/config/models";
 
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
 
const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;
 
export async function POST(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.'
    );
  }
 
  const { prompt, modelVersion } = await request.json();
  
  if (!MODEL_VERSIONS[modelVersion]) {
    return NextResponse.json(
      { detail: `Invalid model version: ${modelVersion}` },
      { status: 400 }
    );
  }

  const modelConfig = MODEL_VERSIONS[modelVersion];
  const input = modelConfig.getInput(prompt);
  
  let prediction;
  
  try {
    if (modelVersion === 'flux') {
      prediction = await replicate.run(
        modelConfig.model,
        { input }
      );
    } else {
      prediction = await replicate.predictions.create({
        version: modelConfig.version,
        input,
        ...(WEBHOOK_HOST && {
          webhook: `${WEBHOOK_HOST}/api/webhooks`,
          webhook_events_filter: ["start", "completed"]
        })
      });
    }
  } catch (error) {
    return NextResponse.json({ detail: error.message }, { status: 500 });
  }
 
  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }
 
  return NextResponse.json(prediction, { status: 201 });
}