import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/supabase";
import { SITE_NAME } from "@/lib/site";

export const runtime = "edge";
export const alt = "Blog article preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? "Notary Guide Article";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "9999px",
              background: "#38bdf8",
            }}
          />
          <span
            style={{
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#bae6fd",
            }}
          >
            {SITE_NAME}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "900px",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 60 ? "52px" : "64px",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "26px",
              lineHeight: 1.5,
              margin: 0,
              color: "#cbd5e1",
            }}
          >
            Trusted US notary guides with clear, expert-backed information.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "32px",
          }}
        >
          <span style={{ fontSize: "22px", color: "#94a3b8" }}>
            notaryguide.com
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "9999px",
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              fontSize: "20px",
              fontWeight: 600,
              color: "#7dd3fc",
            }}
          >
            Read Article
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
