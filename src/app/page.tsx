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
            <button className="pw-btn" type="button">SIGN UP</button>
            <button className="pw-btn" type="button">LOG IN</button>
            <button className="pw-btn" type="button">LEARN MORE</button>
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
