import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureUser, joinSchoolWithCode, joinSchoolWithToken } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const googleSub = (session as any)?.googleSub as string | undefined;

  if (!googleSub) {
    return Response.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!code && !token) {
    return Response.json({ ok: false, error: "Provide a code or token." }, { status: 400 });
  }

  await ensureUser(googleSub);

  const result = token
    ? await joinSchoolWithToken(googleSub, token)
    : await joinSchoolWithCode(googleSub, code);

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 400 });
  }

  return Response.json({ ok: true });
}
