import Link from "next/link";

const LogCard = () => {
  const id = 124;

  return (
    <Link
      href={`/logBook/${id}`}
      className="w-60 h-44 border border-darkBlue dark:border-lightBlue rounded-md shadow-dl mx-6 my-8 flex flex-col items-center justify-center hover:bg-lightBlue dark:hover:bg-baseBlackLight duration-75"
    >
      <p className="text-sm">No. 321</p>
      <p className="text-2xl pt-1">Green Lagoon</p>
      <p className="text-lg pb-1">Thailand</p>
      <p className="text-base">24 Oct 2024</p>
    </Link>
  );
}

export default LogCard;