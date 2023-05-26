import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState("Sign In");
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign In");
      }
    });
  }, [auth]);

  function pathMatchRoute(route) {
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
                pathMatchRoute("/") && "text-black border-b-red-600"
              }`}
            >
              Home
            </li>
            <li
              onClick={() => {
                navigate("/offers");
              }}
              className={`py-3 text-sm font-bold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
                pathMatchRoute("/offers") && "text-black border-b-red-600"
              }`}
            >
              Offers
            </li>
            <li
              onClick={() => {
                navigate("/profile");
              }}
              className={`py-3 text-sm font-bold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
                pathMatchRoute("/sign-in") ||
                (pathMatchRoute("/profile") && "text-black border-b-red-600")
              }`}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
