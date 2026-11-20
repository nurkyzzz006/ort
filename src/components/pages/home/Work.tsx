"use client";
import { useT } from "@/i18n";
import scss from "./Work.module.scss";

/** «Кантип иштейт» — четыре шага цикла */
const Work = () => {
  const t = useT();
  const w = t.landing.how;

  return (
    <section id="how" className={scss.section}>
      <div className="container">
        <h2 className={scss.title}>{w.title}</h2>
        <p className={scss.lead}>{w.lead}</p>

        <ol className={scss.steps}>
          {w.steps.map((step, i) => (
            <li key={step.title} className={scss.step}>
              <span className={scss.number}>{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Work;
