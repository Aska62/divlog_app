import Header from "@/components/Header";
import Heading from "@/components/Heading";
import LogSearchForm from "@/components/log/LogSearchForm";

const LogBokPage = () => {
  return (
    <>
      <Header />
      <Heading pageTitle="Log Book" />
      <LogSearchForm />
      <div className="bg-slate-300 w-full">

      </div>
    </>
  );
}

export default LogBokPage;