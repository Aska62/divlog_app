import { useRef } from "react";
import Link from "next/link";
import { useClickOutside } from "@/hooks/useClickOutside";

export type MenuContentIds = 0 | 1 | 2 | 3 | 4 | 5;
export const menuContentIds: Record<string, Exclude<MenuContentIds, 0>> = {
  'log_book': 1,
  'dive_plan': 2,
  'dive_centers': 3,
  'buddies': 4,
  'account': 5,
}

type MenuBoxContents = Record<
  Exclude<MenuContentIds, 0>, Record<
  number, Record<'title' | 'url', string>
>>

export const menuBoxContents:MenuBoxContents = {
  1: {
    1: {
      title: 'List',
      url: '/logBook',
    },
    2: {
      title: 'Add new record',
      url: '/logBook/add'
    }
  },
  2: {
    1: {
      title: 'List',
      url: '/plans',
    },
    2: {
      title: 'Add new plan',
      url: '/plans/add'
    }
  },
  3: {
    1: {
      title: 'Find',
      url: '/diveCenter',
    },
  },
  4: {
    1: {
      title: 'Find',
      url: '/buddy',
    },
  },
  5: {
    1: {
      title: 'Profile',
      url: '/account',
    },
    2: {
      title: 'Diver info',
      url: '/account/diverInfo'
    }
  },
}

export type MenuBoxProps = {
  menuId: MenuContentIds,
  closeMenuBox: React.Dispatch<React.SetStateAction<MenuContentIds>>
}

const MenuBox:React.FC<MenuBoxProps> = ({menuId, closeMenuBox}) => {
  const ref = useRef<HTMLDivElement>(null);
  const onClickOutside = () => closeMenuBox(0);
  useClickOutside(ref, onClickOutside);

  if (menuId !== 0) {
    return (
      <div
        ref={ref}
        className="w-max bg-baseWhite dark:bg-baseBlack shadow-dl rounded-sm p-3 text-sm flex flex-col"
      >
        {Object.entries(menuBoxContents[menuId]).map(([id, content]) => (
          <Link
            href={content.url}
            onClick={() => closeMenuBox(0)}
            key={id}
            className="my-2 min-w-20 hover:text-darkBlueLight"
          >
            {content.title}
          </Link>
        ))}
      </div>
    );
  }
}

export default MenuBox;