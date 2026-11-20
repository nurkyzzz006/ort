import ResetPassword from "@/components/pages/auth/ResetPassword";
import React, { Suspense } from "react";

// useSearchParams внутри ResetPassword требует Suspense-границу
const page = () => (
  <Suspense>
    <ResetPassword />
  </Suspense>
);

export default page;
