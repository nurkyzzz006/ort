import scss from "./Platform.module.scss";
import { FaRegFileLines } from "react-icons/fa6";
import { FiTarget } from "react-icons/fi";
import { TbAlertTriangle } from "react-icons/tb";
import { LuRefreshCw } from "react-icons/lu";
import { TbSparkles } from "react-icons/tb";
import { FiBarChart2 } from "react-icons/fi";
import { IoMdArrowForward } from "react-icons/io";

const Platform = () => {
  return (
    <div id={scss.Platform}>
      <div className="container">
        <div className={scss.content}>
          <h1>Бир платформада бут даярдык</h1>
          <p>
            Тест, практика, каталар журналы , кайталоо , AI-тушундурмо жана
            аналитика оз ара байланышта иштейт.
          </p>
          <div className={scss.cards}>
            <div className={scss.card}>
              <FaRegFileLines className={scss.icon} />
              <h2>Тесттер жага таймер</h2>
              <p>
                ЖРТ/ОРТ форматындагы толук тесттер , серверлик таймер, autosave
                жана натыйжанын деталдуу анализи.
              </p>
            </div>
            <div className={scss.card}>
              <FiTarget className={scss.icon} />
              <h2>Тематикалык практика:</h2>
              <p>
                Предмет - тема - паашк боюнча машыгуу. Ар бир жолдон кийин дароо
                түшүндүрүү жана сына
              </p>
            </div>
            <div className={scss.card}>
              <TbAlertTriangle className={scss.icon} />
              <h2>Каталар журналы</h2>
              <p>
                Ар бир ката карточка болуп сакталат: тарых, сабак, статус жана
                кайталоо күнкү.
              </p>
            </div>
            <div className={scss.card}>
              <LuRefreshCw className={scss.icon} />
              <h2>Smart Review</h2>
              <p>
                1-3-7-14-30 күн интервалдары менен паакий истицада и кайталоо.
              </p>
            </div>
            <div className={scss.card}>
              <TbSparkles className={scss.icon} />
              <h2>AI-мугалим</h2>
              <p>
                Теширилген печениди түшүндүрүп чыккан, талдык масала моко эку
                «мени тендер» орыкыныца.
              </p>
            </div>
            <div className={scss.card}>
              <FiBarChart2 className={scss.icon} />
              <h2>Аналитика</h2>
              <p>
                Натижелерди отурт, гастик, убакыт жана апсыз лекалар бир
                экранда.
              </p>
            </div>
          </div>
          <div className={scss.free}>
            <div className={scss.text}>
              <h1>Бүгүн баштаңыз — биринчи диагностика акысыз</h1>
              <p>
                15 мүнөттөн кийин жогорку темаларыңызды жана зынды планды
                көрсөткө.
              </p>
            </div>
            <button>
              Акысыз каттоо <IoMdArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Platform;
