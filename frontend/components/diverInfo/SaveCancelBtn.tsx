import { DiverInfoInputFields } from '@/types/diverInfoTypes';

type SaveCancelBtnProps = {
  field: DiverInfoInputFields
  editing: DiverInfoInputFields | '',
  isPending: boolean,
  onCancelClick: (e:React.MouseEvent) => void,
  handleEditStatus: (e:React.MouseEvent, type?:DiverInfoInputFields) => void
}

const SaveCancelBtn:React.FC<SaveCancelBtnProps> = ({field, editing, isPending, onCancelClick, handleEditStatus}) => {
  return (
    <div className='mt-1 md:mt-0 md:ml-2 text-right flex md:flex-col'>
      { editing === field ? (
        <>
          <button
            onClick={(e) => onCancelClick(e)}
            disabled={isPending}
            className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 md:mr-0 md:mb-2 rounded-md'
          >Cancel</button>
          <button
            disabled={isPending}
            className='bg-darkBlue dark:bg-iceBlue hover:bg-darkBlueLight text-baseWhite dark:text-darkBlue dark:hover:text-darkBlueLight px-2 rounded-md'
          >Save</button>
        </>
      ) : (
        <button
          disabled={editing.length > 0 || isPending}
          onClick={(e) => handleEditStatus(e, field)}
          className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
        >Edit</button>
      )}
    </div>
  );
}

export default SaveCancelBtn;