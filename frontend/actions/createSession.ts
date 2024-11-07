import axios, { isAxiosError }  from "axios";

type LoginFromType = {
  success: boolean,
  error?: string
}

async function createSession(previousState:LoginFromType, formData: FormData) {
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

    if (res) {
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      return { success: true };
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        error: error.response.data
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