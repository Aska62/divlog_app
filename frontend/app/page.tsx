import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mt-20 md:mt-52 lg:mt-64">
        <div className="w-64 mx-auto my-24 md:mt-36 lg:mt-48 text-center hover:cursor-pointer hover:text-darkBlueLight duration-150">
          <p>The last dive was on</p>
          <p className="text-4xl py-2">28 Sep 2024</p>
          <p className="text-l">At Green Lagoon, Phillippines</p>
        </div>
        <div className="flex flex-col lg:flex-row max-w-xl mx-auto">
          <Link href="#" className="mx-auto my-4 w-56 h-28 flex items-center justify-center border border-darkBlue rounded-md text-xl shadow-lg hover:bg-lightBlue duration-75">
            Dive Plan
          </Link>
          <Link href="logBook" className="mx-auto my-4 w-56 h-28 flex items-center justify-center border border-darkBlue rounded-md text-xl shadow-lg hover:bg-lightBlue duration-75">
            Log Book
          </Link>
        </div>
      </main>
    </>
  );
}
