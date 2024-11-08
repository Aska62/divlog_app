type LoginBtnProps = {
  isDisabled: boolean,
}

const LoginBtn:React.FC<LoginBtnProps> = ({ isDisabled }) => {
  return (
    <button
      disabled={isDisabled}
      className="bg-darkBlue dark:bg-lightBlue hover:bg-darkBlueLight dark:hover:bg-lightGray text-baseWhite dark:text-darkBlue duration-75 w-64 h-9 rounded-md"
    >Login</button>
  );
}

export default LoginBtn;