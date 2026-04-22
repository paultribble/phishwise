import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";
import { detectPhishing } from "@/lib/phishing-detector";
import Anthropic from "@anthropic-ai/sdk";

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

    if (!process.env.ANTHROPIC_API_KEY) {
      log.error({}, "ANTHROPIC_API_KEY environment variable not set");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Step 1: Extract text from image using Claude vision
    const extractMessage = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageType || "image/png",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: "Extract all text content from this email or text message screenshot. Return only the text content, nothing else.",
            },
          ],
        },
      ],
    });

    // Extract the text content
    const extractedText =
      extractMessage.content[0].type === "text"
        ? extractMessage.content[0].text
        : "";

    if (!extractedText) {
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
