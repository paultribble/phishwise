// app/page.tsx
export default function Home() {
  return (
    <main className="pw-page">
      <div className="pw-frame" role="img" aria-label="PhishWise landing page mock">
        <section className="pw-left">
          <div className="pw-mark" aria-label="PHISH WISE logo">
            <div className="pw-phish">PHISH</div>
            <div className="pw-wise">WISE</div>
          </div>

          <div className="pw-tagline">
            <div>Prepare Today.</div>
            <div>Prevent Tomorrow.</div>
          </div>
        </section>

        <section className="pw-right">
          <div className="pw-actions">
            <a className="pw-btn" href="/signup">SIGN UP</a>
            <a className="pw-btn" href="/login">LOG IN</a>
            <a className="pw-btn" href="/learn-more">LEARN MORE</a>
          </div>

          <div className="pw-shield" aria-hidden="true">
            <div className="pw-shield-shape">
              <span className="pw-anchor">⚓</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
