import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSchool, ensureUser } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const googleSub = (session as any)?.googleSub as string | undefined;

  if (!googleSub) {
    return Response.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();

  if (!name) {
    return Response.json({ ok: false, error: "School name is required." }, { status: 400 });
  }

  await ensureUser(googleSub);
  const schoolId = await createSchool(googleSub, name);

  return Response.json({ ok: true, schoolId });
}
