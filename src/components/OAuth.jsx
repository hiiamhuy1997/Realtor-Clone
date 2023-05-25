import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //check if user is already registered
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Failed");
      console.log(error.message);
    }
  }

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className=" flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-red-800 hover:shadow-lg active:bg-red-900 transition duration-150 ease-in-out"
    >
      <FcGoogle className="mr-2 text-2xl bg-white rounded-full" />
      Continue with Google account
    </button>
  );
};

export default OAuth;
