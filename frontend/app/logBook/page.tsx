import Header from "@/components/Header";
import Heading from "@/components/Heading";
import LogSearchForm from "@/components/LogSearchForm";

const LogBokPage = () => {
  return (
    <>
      <Header />
      <Heading pageTitle="Log Book" />
      <LogSearchForm />
    </>
  );
}

export default LogBokPage;