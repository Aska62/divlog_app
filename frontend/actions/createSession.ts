import axios, { isAxiosError }  from "axios";
import {UserInfo} from '@/stores/useUser'

type LoginActionStateType = {
  success?: boolean,
  userInfo?: UserInfo,
  error?: string,
}

type LoginFromType = {
    email?: string,
    password?: string,
  } & LoginActionStateType

async function createSession(_previousState: LoginFromType, formData: FormData):Promise<LoginActionStateType> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      error: "Please fill out all fields."
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
        error: String(error.response.data)
      };
    } else {
      return {
        success: false,
        error: 'Failed to login'
      }
    }
  }
}

export default createSession;