import scss from "./Welcome.module.scss";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoPlayOutline } from "react-icons/io5";

const Welcome = () => {
  return (
    <div id={scss.Welcome}>
      <div className="container">
        <div className={scss.content}>
          <div className={scss.content_text}>
            <p>ЖРТ/ОРТ 2027- кыргызча жана орусча</p>
            <h1>
              ЖРТ/ОРТго <span>акылдуу</span> даярдануу
            </h1>
            <p>
              Тест жон гана балл бербейт. Ар бир катаныз
              тандалып,тушундурулуп,туура убакта кайталоого кирет - ошентип
              билим бекемделет.
            </p>
            <div className={scss.btns}>
              <button>
                Диагностикадан отуу <FaArrowRightLong />
              </button>
              <button>
                {" "}
                <IoPlayOutline /> Демо тест
              </button>
            </div>
            <div className={scss.numbers}>
              <p>
                {" "}
                500+
                <br />
                <span> текшерилген суроо</span>
              </p>
              <p>
                1.3.7.14.30
                <br />
                <span> кайталоо кундору</span>
              </p>
              <p>
                2 тил <br />
                <span>кыргызча / орусча</span>
              </p>
            </div>
          </div>

          <div className={scss.content_pin}>
            <div className={scss.day}>
              <p>12 күн</p>
              <p>Сакталды</p>
            </div>

            <div className={scss.plan}>
              <button className={scss.progress}>
                <span>68%</span>
              </button>

              <div className={scss.report}>
                <p>Бүгүнкү план</p>
                <p>3/5 тапшырма аткарылды</p>
              </div>
            </div>

            <h6>7-СУРОО — МАТЕМАТИКА</h6>

            <div className={scss.question}>
              <p className={scss.question_title}>Теңдемени чыгар:</p>

              <p className={scss.equation}>x - 2 - 9 = 0</p>

              <div className={scss.answers}>
                <label className={scss.correct}>
                  <input type="radio" name="answer" value="11" defaultChecked />
                  <span>A)</span>
                  <span>11</span>
                  <span className={scss.status}>✓</span>
                </label>

                <label className={scss.option}>
                  <input type="radio" name="answer" value="7" />
                  <span>Б)</span>
                  <span>7</span>
                </label>

                <label className={scss.option}>
                  <input type="radio" name="answer" value="9" />
                  <span>В)</span>
                  <span>9</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Welcome;
