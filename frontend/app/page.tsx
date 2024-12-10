import Link from "next/link";
import Header from "@/components/menu/Header";
import WelcomeMessage from "@/components/WelcomeMessage";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mt-20 md:mt-52 lg:mt-64">
        <WelcomeMessage />
        <div className="flex flex-col lg:flex-row max-w-xl mx-auto">
          <Link href="#" className="mx-auto my-4 w-56 h-28 flex items-center justify-center border border-darkBlue dark:border-lightBlue rounded-md text-xl shadow-lg hover:bg-lightBlue dark:hover:bg-baseBlackLight duration-75">
            Dive Plan
          </Link>
          <Link href="logBook" className="mx-auto my-4 w-56 h-28 flex items-center justify-center border border-darkBlue dark:border-lightBlue rounded-md text-xl shadow-lg hover:bg-lightBlue dark:hover:bg-baseBlackLight duration-75">
            Log Book
          </Link>
        </div>
      </main>
    </>
  );
}
