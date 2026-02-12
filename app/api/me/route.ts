import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureUser, getMembership } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const googleSub = (session as any)?.googleSub as string | undefined;

  if (!googleSub) {
    return Response.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  await ensureUser(googleSub);
  const membership = await getMembership(googleSub);

  return Response.json({ ok: true, membership });
}
