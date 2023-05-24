import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);

  function pathMathRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-1000">
      <header className="flex items-center justify-between px-3 max-w-6xl mx-auto">
        <div className="">
          <img
            onClick={() => {
              navigate("/");
            }}
            className="h-5 cursor-pointer"
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="Logo"
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              onClick={() => {
                navigate("/");
              }}
              className={`py-3 text-sm font-bold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
                pathMathRoute("/") && "text-black border-b-red-500"
              }`}
            >
              Home
            </li>
            <li
              onClick={() => {
                navigate("/offers");
              }}
              className={`py-3 text-sm font-bold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
                pathMathRoute("/offers") && "text-black border-b-red-500"
              }`}
            >
              Offers
            </li>
            <li
              onClick={() => {
                navigate("/sign-in");
              }}
              className={`py-3 text-sm font-bold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
                pathMathRoute("/sign-in") && "text-black border-b-red-500"
              }`}
            >
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
