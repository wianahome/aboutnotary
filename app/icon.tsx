import { ImageResponse } from "next/og";

// Mengatur runtime ke Edge agar proses render secepat kilat
export const runtime = "edge";

// Ukuran standar untuk favicon browser modern
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      // Desain Favicon: Kotak rounded gelap dengan aksen stamp/notaris profesional
      <div
        style={{
          fontSize: "18px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          border: "1px solid rgba(56, 189, 248, 0.3)",
        }}
      >
        {/* Teks "N" (Notary) dengan warna biru muda menyala */}
        <span
          style={{
            fontWeight: 800,
            color: "#38bdf8",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.05em",
          }}
        >
          N
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}