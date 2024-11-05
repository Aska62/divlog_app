import Link from "next/link";
import LogoLg from "@/components/LogoLg";
import PasswordResetEmailBtn from "@/components/PasswordResetEmailBtn";

const ForgotPassword = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <LogoLg />

      <form action="#" className="w-64 text-center mt-20">
        <h2>Password restoration</h2>
        <div className="h-14 my-6 text-start">
          <input
            type="email"
            name="email"
            placeholder="email"
            className="w-full h-9 px-2 rounded-md bg-lightBlue dark:bg-baseWhite text-black focus:outline-none"
          />
          <p className="text-eyeCatchDark dark:text-eyeCatch text-sm">Please provide a valid email address</p>
        </div>

        <PasswordResetEmailBtn />
      </form>

      <div className="text-center my-32 w-64 flex justify-around">
        <Link href={'/login'}>
          <p className="w-28 border border-darkBlue dark:border-lightBlue hover:bg-lightBlue dark:hover:bg-lightGray dark:hover:text-darkBlue duration-75 h-9 rounded-md text-center leading-8" >Login</p>
        </Link>
        <Link href={'/register'}>
          <p className="w-28 border border-darkBlue dark:border-lightBlue hover:bg-lightBlue dark:hover:bg-lightGray dark:hover:text-darkBlue duration-75 h-9 rounded-md text-center leading-8" >Register</p>
        </Link>
      </div>

    </main>
  );
}

export default ForgotPassword;