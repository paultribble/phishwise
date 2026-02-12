import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const googleSub = (session as any)?.googleSub as string | undefined;

  if (!googleSub) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div>
          <div style={{ fontSize: 20, marginBottom: 10 }}>Not logged in</div>
          <a href="/login">Go to login</a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Dashboard (placeholder)</h1>
      <p style={{ opacity: 0.8 }}>Logged in and ready.</p>
      <p style={{ opacity: 0.8 }}>Next: user dashboard + manager dashboard + invites UI.</p>
    </main>
  );
}
