import React from "react";
import { FcGoogle } from "react-icons/fc";
const OAuth = () => {
  return (
    <button className=" flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-red-800 hover:shadow-lg active:bg-red-900 transition duration-150 ease-in-out">
      <FcGoogle className="mr-2 text-2xl bg-white rounded-full" />
      Continue with Google account
    </button>
  );
};

export default OAuth;
