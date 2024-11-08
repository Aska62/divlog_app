type RegisterBtnProps = {
  isDisabled: boolean,
}

const RegisterBtn:React.FC<RegisterBtnProps> = ({ isDisabled }) => {
  return (
    <button
      disabled={isDisabled}
      className="bg-darkBlue dark:bg-lightBlue hover:bg-darkBlueLight dark:hover:bg-lightGray text-baseWhite dark:text-darkBlue duration-75 w-64 h-9 rounded-md"
    >Register</button>
  );
}

export default RegisterBtn;