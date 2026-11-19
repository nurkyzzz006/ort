import { AiOutlineHome } from "react-icons/ai";
import { IoGridOutline } from "react-icons/io5";
import { FiTarget } from "react-icons/fi";
import { FaRegFileLines } from "react-icons/fa6";
import { TbAlertTriangle } from "react-icons/tb";
import { LuRotateCw } from "react-icons/lu";
import { TbSparklesFilled } from "react-icons/tb";
import { FiBarChart2 } from "react-icons/fi";

export const navLinks = [
  {
    label: "Кантип иштейт",
    href: "/",
  },
  {
    label: "Тесттер",
    href: "/about",
  },
  {
    label: "Практика",
    href: "/contact",
  },
  {
    label: "Аналитика",
    href: "/contact",
  },
];
export const footerLinks = [
  {
    label: "Купуялуулук",
    href: "/",
  },
  {
    label: "Шарттар",
    href: "/",
  },
  {
    label: "Колдоо",
    href: "/",
  },
  {
    label: "Telegram-бот",
    href: "/",
  },
];
export const sideBarLinks = [
  {
    icon: <AiOutlineHome />,
    label: "Башкы бет",
    href: "/",
  },
  {
    icon: <IoGridOutline />,
    label: "Кабинет",
    href: "/dashboard/kabinet",
  },
  {
    icon: <FaRegFileLines />,
    label: "Тесттер",
    href: "/dashboard/tester",
  },
  {
    icon: <FiTarget />,
    label: "Практика",
    href: "/dashboard/practice",
  },
  {
    icon: <TbAlertTriangle />,
    label: "Каталар журналы",
    href: "/dashboard/wrongs",
  },
  {
    icon: <LuRotateCw />,
    label: "Smart Review",
    href: "/dashboard/smart",
  },
  {
    icon: <TbSparklesFilled />,
    label: "AI-мугалим",
    href: "/dashboard/aiteacher",
  },
  {
    icon: <FiBarChart2 />,
    label: "Аналитика",
    href: "/dashboard/analytics",
  },
];
