import AiTeacher from "@/components/pages/sidebar/AiTeacher";
import React, { Suspense } from "react";

// AiTeacher читает ?q= и ?session= из URL → нужна Suspense-граница
const page = () => (
  <Suspense>
    <AiTeacher />
  </Suspense>
);

export default page;
