import Link from "next/link";

const AddNewLogBtn = () => {
  return (
    <Link href={'/logBook/add'}>
      <button
        className="w-12 h-12 rounded-full bg-eyeCatch text-darkBlue text-sm leading-3 text-center hover:bg-eyeCatchDark"
      >
        Add New
      </button>
    </Link>
  );
}

export default AddNewLogBtn;