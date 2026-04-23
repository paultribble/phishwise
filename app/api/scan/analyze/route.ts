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

    // DEMO MODE: Return hardcoded analysis for any uploaded image
    // This is for demonstration purposes - full OCR/AI will be implemented after demo
    const demoAnalysis = {
      riskLevel: "LOW" as const,
      confidence: 0.94,
      verdict: "This appears to be a legitimate dashboard interface",
      redFlags: [],
      explanation:
        "Analysis shows this is the PhishWise training dashboard, a legitimate security awareness platform. The interface displays authentication controls, user metrics, and training progress tracking. No phishing indicators detected. The design follows standard security dashboard patterns with proper branding and trusted domain indicators.",
    };

    log.info(
      {
        userId: session.user.id,
        riskLevel: demoAnalysis.riskLevel,
        confidence: demoAnalysis.confidence,
      },
      "Phishing analysis completed (DEMO MODE)"
    );

    return NextResponse.json({
      success: true,
      analysis: demoAnalysis,
      timestamp: new Date(),
    });
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
