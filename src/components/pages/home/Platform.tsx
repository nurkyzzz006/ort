"use client";
import type { ReactNode } from "react";
import {
  LuArrowRight,
  LuChartNoAxesColumn,
  LuFileText,
  LuRotateCw,
  LuSparkles,
  LuTarget,
  LuTriangleAlert,
} from "react-icons/lu";
import { useSession } from "@/api";
import Button from "@/components/ui/Button";
import { useT } from "@/i18n";
import scss from "./Platform.module.scss";

const ICONS: ReactNode[] = [
  <LuFileText key="tests" />,
  <LuTarget key="practice" />,
  <LuTriangleAlert key="mistakes" />,
  <LuRotateCw key="review" />,
  <LuSparkles key="tutor" />,
  <LuChartNoAxesColumn key="analytics" />,
];

/** «Бир платформада — бүт даярдык» + CTA-баннер */
const Platform = () => {
  const t = useT();
  const p = t.landing.features;
  const { isAuthenticated } = useSession();

  return (
    <section id="features" className={scss.section}>
      <div className="container">
        <h2 className={scss.title}>{p.title}</h2>
        <p className={scss.lead}>{p.lead}</p>

        <ul className={scss.grid}>
          {p.items.map((item, i) => (
            <li key={item.title} className={scss.card}>
              <span className={scss.icon} aria-hidden>
                {ICONS[i]}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>

        <div className={scss.cta}>
          <div>
            <h2>{p.ctaTitle}</h2>
            <p>{p.ctaText}</p>
          </div>
          <Button
            href={isAuthenticated ? "/dashboard/tester?kind=diagnostic" : "/register"}
            variant="secondary"
            size="lg"
            iconRight={<LuArrowRight />}
          >
            {isAuthenticated ? t.landing.hero.primaryCta : p.ctaButton}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Platform;
