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
            <div className="w-24 mx-3">
              <p
                id={String(menuContentIds.log_book)}
                onClick={(e) => handleMenuClick(e)}
                className={`w-full px-2 mb-1 rounded-sm hover:cursor-pointer hover:text-darkBlueLight ${visibleMenuBox === menuContentIds.log_book && 'bg-lightBlue'}`}
              >Log Book</p>
              {visibleMenuBox === menuContentIds.log_book && (
                <MenuBox
                  menuId={menuContentIds.log_book}
                  closeMenuBox={setVisibleMenuBox}
                />
              )}
            </div>

            <div className="w-24 mx-3">
              <p
                id={String(menuContentIds.dive_plan)}
                onClick={(e)=> handleMenuClick(e)}
                className={`w-full px-2 mb-1 rounded-sm hover:cursor-pointer hover:text-darkBlueLight ${visibleMenuBox === menuContentIds.dive_plan && 'bg-lightBlue'}`}
              >Dive Plan</p>
              {visibleMenuBox === menuContentIds.dive_plan && (
                <MenuBox
                  menuId={menuContentIds.dive_plan}
                  closeMenuBox={setVisibleMenuBox}
                />
              )}
            </div>

            <div className="w-32 mx-3">
              <p
                id={String(menuContentIds.dive_centers)}
                onClick={(e)=> handleMenuClick(e)}
                className={`w-full px-2 mb-1 rounded-sm hover:cursor-pointer hover:text-darkBlueLight ${visibleMenuBox === menuContentIds.dive_centers && 'bg-lightBlue'}`}
              >Dive Centers</p>
              {visibleMenuBox === menuContentIds.dive_centers && (
                <MenuBox
                  menuId={menuContentIds.dive_centers}
                  closeMenuBox={setVisibleMenuBox}
                />
              )}
            </div>

            <div className="w-24 mx-3">
              <p
                id={String(menuContentIds.buddies)}
                onClick={(e)=> handleMenuClick(e)}
                className={`w-full px-2 mb-1 rounded-sm hover:cursor-pointer hover:text-darkBlueLight ${visibleMenuBox === menuContentIds.buddies && 'bg-lightBlue'}`}
              >Buddies</p>
              {visibleMenuBox === menuContentIds.buddies && (
                <MenuBox
                  menuId={menuContentIds.buddies}
                  closeMenuBox={setVisibleMenuBox}
                />
              )}
            </div>

            <div className="w-12 mx-3">
              <p
                id={String(menuContentIds.account)}
                onClick={(e)=> handleMenuClick(e)}
                className={`w-full px-2 mb-1 rounded-sm hover:cursor-pointer hover:text-darkBlueLight ${visibleMenuBox === menuContentIds.account && 'bg-lightBlue'}`}
              ><CgProfile className="mx-0 h-6" /></p>
              {visibleMenuBox === menuContentIds.account && (
                <MenuBox
                  menuId={menuContentIds.account}
                  closeMenuBox={setVisibleMenuBox}
                />
              )}
            </div>

            <MdLogout className="mx-3 h-6 hover:text-darkBlueLight hover:cursor-pointer" onClick={handleLogout} />
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 z-10 w-screen h-screen bg-baseWhite70 transition duration-700 ${menuOpen ? 'block opacity-100' : 'hidden opacity-0'}`}>
        <nav className={`shadow-lg w-full sm:w-96 h-full fixed transition duration-700 ease-in-out ${menuOpen ? "right-0" : "left-full"} bg-darkBlue text-lg text-baseWhite`}>
          <RxCross2 className="absolute top-3 right-3 h-7 w-7 hover:cursor-pointer hover:text-baseWhite70" onClick={() => setMenuOpen(false)}/>

          <div className=" w-1/2 mx-auto mt-24 flex flex-col">
            <div className="w-full my-6">
              <div
                id={String(menuContentIds.log_book)}
                onClick={(e) => handleMenuClick(e)}
                className="flex items-center w-full px-2 mb-1 hover:text-baseWhite70"
              >
                <p className={`mr-2 rounded-sm hover:cursor-pointer ${visibleMenuBox === menuContentIds.log_book && 'text-baseWhite70'}`}>
                  Log Book
                </p>
                <IoIosArrowDown className={`${visibleMenuBox === menuContentIds.log_book && 'rotate-180'} duration-150`} />
              </div>
              {visibleMenuBox === menuContentIds.log_book && (
                <MobileMenuBox
                  menuId={menuContentIds.log_book}
                  closeMenuBox={setVisibleMenuBox}
                  setMenuOpen={setMenuOpen}
                />
              )}
            </div>

            <div className="w-full my-6">
              <div
                id={String(menuContentIds.dive_plan)}
                onClick={(e) => handleMenuClick(e)}
                className="flex items-center w-full px-2 mb-1 hover:text-baseWhite70"
              >
                <p className={`mr-2 rounded-sm hover:cursor-pointer ${visibleMenuBox === menuContentIds.dive_plan && 'text-baseWhite70'}`}>
                  Dive Plan
                </p>
                <IoIosArrowDown className={`${visibleMenuBox === menuContentIds.dive_plan && 'rotate-180'} duration-150`} />
              </div>
              {visibleMenuBox === menuContentIds.dive_plan && (
                <MobileMenuBox
                  menuId={menuContentIds.dive_plan}
                  closeMenuBox={setVisibleMenuBox}
                  setMenuOpen={setMenuOpen}
                />
              )}
            </div>

            <div className="w-full my-6">
              <div
                id={String(menuContentIds.dive_centers)}
                onClick={(e) => handleMenuClick(e)}
                className="flex items-center w-full px-2 mb-1 hover:text-baseWhite70"
              >
                <p className={`mr-2 rounded-sm hover:cursor-pointer ${visibleMenuBox === menuContentIds.dive_centers && 'text-baseWhite70'}`}>
                  Dive Centers
                </p>
                <IoIosArrowDown className={`${visibleMenuBox === menuContentIds.dive_centers && 'rotate-180'} duration-150`} />
              </div>
              {visibleMenuBox === menuContentIds.dive_centers && (
                <MobileMenuBox
                  menuId={menuContentIds.dive_centers}
                  closeMenuBox={setVisibleMenuBox}
                  setMenuOpen={setMenuOpen}
                />
              )}
            </div>

            <div className="w-full my-6">
              <div
                id={String(menuContentIds.buddies)}
                onClick={(e) => handleMenuClick(e)}
                className="flex items-center w-full px-2 mb-1 hover:text-baseWhite70"
              >
                <p className={`mr-2 rounded-sm hover:cursor-pointer ${visibleMenuBox === menuContentIds.buddies && 'text-baseWhite70'}`}>
                  Buddies
                </p>
                <IoIosArrowDown className={`${visibleMenuBox === menuContentIds.buddies && 'rotate-180'} duration-150`} />
              </div>
              {visibleMenuBox === menuContentIds.buddies && (
                <MobileMenuBox
                  menuId={menuContentIds.buddies}
                  closeMenuBox={setVisibleMenuBox}
                  setMenuOpen={setMenuOpen}
                />
              )}
            </div>

            <div className="w-full my-6">
              <div
                id={String(menuContentIds.account)}
                onClick={(e) => handleMenuClick(e)}
                className="flex items-center w-full px-2 mb-1 hover:text-baseWhite70"
              >
                <p className={`mr-2 rounded-sm hover:cursor-pointer ${visibleMenuBox === menuContentIds.account && 'text-baseWhite70'}`}>
                  Account
                </p>
                <IoIosArrowDown className={`${visibleMenuBox === menuContentIds.account && 'rotate-180'} duration-150`} />
              </div>
              {visibleMenuBox === menuContentIds.account && (
                <MobileMenuBox
                  menuId={menuContentIds.account}
                  closeMenuBox={setVisibleMenuBox}
                  setMenuOpen={setMenuOpen}
                />
              )}
            </div>

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