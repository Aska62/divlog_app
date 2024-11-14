import axios, { isAxiosError }  from "axios";
import { UserInfo } from '@/stores/useUser';

type RegisterActionStateType = {
  success?: boolean,
  userInfo?: UserInfo,
  error?: {
    message: string,
    divlogName?: string | false,
    email?: string | false,
    password?: string | false,
    confirmPassword?: string | false,
  },
}

type RegiserFromType = {
  divLogName?: string,
  email?: string,
  password?: string,
  confirmPassword?: string,
} & RegisterActionStateType

export const emailRegex = /^[a-zA-Z0-9_.±]+@+[a-zA-Z0-9-]+\.+[a-zA-Z0-9-.]{2,}$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{12,}$/;

async function registerUser(_previousState: RegiserFromType, formData: FormData):Promise<RegisterActionStateType> {
  const divLogName = String(formData.get("divlogName"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirmPassword"));

  const divLogNameErr = !divLogName ? 'Please input username' : false;
  const emailErr = !email ? 'Please input email'
    : !email.match(emailRegex) ? 'Not a valid email address'
    : false;
  const passwordErr = !password ? 'Please input password'
    : password.length < 12 ? 'Password must be more than 12 letters'
    : !password.match(passwordRegex) ? 'Password must contain at alphabet and number'
    : false;
  const confirmPasswordErr = !confirmPassword ? 'Please input password'
    : !confirmPassword.match(password) ? 'Passwords do not match'
    : false;

  if (divLogNameErr || emailErr || passwordErr || confirmPasswordErr) {
    return {
      error: {
        message: "Please fill out all fields correctly",
        divlogName: divLogNameErr,
        email: emailErr,
        password: passwordErr,
        confirmPassword: confirmPasswordErr,
      }
    }
  }

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`,
      { divlog_name: divLogName, email, password },
      { withCredentials: true }
    );

    localStorage.setItem('userInfo', JSON.stringify(res.data));
    return {
      success: true,
      userInfo: res.data
    };
  } catch (error) {
    console.log('Error: ', error);

    if (isAxiosError(error) && error.response) {
      return {
        error: { message: error.response.data }
      };
    } else {
      return {
        success: false,
        error: { message: 'Registration failed' }
      }
    }
  }
}

export default registerUser;