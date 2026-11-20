import Exam from "@/components/pages/exam/Exam";

const page = async ({ params }: PageProps<"/dashboard/tester/[sessionId]">) => {
  const { sessionId } = await params;
  return <Exam sessionId={sessionId} />;
};

export default page;
