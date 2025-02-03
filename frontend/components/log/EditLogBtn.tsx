import Link from "next/link";

type EditLogBtnProps = {
  id: string,
  isPlan?: boolean,
}

const EditLogBtn:React.FC<EditLogBtnProps> = ({ id, isPlan }) => {
  return (
    <Link href={`/${isPlan ? 'plan' : 'logBook'}/${id}/edit`}>
      <button
        className="w-12 h-12 rounded-full bg-eyeCatch text-darkBlue text-sm leading-3 text-center hover:bg-eyeCatchDark"
      >
        Edit
      </button>
    </Link>
  );
}

export default EditLogBtn;