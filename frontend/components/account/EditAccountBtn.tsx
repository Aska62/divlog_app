import Link from "next/link";

const accountTypeList = {
  1: 'profile',
  2: 'diverInfo',
}

type AccountTypeList = typeof accountTypeList;

type EditAccountBtnProps = {
  accountDataType: keyof AccountTypeList
}

const EditAccountBtn:React.FC<EditAccountBtnProps> = ({ accountDataType }) => {
  const pagePath = accountDataType === 1 ? '/account/edit' : `/account/${accountTypeList[accountDataType]}/edit`;

  return (
    <Link href={pagePath}>
      <button
        className="w-12 h-12 rounded-full bg-eyeCatch text-darkBlue text-sm leading-3 text-center hover:bg-eyeCatchDark"
      >
        Edit
      </button>
    </Link>
  );
}

export default EditAccountBtn;