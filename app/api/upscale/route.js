import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { detail: 'REPLICATE_API_TOKEN is not set' },
      { status: 500 }
    );
  }

  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { detail: 'No image provided' },
        { status: 400 }
      );
    }

    const prediction = await replicate.predictions.create({
      version: "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
      input: {
        image: imageUrl,
        scale: 4,
        face_enhance: false
      }
    });

    if (prediction?.error) {
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { detail: error.message },
      { status: 500 }
    );
  }
}