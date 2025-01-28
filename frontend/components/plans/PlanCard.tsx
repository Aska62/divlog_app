import Link from "next/link";
import { DivePlanHighLight } from "@/types/divePlanTypes";
import formatDate from '@/utils/dateTime/formatDate';
import ParticipantIcon, { isBuddy, isInstructor} from "../buddies/InvolvedDiveIcon";

type PlanCardProps = Omit<DivePlanHighLight,
  | 'country' | 'log_no'
> & {
  is_visitor: boolean,
  country_name?: string,
  is_my_buddy_dive? : boolean,
  is_my_instruction?: boolean,
}

const PlanCard:React.FC<PlanCardProps> = ({
  is_visitor,
  id,
  user_id,
  date,
  location,
  country_name,
  is_my_buddy_dive,
  is_my_instruction,
}) => {

  return (
    <Link
      href={ is_visitor ? `/buddy/${user_id}/plans/${id}` : `/plans/${id}`}
      className="relative w-60 h-44 border  border-darkBlue dark:border-lightBlue rounded-md shadow-dl mx-6 my-8 text-center hover:bg-lightBlue dark:hover:bg-baseBlackLight duration-75"
    >

      {/* Participate icons */}
      <div className="absolute top-0 right-0 w-12 flex justify-around ml-auto mr-0 mb-3">
        {is_my_buddy_dive && <ParticipantIcon type={isBuddy} />}
        {is_my_instruction && <ParticipantIcon type={isInstructor} />}
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-2xl">{formatDate(date)}</p>
        <p className="text-lg pt-1 text-wrap text-center">{location}</p>
        <p className="text-base pb-1">{country_name}</p>
      </div>
    </Link>
  );
}

export default PlanCard;