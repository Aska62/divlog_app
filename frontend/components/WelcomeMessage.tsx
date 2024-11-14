'use client';
import { useState } from "react";
import axios from "axios";

const WelcomeMessage = () => {
  const [logCount, setLogCount] = useState(0);

  axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/count`, { withCredentials: true })
  .then((res) => {
    setLogCount(res.data.total);
  })
  .catch((err) => {
    console.log(err);
    setLogCount(0);
  });


  return (
    <div className="w-64 mx-auto my-24 md:mt-36 lg:mt-48 text-center hover:cursor-pointer hover:text-darkBlueLight duration-150">
        <p>The last dive was on</p>
        <p className="text-4xl py-2">28 Sep 2024</p>
        <p className="text-l">At Green Lagoon, Phillippines</p>
        { logCount > 0 && (
          <p className="py-4">Total logged dive: <span className="text-xl">{logCount}</span></p>
        )}
    </div>
  );
}


export default WelcomeMessage;