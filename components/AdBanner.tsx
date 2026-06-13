import { Megaphone } from "lucide-react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction || !clientId) {
    return (
      <div
        className={`flex min-h-[90px] items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 ${className}`}
        role="presentation"
        aria-hidden="true"
      >
        <Megaphone className="h-4 w-4 shrink-0 opacity-60" />
        <span>Ad placeholder (production only)</span>
      </div>
    );
  }

  return (
    <div
      className={`ad-banner-container min-h-[90px] w-full overflow-hidden ${className}`}
    >
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
