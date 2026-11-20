import { redirect } from "next/navigation";

// /dashboard → кабинет (после входа пользователь попадает сюда)
const page = () => redirect("/dashboard/kabinet");

export default page;
