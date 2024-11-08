import LogoLg from "@/components/LogoLg";
import Link from "next/link";
import RegisterBtn from "@/components/RegisterBtn";

const RegisterPage = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <LogoLg />

      <form action="#" className="w-64 text-center mt-10">
        <h2>Register</h2>
        <div className="h-14 mb-10 text-start">
          <input
            type="email"
            name="email"
            placeholder="email"
            required
            className="w-full h-9 px-2 rounded-md bg-lightBlue dark:bg-baseWhite text-black focus:outline-none"
          />
          <p className="text-eyeCatchDark dark:text-eyeCatch text-sm">Please provide a valid email address</p>
        </div>
        <div className="h-14 mb-10 text-left">
          <input
            type="password"
            name="password"
            placeholder="password"
            required
            className="w-full h-9 px-2 rounded-md bg-lightBlue dark:bg-baseWhite text-black focus:outline-none"
          />
          {/* <p className="text-eyeCatchDark dark:text-eyeCatch text-sm">Please input password</p> */}
        </div>
        <div className="h-14 mb-10 text-left">
          <input
            type="confirmPassword"
            name="confirmPassword"
            placeholder="confirm password"
            required
            className="w-full h-9 px-2 rounded-md bg-lightBlue dark:bg-baseWhite text-black focus:outline-none"
          />
          {/* <p className="text-eyeCatchDark dark:text-eyeCatch text-sm">Passwords do not match</p> */}
        </div>
        <RegisterBtn />
      </form>

      <div className="text-center my-14">
        <p className="text-sm">Have an account?</p>
        <Link href={'/login'}>
          <p className="border border-darkBlue dark:border-lightBlue hover:bg-lightBlue dark:hover:bg-lightGray dark:hover:text-darkBlue duration-75 w-64 h-9 rounded-md text-center leading-8" >Login</p>
        </Link>
      </div>

    </main>
  );
}

export default RegisterPage;