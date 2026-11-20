import scss from "./Segmented.module.scss";

interface SegmentedProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  variant?: "pills" | "switch";
}

/** Переключатель: фильтры-«таблетки» (Баары / Математика) или KY | RU */
const Segmented = <T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  variant = "pills",
}: SegmentedProps<T>) => (
  <div className={[scss.group, scss[variant]].join(" ")} role="radiogroup" aria-label={ariaLabel}>
    {options.map((o) => (
      <button
        key={String(o.value)}
        type="button"
        role="radio"
        aria-checked={o.value === value}
        className={o.value === value ? scss.active : ""}
        onClick={() => onChange(o.value)}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export default Segmented;
