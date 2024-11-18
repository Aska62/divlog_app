'use client';
import { useActionState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import createSession from '@/actions/createSession';
import useUser, { isUserInfo } from '@/stores/useUser';
import LogoLg from "@/components/LogoLg";
import LoginBtn from "@/components/LoginBtn";

const LoginPage = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createSession, {});

  const setIsAuth = useUser((state) => state.setIsAuth);
  const isAuth = useUser.getState().isAuth;

  useEffect(() => {
    if (isAuth) {
      router.push('/');
    }

    if (state && state.userInfo && isUserInfo(state.userInfo)) {
      setIsAuth();

      router.push('/');
    }

    if (state?.error) {
      toast.error(state.error.message);
    }
  }, [router, state, isAuth, setIsAuth,]);

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <LogoLg />

      <form action={formAction} className="w-64 text-center mt-12">
        <h2>Login</h2>
        <div className="h-14 mt-2 mb-4 text-start">
          <input
            type="email"
            name="email"
            placeholder="email"
            required
            className="w-full h-9 px-2 rounded-md bg-lightBlue dark:bg-baseWhite text-black focus:outline-none"
          />
          {state.error?.email && (
            <p className="text-eyeCatchDark dark:text-eyeCatch text-sm">{ state.error.email }</p>
          )}
        </div>
        <div className="h-14 mb-10 text-left">
          <input
            type="password"
            name="password"
            placeholder="password"
            required
            className="w-full h-9 px-2 rounded-md bg-lightBlue dark:bg-baseWhite text-black focus:outline-none"
          />
          {state.error?.password && (
            <p className="text-eyeCatchDark dark:text-eyeCatch text-sm">{ state.error.password }</p>
          )}
        </div>
        <LoginBtn isDisabled={isPending} />
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