"use client";

import { signIn } from "next-auth/react";

export default function SignupPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "min(520px, 92vw)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 22 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Sign up</h1>
        <p style={{ marginTop: 8, opacity: 0.75, lineHeight: 1.4 }}>
          Your account is created the first time you sign in with Google.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/setup" })}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            cursor: "pointer",
            fontSize: 16
          }}
        >
          Sign up with Google
        </button>

        <div style={{ marginTop: 14, fontSize: 14, opacity: 0.75 }}>
          Already have an account? <a href="/login">Log in</a>
        </div>
      </div>
    </main>
  );
}
