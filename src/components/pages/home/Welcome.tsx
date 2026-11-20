"use client";
import { LuArrowRight, LuCheck, LuFlame, LuPlay, LuShieldCheck } from "react-icons/lu";
import Button from "@/components/ui/Button";
import { Ring } from "@/components/ui/Progress";
import { useT } from "@/i18n";
import scss from "./Welcome.module.scss";

/** Первый экран лендинга (макет: ORTO-screens, стр. 1) */
const Welcome = () => {
  const t = useT();
  const h = t.landing.hero;

  return (
    <section className={scss.hero}>
      <div className={`container ${scss.content}`}>
        <div className={scss.text}>
          <p className={scss.eyebrow}>
            <span aria-hidden />
            {h.eyebrow}
          </p>
          <h1>
            {h.titleStart} <span className={scss.accent}>{h.titleAccent}</span> {h.titleEnd}
          </h1>
          <p className={scss.lead}>{h.lead}</p>

          <div className={scss.buttons}>
            <Button href="/dashboard/tester?kind=diagnostic" size="lg" iconRight={<LuArrowRight />}>
              {h.primaryCta}
            </Button>
            <Button href="/dashboard/tester?kind=mini" size="lg" variant="secondary" icon={<LuPlay />}>
              {h.secondaryCta}
            </Button>
          </div>

          <dl className={scss.facts}>
            {h.facts.map((f) => (
              <div key={f.value}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Иллюстрация продукта — статичная демонстрация интерфейса */}
        <div className={scss.preview} aria-hidden>
          <div className={scss.previewTop}>
            <span className={scss.streak}>
              <LuFlame /> {h.preview.streak}
            </span>
            <span className={scss.saved}>{h.preview.saved}</span>
          </div>

          <div className={scss.plan}>
            <Ring value={0.68} size={64}>
              <strong className={scss.ringText}>68%</strong>
            </Ring>
            <div>
              <p className={scss.planTitle}>{h.preview.planTitle}</p>
              <p className={scss.planText}>{h.preview.planText}</p>
            </div>
          </div>

          <p className={scss.qMeta}>{h.preview.questionMeta}</p>
          <p className={scss.qText}>
            {h.preview.question} <code>x² − 5x + 6 = 0</code>
          </p>

          <ul className={scss.options}>
            <li>
              <b>A</b> x₁ = 1, x₂ = 6
            </li>
            <li className={scss.correct}>
              <b>
                <LuCheck />
              </b>
              x₁ = 2, x₂ = 3
            </li>
            <li>
              <b>C</b> x₁ = −2, x₂ = −3
            </li>
          </ul>

          <span className={scss.verified}>
            <LuShieldCheck /> {h.preview.verified}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
