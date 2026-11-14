
import scss from "./Work.module.scss";

const Work = () => {
  return (
    <div id={scss.Work}>
      <div className="container">
        <div className={scss.content}>
          <h1>Кантип иштейт</h1>
          <p>
            Төрт кадамдан турган цикл: диагностика - практика -
            каталарды талдоо - интервалдык кайталоо
          </p>

          <div className={scss.interval}>
            <div className={scss.interval_card}>
              <span className={scss.number}>1</span>
              <h2>Диагностика</h2>
              <p>
                Тесттин башталышында сиздин билим деңгээлиңизди аныктоо
                үчүн диагностикадан өтөсүз.
              </p>
            </div>

            <div className={scss.interval_card}>
              <span className={scss.number}>2</span>
              <h2>Күнүмдүк план</h2>
              <p>
                Duo карточкалар, алсыз темалар жана бош убакыт боюнча план.
              </p>
            </div>

            <div className={scss.interval_card}>
              <span className={scss.number}>3</span>
              <h2>Практика жана тест</h2>
              <p>
                Ар бир ката журналга түшүп, дароо түшүндүрмө берилет.
              </p>
            </div>

            <div className={scss.interval_card}>
              <span className={scss.number}>4</span>
              <h2>Кайталоо</h2>
              <p>
                Smart Review 1, 3, 7, 14, 30 күндөн кийин кайталоо
                менен билим бекемделет.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
