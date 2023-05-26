import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);

  const onChangeDetails = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //Update in Firebase authentication
        await updateProfile(auth.currentUser, { displayName: name });
        //Update in Firebase database
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name: name });
      }
      toast.success("Profile Updated");
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleSignout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-center text-3xl mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              className={`w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetails && "bg-red-200 focus:bg-red-200}"
              }`}
              disabled={!changeDetails}
              onChange={onChangeDetails}
              type="text"
              id="name"
              value={name}
            />
            <input
              className="w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
              disabled={!changeDetails}
              onChange={onChangeDetails}
              type="email"
              id="email"
              value={email}
            />
            <div className="flex items-center justify-between whitespace-nowrap text-sm sm:text-lg">
              <p>
                Do you want to change your name ?{" "}
                <span
                  onClick={() => {
                    changeDetails && onSubmit();
                    setChangeDetails((prev) => !prev);
                  }}
                  className="text-red-600 cursor-pointer hover:underline hover:text-red-800 transition ease-in-out duration-200"
                >
                  {changeDetails ? "Apply changes" : "Edit"}
                </span>
              </p>
              <p
                onClick={handleSignout}
                className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition ease-in-out duration-200"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            className="w-full bg-blue-600 text-white uppercase my-4 px-7 py-3 text-sm font-medium rounded shadow-md shadow-gray-400 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 transition duration-150 ease-in-out"
            type="submit"
          >
            <Link className="flex justify-center items-center gap-3" to="/create-listing">
              <FcHome className="bg-red-300 text-3xl rounded-full p-1" />
              Sell or Rent your home
            </Link>
          </button>
        </div>
      </section>
    </>
  );
};

export default Profile;
