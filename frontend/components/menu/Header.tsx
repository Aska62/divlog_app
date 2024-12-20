'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { toast } from "react-toastify";
import removeSession from '@/actions/removeSession';
import useUser from '@/stores/useUser';
import isNumber from "@/utils/isNumber";
import MenuBox, { MenuContentIds, menuContentIds } from '@/components/menu/MenuBox';
import MobileMenuBox from "@/components/menu/MobileMenuBox";

const menuInfo = [
  {
    id: 'log_book',
    name: 'Log Book',
  },
  {
    id: 'dive_plan',
    name: 'Dive Plan',
  },
  {
    id: 'dive_centers',
    name: 'Dive Centers',
  },
  {
    id: 'buddies',
    name: 'Buddies',
  },
  {
    id: 'account',
    name: 'Accounts',
  }

]

const Header = () => {

  const isMenuContentId = (val: unknown): val is MenuContentIds => {
    if (!val || !isNumber(val)) {
      return false;
    }
    return Object.entries(menuContentIds).some(([, id]) => id === val);
  }

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [visibleMenuBox, setVisibleMenuBox] = useState<MenuContentIds>(0);

  const router = useRouter();

  const isAuth = useUser.getState().isAuth;
  const setIsAuth = useUser((state) => state.setIsAuth);

  const handleMenuClick = (e:React.MouseEvent<Element>) => {
    const id = Number(e.currentTarget.id);
    if (!id) {
      setVisibleMenuBox(0);
    } else if (id === visibleMenuBox) {
      setVisibleMenuBox(0);
    } else if (!isMenuContentId(id)) {
      setVisibleMenuBox(0);
    } else {
      setVisibleMenuBox(id);
    }
  }

  const handleLogout = async () => {
    const res = await removeSession();
    if (res?.success) {
      setIsAuth();
      router.push('/login');
    } else {
      toast.error(res?.error);
    }
  }

  useEffect(() => {
    if(!isAuth) {
      router.replace('/login');
    }
  }, [isAuth, router]);

  return (
    <>
      <header className="bg-baseWhite dark:bg-baseBlack z-10 py-4 w-full h-14 fixed top-0 shadow-dl">
        <div className="w-full flex justify-between align-middle">
          <Link href="/" className="ml-3 hover:text-darkBlueLight">
            <h1 className="font-logo text-xl font-bold">DivLog</h1>
          </Link>

          {/* Hubmerger */}
          <RxHamburgerMenu className="md:hidden mr-4 hover:cursor-pointer w-6 h-6" onClick={() => setMenuOpen(true)}/>

          {/* Desktop menu */}
          <nav className="mr-4 hidden md:flex">
            {menuInfo.map((menu) => (
              <div className="min-w-12 max-w-32 mx-3" key={menu.id}>
                <p
                  id={String(menuContentIds[menu.id])}
                  onClick={(e) => handleMenuClick(e)}
                  className={`w-full px-2 mb-1 rounded-sm hover:cursor-pointer hover:text-darkBlueLight ${visibleMenuBox === menuContentIds[menu.id] && 'bg-lightBlue dark:bg-baseBlackLight'}`}
                >
                  {menu.id === 'account' ? (
                    <CgProfile className="mx-0 h-6" />
                  ) : menu.name}
                </p>
                {visibleMenuBox === menuContentIds[menu.id] && (
                  <MenuBox
                    menuId={menuContentIds[menu.id]}
                    closeMenuBox={setVisibleMenuBox}
                  />
                )}
              </div>
            ))}

            <MdLogout className="mx-3 h-6 hover:text-darkBlueLight hover:cursor-pointer" onClick={handleLogout} />
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 z-10 w-screen h-screen bg-baseWhite70 transition duration-700 ${menuOpen ? 'block opacity-100' : 'hidden opacity-0'}`}>
        <nav className={`shadow-lg w-full sm:w-96 h-full fixed transition duration-700 ease-in-out ${menuOpen ? "right-0" : "left-full"} bg-darkBlue text-lg text-baseWhite`}>
          <RxCross2 className="absolute top-3 right-3 h-7 w-7 hover:cursor-pointer hover:text-baseWhite70" onClick={() => setMenuOpen(false)}/>

          <div className=" w-1/2 mx-auto mt-24 flex flex-col">

            {menuInfo.map((menu) => (
              <div className="w-full my-6" key={menu.id}>
              <div
                id={String(menuContentIds[menu.id])}
                onClick={(e) => handleMenuClick(e)}
                className="flex items-center w-full px-2 mb-1 hover:text-baseWhite70"
              >
                <p className={`mr-2 rounded-sm hover:cursor-pointer ${visibleMenuBox === menuContentIds[menu.id] && 'text-baseWhite70'}`}>
                  {menu.name}
                </p>
                <IoIosArrowDown className={`${visibleMenuBox === menuContentIds[menu.id] && 'rotate-180'} duration-150`} />
              </div>
              {visibleMenuBox === menuContentIds[menu.id] && (
                <MobileMenuBox
                  menuId={menuContentIds[menu.id]}
                  closeMenuBox={setVisibleMenuBox}
                  setMenuOpen={setMenuOpen}
                />
              )}
            </div>
            ))}

            <div className="w-full my-6 text-left">
              <MdLogout
                className="w-12 px-2 mb-1 h-6 hover:text-baseWhite70 hover:cursor-pointer"
                onClick={handleLogout}
              />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Header;