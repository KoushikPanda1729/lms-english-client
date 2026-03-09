import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SpeakEasy — Master English with Real Partners";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        fontFamily: "sans-serif",
        padding: "60px",
      }}
    >
      {/* Logo circle */}
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "48px",
        }}
      >
        🗣️
      </div>

      {/* App name */}
      <div
        style={{
          fontSize: "72px",
          fontWeight: "bold",
          color: "white",
          marginBottom: "16px",
          letterSpacing: "-2px",
        }}
      >
        SpeakEasy
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: "32px",
          color: "rgba(255,255,255,0.85)",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        Master English with Real Partners
      </div>

      {/* Features row */}
      <div
        style={{
          display: "flex",
          gap: "24px",
        }}
      >
        {["📚 Courses", "🤖 AI Tutor", "🌍 Live Partners"].map((item) => (
          <div
            key={item}
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "40px",
              padding: "12px 28px",
              color: "white",
              fontSize: "22px",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Domain */}
      <div
        style={{
          marginTop: "40px",
          fontSize: "22px",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        learn.koushikpanda.online
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
