import Link from "next/link";

type AddNewLogBtnProps = {
  isPlan?: boolean;
}

const AddNewLogBtn:React.FC<AddNewLogBtnProps> = ({ isPlan }) => {
  return (
    <Link href={`/${isPlan ? 'plans' : 'logBook'}/add`}>
      <button
        className="w-12 h-12 rounded-full bg-eyeCatch text-darkBlue text-sm leading-3 text-center hover:bg-eyeCatchDark"
      >
        Add New
      </button>
    </Link>
  );
}

export default AddNewLogBtn;