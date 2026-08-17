import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

function hasCookieConsent(): boolean {
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("vestra_cookies="));
}

function setConsentCookie(value: "accepted" | "declined") {
  document.cookie = `vestra_cookies=${value}; max-age=31536000; path=/`;
}

export function CookieConsent() {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasCookieConsent()) return;
    const timer = setTimeout(() => {
      setShouldRender(true);
      // Slight RAF delay to ensure DOM paint before class triggers animation
      requestAnimationFrame(() => setVisible(true));
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    setTimeout(() => setShouldRender(false), 650);
  }

  function handleAccept() {
    setConsentCookie("accepted");
    dismiss();
  }

  function handleDecline() {
    setConsentCookie("declined");
    dismiss();
  }

  if (!shouldRender) return null;

  return (
    <div
      data-ocid="cookie_consent.dialog"
      className={`cookie-banner${visible ? " cookie-banner--visible" : " cookie-banner--hidden"}`}
    >
      <div className="cookie-banner__inner">
        <p className="cookie-banner__text">
          Vestra uses cookies to improve your experience and analyze site
          performance. No data is sold. Ever.{" "}
          <Link to="/CookiePolicy" className="cookie-banner__link">
            Cookie Policy
          </Link>
        </p>
        <div className="cookie-banner__actions">
          <button
            type="button"
            data-ocid="cookie_consent.confirm_button"
            className="cookie-banner__btn cookie-banner__btn--accept"
            onClick={handleAccept}
          >
            ACCEPT
          </button>
          <button
            type="button"
            data-ocid="cookie_consent.cancel_button"
            className="cookie-banner__btn cookie-banner__btn--decline"
            onClick={handleDecline}
          >
            DECLINE
          </button>
        </div>
      </div>
    </div>
  );
}
