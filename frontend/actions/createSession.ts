import axios, { isAxiosError }  from "axios";
import { UserInfo } from '@/stores/useUser';
import { emailRegex, passwordRegex } from "./registerUser";

type LoginActionStateType = {
  success?: boolean,
  userInfo?: UserInfo,
  error?: {
    message: string,
    email?: string | false,
    password?: string | false,
  },
}

export type LoginFromType = {
  email?: string,
  password?: string,
}

type CreateSessionPrevState = LoginFromType & LoginActionStateType

async function createSession(_previousState: CreateSessionPrevState, formData: FormData):Promise<LoginActionStateType> {
  const email = formData.get("email");
  const password = formData.get("password");

  const emailErr = !email ? 'Please input email'
    : !String(email).match(emailRegex) ? 'Not a valid email address'
    : false;
  const passwordErr = !password ? 'Please input password'
    : String(password).length < 12 ? 'Password should be more than 12 letters'
    : !String(password).match(passwordRegex) ? 'Password should contain at least 1 uppercase and lowercase alphabet, and number each'
    : false;


  if (emailErr || passwordErr) {
    return {
      error: {
        message: "Please fill out all fields correctly",
        email: emailErr,
        password: passwordErr,
      }
    }
  }

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
      { email, password },
      { withCredentials: true }
    );

    localStorage.setItem('userInfo', JSON.stringify(res.data));
    return {
      success: true,
      userInfo: res.data
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        error: { message: error.response.data }
      };
    } else {
      return {
        success: false,
        error: { message: 'Failed to login' }
      }
    }
  }
}

export default createSession;