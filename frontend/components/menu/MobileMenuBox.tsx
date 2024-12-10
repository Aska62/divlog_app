import { useRef } from "react";
import Link from "next/link";
import { useClickOutside } from "@/hooks/useClickOutside";
import { menuBoxContents, MenuBoxProps } from "./MenuBox";

type MobileMenuBoxProps = MenuBoxProps & {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileMenuBox:React.FC<MobileMenuBoxProps> = ({ menuId, closeMenuBox, setMenuOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onClickOutside = () => closeMenuBox(0);
  useClickOutside(ref, onClickOutside);

  if (menuId !== 0) {
    return (
      <div
        ref={ref}
        className="w-max rounded-sm p-3 text-sm flex flex-col"
      >
        {Object.entries(menuBoxContents[menuId]).map(([id, content]) => (
          <Link
            href={content.url}
            onClick={() => {closeMenuBox(0); setMenuOpen(false);}}
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

export default MobileMenuBox;