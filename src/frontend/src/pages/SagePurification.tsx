export default function SagePurification() {
  return (
    <div
      data-ocid="vestras_advice.page"
      style={{
        background: "#0F0F12",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#C4A97D",
          marginBottom: "2rem",
        }}
      >
        Vestra
      </p>

      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          fontWeight: 400,
          color: "#ffffff",
          lineHeight: 1.1,
          marginBottom: "3rem",
          letterSpacing: "0.02em",
        }}
      >
        Vestra's Advice
      </h1>

      <div
        style={{
          maxWidth: "640px",
          borderTop: "1px solid rgba(196,169,125,0.3)",
          borderBottom: "1px solid rgba(196,169,125,0.3)",
          padding: "3rem 2rem",
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
          }}
        >
          We recommend washing garments before use. Only sell authentic products
          of medium to high quality — this ensures Vestra's standards are
          maintained. Non-compliant items will not be accepted into the network.
          Items ship directly from seller to buyer. Shipping costs are covered
          by the buyer.
        </p>
      </div>
    </div>
  );
}
