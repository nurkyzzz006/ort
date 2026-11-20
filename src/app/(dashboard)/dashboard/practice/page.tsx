import Practice from "@/components/pages/sidebar/Practice";
import React, { Suspense } from "react";

// Practice читает ?session= из URL (useSearchParams) → нужна Suspense-граница
const page = () => (
  <Suspense>
    <Practice />
  </Suspense>
);

export default page;
