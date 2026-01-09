import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = SITE_CONFIG.description;

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          maxWidth: "1000px",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#d4a574",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          {SITE_CONFIG.name}
        </h1>
        <p
          style={{
            fontSize: "32px",
            color: "#cccccc",
            lineHeight: 1.4,
            marginBottom: "40px",
          }}
        >
          {SITE_CONFIG.description}
        </p>
        <span
          style={{
            fontSize: "24px",
            color: "#888888",
          }}
        >
          {SITE_CONFIG.author.name}
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
