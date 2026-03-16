import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/templates/[id]
 * Returns a template with its full details including body content
 * Used for email preview in manager dashboard
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        module: {
          select: { id: true, name: true },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        template: {
          id: template.id,
          name: template.name,
          subject: template.subject,
          body: template.body,
          fromAddress: template.fromAddress,
          difficulty: template.difficulty,
          module: template.module,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/templates/[id]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}
