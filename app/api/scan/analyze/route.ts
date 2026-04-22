import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";
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

    const client = new Anthropic();

    const message = await client.messages.create({
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
              text: `Analyze this email or text message screenshot for phishing/scam indicators.

Provide your analysis in this exact JSON format:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "confidence": 0.0 to 1.0,
  "verdict": "LEGITIMATE" | "LIKELY PHISHING" | "CONFIRMED PHISHING",
  "redFlags": ["flag1", "flag2", ...],
  "explanation": "Brief explanation of findings"
}

Look for:
- Urgency language ("ACT NOW", "24 hours", "URGENT")
- Requests for credentials or personal info
- Suspicious sender addresses or domain names
- Misspellings or poor grammar
- Links that don't match claimed sender
- Too good to be true offers (prizes, money)
- Requests to click links or download attachments
- Threats of account closure or consequences

Be thorough but concise. Always return valid JSON.`,
            },
          ],
        },
      ],
    });

    // Extract the text response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse analysis response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

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
