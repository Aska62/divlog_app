import Link from "next/link";
import { UserHighlight } from '@/actions/user/findUsers';

type BuddyCardProps = {
  user: UserHighlight,
  mx?: number,
  my?: number,
}

const BuddyCard = ({user, mx, my}: BuddyCardProps) => {

  return (
    <Link
      href={`/buddy/${user.id}`}
      className={`${mx && `mx-${mx}`} ${my && `my-${my}`} flex items-center relative w-80 h-32 border border-darkBlue dark:border-lightBlue rounded-md shadow-dl hover:bg-lightBlue dark:hover:bg-baseBlackLight duration-75`}
    >
      <div className="w-16 h-16 rounded-full bg-lightBlue mx-3"></div>
      <div>
        <p className="font-bold text-lg">{user.license_name}</p>
        <p>@{user.divlog_name}</p>
      </div>
    </Link>
  );
}

export default BuddyCard;