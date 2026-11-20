import scss from "./LineChart.module.scss";

export interface ChartPoint {
  label: string;
  value: number;
  /** Заявленный (self-reported) результат — рисуется иначе (ТЗ 4.10) */
  muted?: boolean;
}

interface LineChartProps {
  points: ChartPoint[];
  /** Горизонтальная линия цели */
  target?: number | null;
  /** Диапазон прогноза справа: low…high */
  band?: { low: number; high: number } | null;
  ariaLabel: string;
  height?: number;
}

const W = 640;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

/** Лёгкий SVG-график без сторонних библиотек: траектория балла, цель, прогноз */
const LineChart = ({ points, target, band, ariaLabel, height = 240 }: LineChartProps) => {
  const values = [
    ...points.map((p) => p.value),
    ...(target ? [target] : []),
    ...(band ? [band.low, band.high] : []),
  ];
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;

  const innerW = W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const slots = Math.max(points.length - 1 + (band ? 1 : 0), 1);
  const x = (i: number) => PAD.left + (innerW * i) / slots;
  const y = (v: number) => PAD.top + innerH - ((v - min) / span) * innerH;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  const area = points.length
    ? `${line} L${x(points.length - 1)},${y(min)} L${x(0)},${y(min)} Z`
    : "";
  const ticks = [0, 0.5, 1].map((k) => min + span * k);
  const last = points.length - 1;

  return (
    <svg
      className={scss.chart}
      viewBox={`0 0 ${W} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id="orto-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" className={scss.areaStart} />
          <stop offset="100%" className={scss.areaEnd} />
        </linearGradient>
      </defs>

      {ticks.map((v) => (
        <g key={v}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} className={scss.grid} />
          <text x={PAD.left - 8} y={y(v) + 4} className={scss.axis} textAnchor="end">
            {Math.round(v)}
          </text>
        </g>
      ))}

      {target ? (
        <line x1={PAD.left} x2={W - PAD.right} y1={y(target)} y2={y(target)} className={scss.target} />
      ) : null}

      {band && last >= 0 && (
        <rect
          x={x(last) + 4}
          width={Math.max(x(last + 1) - x(last) - 8, 6)}
          y={y(band.high)}
          height={Math.max(y(band.low) - y(band.high), 2)}
          rx={6}
          className={scss.band}
        />
      )}

      {area && <path d={area} fill="url(#orto-area)" />}
      {line && <path d={line} className={scss.line} />}

      {points.map((p, i) => (
        <circle
          key={`${p.label}-${i}`}
          cx={x(i)}
          cy={y(p.value)}
          r={5}
          className={p.muted ? scss.dotMuted : scss.dot}
        />
      ))}

      {points.map((p, i) =>
        points.length <= 8 || i % Math.ceil(points.length / 6) === 0 ? (
          <text key={`l-${i}`} x={x(i)} y={height - 8} className={scss.axis} textAnchor="middle">
            {p.label}
          </text>
        ) : null,
      )}
    </svg>
  );
};

export default LineChart;
