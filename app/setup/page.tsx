"use client";

import { useEffect, useMemo, useState } from "react";

type Membership =
  | null
  | {
      school_id: number;
      role: "USER" | "MANAGER";
      school_name: string;
    };

export default function SetupPage() {
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<Membership>(null);
  const [error, setError] = useState<string>("");

  const [schoolName, setSchoolName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [inviteToken, setInviteToken] = useState("");

  const tokenFromUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const u = new URL(window.location.href);
    return u.searchParams.get("token") ?? "";
  }, []);

  useEffect(() => {
    if (tokenFromUrl) setInviteToken(tokenFromUrl);

    (async () => {
      setLoading(true);
      setError("");

      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) {
        setLoading(false);
        setError("You need to log in first.");
        return;
      }

      const data = await res.json();
      setMembership(data.membership ?? null);
      setLoading(false);

      if (data.membership?.school_id) {
        window.location.href = "/dashboard";
      }
    })();
  }, [tokenFromUrl]);

  async function handleCreateSchool() {
    setError("");
    const name = schoolName.trim();
    if (!name) return setError("Enter a school name.");

    const res = await fetch("/api/schools/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data?.error ?? "Failed to create school.");

    window.location.href = "/dashboard";
  }

  async function handleJoinWithCode() {
    setError("");
    const code = joinCode.trim();
    if (!code) return setError("Enter a join code.");

    const res = await fetch("/api/schools/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data?.error ?? "Failed to join school.");

    window.location.href = "/dashboard";
  }

  async function handleJoinWithToken() {
    setError("");
    const token = inviteToken.trim();
    if (!token) return setError("Missing invite token.");

    const res = await fetch("/api/schools/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data?.error ?? "Failed to join school.");

    window.location.href = "/dashboard";
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ opacity: 0.75 }}>Loading…</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: 24, maxWidth: 920, margin: "0 auto" }}>
      <h1 style={{ fontSize: 34, marginBottom: 6 }}>First-time setup</h1>
      <p style={{ marginTop: 0, opacity: 0.8, lineHeight: 1.6 }}>
        Choose one option to get started. You can join an existing school or create your own.
      </p>

      {error ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,80,80,0.35)",
            background: "rgba(255,80,80,0.10)"
          }}
        >
          {error}
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Join a school</h2>
          <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
            If someone invited you, use the join code or paste the invite link token.
          </p>

          <label style={labelStyle}>Join code</label>
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Example: AB12CD"
            style={inputStyle}
          />
          <button onClick={handleJoinWithCode} style={btnStyle}>
            Join with code
          </button>

          <div style={{ height: 12 }} />

          <label style={labelStyle}>Invite token (from link)</label>
          <input
            value={inviteToken}
            onChange={(e) => setInviteToken(e.target.value)}
            placeholder="Token from invite link"
            style={inputStyle}
          />
          <button onClick={handleJoinWithToken} style={btnStyle}>
            Join with invite link
          </button>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Create a school</h2>
          <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
            You’ll become the manager. You can invite people and adjust frequency later.
          </p>

          <label style={labelStyle}>School name</label>
          <input
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="Example: Tribble Household"
            style={inputStyle}
          />
          <button onClick={handleCreateSchool} style={btnStyle}>
            Create school
          </button>
        </section>
      </div>

      <div style={{ marginTop: 18, opacity: 0.75 }}>
        Want a simple overview first? <a href="/learn-more">Read Learn More</a>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: 18,
  background: "rgba(255,255,255,0.03)"
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  opacity: 0.8,
  marginTop: 10,
  marginBottom: 6
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.12)",
  color: "white",
  outline: "none"
};

const btnStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 12,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.22)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontSize: 16
};
