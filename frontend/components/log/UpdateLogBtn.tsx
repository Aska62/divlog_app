type UpdateLogBtnProps = {
  isDisabled: boolean,
}

const UpdateLogBtn:React.FC<UpdateLogBtnProps> = ({ isDisabled }) => {
  return (
    <button
      disabled={isDisabled}
      className="bg-darkBlue dark:bg-iceBlue hover:bg-darkBlueLight dark:hover:bg-lightBlue text-baseWhite dark:text-baseBlack px-3 rounded-md"
    >Save</button>
  );
}

export default UpdateLogBtn;