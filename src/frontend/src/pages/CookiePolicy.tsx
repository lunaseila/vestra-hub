export default function CookiePolicy() {
  return (
    <div className="cookie-policy-page">
      <div className="cookie-policy-container">
        <h1 className="cookie-policy-title">COOKIE POLICY</h1>
        <p className="cookie-policy-updated">Last updated: June 15, 2026</p>

        <section className="cookie-policy-section">
          <h2 className="cookie-policy-heading">1. What are cookies</h2>
          <p className="cookie-policy-body">
            Cookies are small text files stored on your device when you visit a
            website. They help us understand how you interact with Vestra.
          </p>
        </section>

        <section className="cookie-policy-section">
          <h2 className="cookie-policy-heading">2. What we use cookies for</h2>
          <ul className="cookie-policy-list">
            <li>
              <span className="cookie-policy-list-label">
                Essential cookies:
              </span>{" "}
              site functionality and session management.
            </li>
            <li>
              <span className="cookie-policy-list-label">
                Analytics cookies:
              </span>{" "}
              understanding traffic and usage patterns (only if accepted).
            </li>
            <li>No advertising cookies. No third-party data sharing.</li>
          </ul>
        </section>

        <section className="cookie-policy-section">
          <h2 className="cookie-policy-heading">3. How to manage cookies</h2>
          <p className="cookie-policy-body">
            You can withdraw your consent at any time by clearing your browser
            cookies or contacting us at{" "}
            <a
              href="mailto:privacy@vestra.space"
              className="cookie-policy-link"
            >
              privacy@vestra.space
            </a>
          </p>
        </section>

        <section className="cookie-policy-section">
          <h2 className="cookie-policy-heading">4. Contact</h2>
          <p className="cookie-policy-body">
            <a
              href="mailto:privacy@vestra.space"
              className="cookie-policy-link"
            >
              privacy@vestra.space
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
