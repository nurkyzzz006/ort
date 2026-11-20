import Result from "@/components/pages/exam/Result";

const page = async ({ params }: PageProps<"/dashboard/tester/[sessionId]/result">) => {
  const { sessionId } = await params;
  return <Result sessionId={sessionId} />;
};

export default page;
