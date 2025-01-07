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
    return NextResponse.json(
      { detail: 'The REPLICATE_API_TOKEN environment variable is not set.' },
      { status: 500 }
    );
  }
 
  try {
    const { prompt, modelVersion } = await request.json();
    
    if (!MODEL_VERSIONS[modelVersion]) {
      return NextResponse.json(
        { detail: `Invalid model version: ${modelVersion}` },
        { status: 400 }
      );
    }

    const modelConfig = MODEL_VERSIONS[modelVersion];
    const input = modelConfig.getInput(prompt);
    
    let result;
    
    if (modelVersion === 'flux') {
      // For FLUX, run directly and return output
      result = await replicate.run(
        modelConfig.model,
        { input }
      );

      console.log('FLUX model result:', result);

      // Ensure we have a valid result
      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new Error('Invalid response from FLUX model');
      }

      // Wrap the result in a format similar to SDXL for consistent handling
      return NextResponse.json({
        status: 'succeeded',
        output: result[result.length - 1]
      }, { status: 201 });
    } else {
      // For SDXL, create prediction and return prediction object
      result = await replicate.predictions.create({
        version: modelConfig.version,
        input,
        ...(WEBHOOK_HOST && {
          webhook: `${WEBHOOK_HOST}/api/webhooks`,
          webhook_events_filter: ["start", "completed"]
        })
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return NextResponse.json(result, { status: 201 });
    }
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { detail: error.message || 'An error occurred during prediction' },
      { status: 500 }
    );
  }
}