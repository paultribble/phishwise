import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";
import Anthropic from "@anthropic-ai/sdk";

const log = apiLogger("/api/scan/analyze");

interface AnalysisResult {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  verdict: string;
  redFlags: string[];
  explanation: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    log.warn({}, "Unauthorized scan attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    log.info(
      { userId: session.user.id, imageType },
      "Analyzing screenshot for phishing with Claude"
    );

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: (imageType || "image/png") as
                  | "image/jpeg"
                  | "image/png"
                  | "image/gif"
                  | "image/webp",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Analyze this screenshot for phishing and security threats. Return a JSON response with EXACTLY this structure:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "confidence": <number 0-1>,
  "verdict": "<one sentence verdict>",
  "redFlags": ["<flag1>", "<flag2>", ...],
  "explanation": "<2-3 sentence explanation>"
}

Assess for:
- Phishing attempts (impersonation, credential harvesting)
- Suspicious links or domains
- Social engineering tactics (urgency, threats, authority)
- Spoofed branding or logos
- Requests for sensitive information
- Typos and grammatical errors (common in phishing)

Be specific about what you observe. If legitimate, say so and explain why.
Return ONLY the JSON, no other text.`,
            },
          ],
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse Claude response as JSON");
    }

    const analysis: AnalysisResult = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (
      !analysis.riskLevel ||
      analysis.confidence === undefined ||
      !analysis.verdict ||
      !Array.isArray(analysis.redFlags) ||
      !analysis.explanation
    ) {
      throw new Error("Invalid analysis structure from Claude");
    }

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
