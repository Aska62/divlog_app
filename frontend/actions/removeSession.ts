import axios  from "axios";

async function removeSession() {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, '', { withCredentials: true });

    if (res) {
      localStorage.removeItem('userInfo');
      return {
        success: true,
        res
      }
    }
  } catch (error) {
    console.log('Error:', error);
    return {
      error: 'Failed to logout'
    }
  }
}

export default removeSession;