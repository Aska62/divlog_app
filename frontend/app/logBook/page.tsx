import Header from "@/components/Header";
import Heading from "@/components/Heading";
import LogSearchForm from "@/components/log/LogSearchForm";
import LogCard from "@/components/log/LogCard";

const LogBokPage = () => {
  return (
    <>
      <Header />
      <main className="mt-20">
        <Heading pageTitle="Log Book" />
        <LogSearchForm />
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center md:flex-row md:justify-center md:flex-wrap pt-4 pb-10">
          <LogCard />
          <LogCard />
          <LogCard />
          <LogCard />
          <div className="w-60 h-44 border border-darkBlue rounded-md shadow-dl mx-6 my-8 md:justify-self-end">
            last card
          </div>
        </div>
      </main>
    </>
  );
}

export default LogBokPage;