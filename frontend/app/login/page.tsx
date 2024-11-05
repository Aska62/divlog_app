import LoginBtn from "@/components/LoginBtn";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-20">
        <h1 className="font-logo text-darkBlue dark:text-lightBlue text-7xl">
          DivLog
        </h1>
        <p className="font-logo text-sm">PLAN, LOG, CONNECT</p>
      </div>

      <form action="#" className="w-64 text-center">
        <h2>Login</h2>
        <div className="h-14 my-2 text-start">
          <input
            type="email"
            name="email"
            placeholder="email"
            className="w-full h-9 px-2 rounded-md bg-lightBlue dark:bg-baseWhite text-black focus:outline-none"
          />
          <p className="text-eyeCatchDark dark:text-eyeCatch text-sm">Please provide a valid email address</p>
        </div>
        <div className="h-14 my-2 text-left">
          <input
            type="password"
            name="password"
            placeholder="password"
            className="w-full h-9 px-2 rounded-md bg-lightBlue dark:bg-baseWhite text-black focus:outline-none"
          />
          {/* <p className="text-eyeCatchDark dark:text-eyeCatch text-sm">Please input password</p> */}
        </div>
        <LoginBtn />
      </form>

      <Link href={'/forgotPassword'} className="mt-4 text-sm underline underline-offset-3 hover:text-eyeCatchDark dark:hover:text-eyeCatch" >Frogot password</Link>

      <div className="text-center my-14">
        <p className="text-sm">Do not have an account?</p>
        <Link href={'/register'}>
          <p className="border border-darkBlue dark:border-lightBlue hover:bg-lightBlue dark:hover:bg-lightGray dark:hover:text-darkBlue duration-75 w-64 h-9 rounded-md text-center leading-8" >Register</p>
        </Link>
      </div>

    </main>
  );
}

export default LoginPage;