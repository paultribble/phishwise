import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";
import { detectPhishing } from "@/lib/phishing-detector";
import Tesseract from "tesseract.js";

const log = apiLogger("/api/scan/analyze");

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    log.warn({}, "Unauthorized scan attempt");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { imageBase64, imageType } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    log.info(
      { userId: session.user.id, imageType },
      "Analyzing screenshot for phishing"
    );

    // Step 1: Extract text from image using Tesseract.js (free OCR)
    log.info({ userId: session.user.id }, "Extracting text via OCR");

    const imageBuffer = Buffer.from(imageBase64, "base64");
    const worker = await Tesseract.createWorker();

    try {
      const result = await worker.recognize(imageBuffer);
      const extractedText = result.data.text;

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("Could not extract text from image");
      }

      // Step 2: Analyze the extracted text using rule-based detector
      const analysis = detectPhishing(extractedText);

      log.info(
        {
          userId: session.user.id,
          riskLevel: analysis.riskLevel,
          confidence: analysis.confidence,
        },
        "Phishing analysis completed"
      );

      return NextResponse.json({
        success: true,
        analysis,
        timestamp: new Date(),
      });
    } finally {
      await worker.terminate();
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    log.error({ userId: session?.user?.id, error: errorMsg }, "Analysis failed");

    return NextResponse.json(
      {
        error: "Failed to analyze screenshot",
        message: errorMsg,
      },
      { status: 500 }
    );
  }
}
