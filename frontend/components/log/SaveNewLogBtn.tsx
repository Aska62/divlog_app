type SaveNewLogBtnProps = {
  isDisabled: boolean,
}

const SaveNewLogBtn:React.FC<SaveNewLogBtnProps> = ({ isDisabled }) => {
  return (
    <button
      disabled={isDisabled}
      className={`px-3 rounded-md
        ${ isDisabled ? 'bg-slate-300 dark:bg-slate-500 text-baseWhite'
          : 'bg-darkBlue dark:bg-iceBlue hover:bg-darkBlueLight dark:hover:bg-lightBlue text-baseWhite dark:text-baseBlack'
        }`}
    >Save</button>
  );
}

export default SaveNewLogBtn;