import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const log = apiLogger("/api/training/caught-data");
const querySchema = z.object({ token: z.string().min(1).max(200) });

export async function GET(req: NextRequest) {
  // Rate limit: 20 requests per day per IP
  const ip = getClientIp(req);
  const { success } = await checkRateLimit(`caught_ip_${ip}`, 20, 86400000);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Try again later" },
      { status: 429 }
    );
  }

  const rawToken = req.nextUrl.searchParams.get("token");
  const parsed = querySchema.safeParse({ token: rawToken });
  if (!parsed.success) {
    log.warn({ error: parsed.error.message }, "Validation failed");
    const e = errors.invalidInput("token");
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
  const token = parsed.data.token;

  try {
    const simEmail = await prisma.simulationEmail.findUnique({
      where: { trackingToken: token },
      include: { template: { include: { module: true } } },
    });

    if (!simEmail) {
      const e = errors.notFound("Simulation");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    const trainingModule = simEmail.template.module;
    const content = JSON.parse(trainingModule.content);

    log.info({ token }, "Caught data retrieved");
    return NextResponse.json({
      subject: simEmail.template.subject || "Security Alert",
      sender: simEmail.template.fromAddress || "security@verify-account.com",
      redFlags: content.redFlags || [],
    });
  } catch (error) {
    log.error({ error: String(error) }, "Caught data retrieval failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
