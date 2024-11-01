'use client';
import { useState } from "react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      <header className="bg-baseWhite py-4 w-full fixed top-0 shadow-dl">
        <div className="w-full flex justify-between align-middle">
          <Link href="/" className="ml-3 hover:text-darkBlueLight">
            <h1 className="font-logo text-xl font-bold">DivLog</h1>
          </Link>

          {/* Hubmerger */}
          <RxHamburgerMenu className="md:hidden mr-4 hover:cursor-pointer w-6 h-6" onClick={() => setMenuOpen(true)}/>

          {/* Desktop menu */}
          <nav className="mr-4 hidden md:flex">
            <Link href="#" className="mx-3 hover:text-darkBlueLight">Dive Plan</Link>
            <Link href="/logBook" className="mx-3 hover:text-darkBlueLight">Log Book</Link>
            <Link href="#" className="mx-3 hover:text-darkBlueLight">Dive Centers</Link>
            <Link href="#" className="mx-3 hover:text-darkBlueLight">Buddies</Link>
            <Link href="#" className="mx-3 h-6 hover:text-darkBlueLight"><CgProfile className="mx-0 h-6" /></Link>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 z-10 w-screen h-screen bg-baseWhite70 transition duration-700 ${menuOpen ? 'block opacity-100' : 'hidden opacity-0'}`}>
        <nav className={`shadow-lg w-full sm:w-96 h-full fixed transition duration-700 ease-in-out ${menuOpen ? "right-0" : "left-full"} flex flex-col bg-darkBlue text-lg text-baseWhite`}>
          <RxCross2 className="absolute top-3 right-3 h-7 w-7 hover:cursor-pointer hover:text-baseWhite70" onClick={() => setMenuOpen(false)}/>
          <Link href="#" className="mx-auto mt-56 mb-6 hover:text-baseWhite70">Dive Plan</Link>
          <Link href="/logBook" className="mx-auto my-6 hover:text-baseWhite70">Log Book</Link>
          <Link href="#" className="mx-auto my-6 hover:text-baseWhite70">Dive Centers</Link>
          <Link href="#" className="mx-auto my-6 hover:text-baseWhite70">Buddies</Link>
          <Link href="#" className="mx-auto my-6 hover:text-baseWhite70">My Page</Link>
        </nav>
      </div>
    </>
  );
}

export default Header;