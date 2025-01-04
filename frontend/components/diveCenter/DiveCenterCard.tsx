import Link from "next/link";
import { DiveCenterHighLight } from "@/types/diveCenterTypes";
import { RiUserFollowFill } from "react-icons/ri";

type DiveCenterCardProps = {
  diveCenter: DiveCenterHighLight,
  mx?: number,
  my?: number,
}

const DiveCenterCard = ({diveCenter, mx, my}: DiveCenterCardProps) => {
  return (
    <Link
      href={`/diveCenter/${diveCenter.id}`}
      className={`${mx && `mx-${mx}`} ${my && `my-${my}`} flex items-center relative w-80 h-32 border border-darkBlue dark:border-lightBlue rounded-md shadow-dl hover:bg-lightBlue dark:hover:bg-baseBlackLight duration-75`}
    >
      <div className="flex absolute top-1 right-2">
        {diveCenter.is_following && <RiUserFollowFill />}
      </div>
      <div className="w-16 h-16 rounded-md bg-lightBlue mx-3"></div>
      <div>
        <p className="font-bold text-lg">{diveCenter.name}</p>
        <p className="text-sm">{diveCenter.country}</p>
        <p className="text-sm">{diveCenter.organization}</p>
      </div>
    </Link>
  );
}

export default DiveCenterCard;