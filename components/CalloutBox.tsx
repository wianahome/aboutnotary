import { AlertTriangle, Info, Lightbulb, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type CalloutVariant = "info" | "tip" | "warning";

interface CalloutBoxProps {
  title: string;
  children: ReactNode;
  variant?: CalloutVariant;
}

const variantConfig: Record<
  CalloutVariant,
  { styles: string; icon: LucideIcon; iconColor: string }
> = {
  info: {
    styles: "border-blue-200 bg-blue-50 text-blue-950",
    icon: Info,
    iconColor: "text-blue-600",
  },
  tip: {
    styles: "border-emerald-200 bg-emerald-50 text-emerald-950",
    icon: Lightbulb,
    iconColor: "text-emerald-600",
  },
  warning: {
    styles: "border-amber-200 bg-amber-50 text-amber-950",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
};

export default function CalloutBox({
  title,
  children,
  variant = "info",
}: CalloutBoxProps) {
  const { styles, icon: Icon, iconColor } = variantConfig[variant];

  return (
    <aside
      className={`my-8 rounded-xl border p-5 sm:p-6 ${styles}`}
      role="note"
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-inherit opacity-90">
        {children}
      </div>
    </aside>
  );
}
