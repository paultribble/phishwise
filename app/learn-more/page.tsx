export default function LearnMorePage() {
  return (
    <main style={{ minHeight: "100vh", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 34, marginBottom: 6 }}>What is PhishWise?</h1>
      <p style={{ marginTop: 0, opacity: 0.85, lineHeight: 1.7 }}>
        PhishWise is a training website that helps you get better at spotting phishing scams.
        Phishing scams are fake emails that try to trick you into clicking a link, giving away a password,
        or sharing private information.
      </p>

      <h2 style={{ marginTop: 22 }}>What you’ll see</h2>
      <ul style={{ opacity: 0.85, lineHeight: 1.8 }}>
        <li><b>Practice emails</b> sent to your inbox at random times.</li>
        <li><b>Instant feedback</b> if you click a bad link.</li>
        <li><b>Short lessons</b> that explain what to look for next time.</li>
        <li><b>Progress tracking</b> so you can see improvement over time.</li>
      </ul>

      <h2 style={{ marginTop: 22 }}>How it works (simple)</h2>
      <ol style={{ opacity: 0.85, lineHeight: 1.8 }}>
        <li><b>Sign in with Google.</b> You don’t need a new password.</li>
        <li><b>Pick your setup.</b> Join a group (a “school”) or create your own.</li>
        <li><b>Receive practice emails.</b> They look real, but they’re safe.</li>
        <li><b>If you click a link, you’ll get feedback.</b> PhishWise shows what signs you missed.</li>
        <li><b>Finish the short lesson.</b> It covers the scam type and quick prevention steps.</li>
        <li><b>Check your progress.</b> Your dashboard shows history and improvement.</li>
      </ol>

      <h2 style={{ marginTop: 22 }}>What is a “school”?</h2>
      <p style={{ opacity: 0.85, lineHeight: 1.7 }}>
        A school is just a group. It can be a real school, a family, or a small team.
        A manager can view group progress and adjust how often practice emails are sent.
      </p>

      <h2 style={{ marginTop: 22 }}>Privacy (plain language)</h2>
      <ul style={{ opacity: 0.85, lineHeight: 1.8 }}>
        <li>PhishWise uses Google sign-in, so it does not store your password.</li>
        <li>PhishWise tracks training results so you can see your progress.</li>
        <li>Practice emails are simulations. They are not real attacks.</li>
      </ul>

      <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/" style={linkBtnStyle}>Home</a>
        <a href="/signup" style={linkBtnStyle}>Sign up</a>
        <a href="/login" style={linkBtnStyle}>Log in</a>
        <a href="/setup" style={linkBtnStyle}>First-time setup</a>
      </div>
    </main>
  );
}

const linkBtnStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.22)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  textDecoration: "none"
};
