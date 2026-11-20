import type { ReactNode } from "react";
import scss from "./Progress.module.scss";

type Tone = "primary" | "success" | "warning" | "danger";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

interface ProgressBarProps {
  /** 0…1 */
  value: number;
  tone?: Tone;
  label?: string;
  size?: "sm" | "md";
}

export const ProgressBar = ({ value, tone = "primary", label, size = "md" }: ProgressBarProps) => (
  <div
    className={[scss.bar, scss[size]].join(" ")}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(clamp(value) * 100)}
    aria-label={label}
  >
    <span className={[scss.fill, scss[tone]].join(" ")} style={{ width: `${clamp(value) * 100}%` }} />
  </div>
);

/** Цвет по уровню: <60% — красный, <75% — жёлтый, иначе зелёный */
export const toneByRatio = (ratio: number): Tone =>
  ratio < 0.6 ? "danger" : ratio < 0.75 ? "warning" : "success";

interface RingProps {
  /** 0…1; null — данных нет */
  value: number | null;
  size?: number;
  children?: ReactNode;
  label?: string;
}

/** Кольцевой индикатор: «ЖРТга даярдык 68%» */
export const Ring = ({ value, size = 150, children, label }: RingProps) => {
  const stroke = Math.max(10, Math.round(size / 11));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = value === null ? 0 : clamp(value);

  return (
    <div className={scss.ring} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <circle cx={size / 2} cy={size / 2} r={r} className={scss.track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={scss.arc}
          strokeWidth={stroke}
          strokeDasharray={`${c * v} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={scss.center}>{children}</div>
    </div>
  );
};
