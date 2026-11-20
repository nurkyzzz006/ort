import Tester from "@/components/pages/sidebar/Tester";
import React, { Suspense } from "react";

// Tester читает ?kind= из URL (useSearchParams) → нужна Suspense-граница
const page = () => (
  <Suspense>
    <Tester />
  </Suspense>
);

export default page;
