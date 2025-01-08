import Link from "next/link";
import { DiveRecordHighlight } from '@/types/diveRecordTypes';
import formatDate from '@/utils/dateTime/formatDate';

type LogCardProps = Omit<DiveRecordHighlight,
  | 'country'
> & {
  is_visitor: boolean,
  country_name?: string,
  is_draft?: boolean,
  is_my_buddy_dive? : boolean,
  is_my_instruction?: boolean,
}

const LogCard:React.FC<LogCardProps> = ({
  is_visitor,
  id,
  log_no,
  user_id,
  date,
  location,
  is_draft,
  country_name,
  is_my_buddy_dive,
  is_my_instruction,
}) => {

  return (
    <Link
      href={ is_visitor ? `/buddy/${user_id}/logBook/${id}` : `/logBook/${id}`}
      className="relative w-60 h-44 border  border-darkBlue dark:border-lightBlue rounded-md shadow-dl mx-6 my-8 text-center hover:bg-lightBlue dark:hover:bg-baseBlackLight duration-75"
    >
      {is_draft && (
        <p className="absolute top-1 right-1 bg-lightBlue text-sm px-2 rounded-md text-darkBlue">Draft</p>
      )}
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-sm">No. {log_no}</p>
        <p className="text-2xl pt-1 text-wrap text-center">{location}</p>
        <p className="text-lg pb-1">{country_name}</p>
        <p className="text-base">{formatDate(date)}</p>
      </div>
    </Link>
  );
}

export default LogCard;