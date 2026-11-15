import { ImageResponse } from "next/og";
import { siteConfig } from "../../site.config";

export const alt = `${siteConfig.name} | ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The picture shown when the site is shared on social media and messaging apps. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "linear-gradient(135deg, #0d9488 0%, #0b7a82 55%, #0b4f6c 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="96" height="96" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="white" fillOpacity="0.18" />
            <rect x="18" y="8" width="12" height="32" rx="4" fill="white" />
            <rect x="8" y="18" width="32" height="12" rx="4" fill="white" />
            <path
              d="M10 24H17L20 17L24 31L27 21L29 24H38"
              stroke="#0b5d6b"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="38.5" cy="9.5" r="2.6" fill="#fde68a" />
          </svg>
          <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 32, opacity: 0.9 }}>
            Same-week appointments · Video visits · Clear prices
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
