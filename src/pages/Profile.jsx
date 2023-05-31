import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import ListingCard from "../components/ListingCard";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid));

      //create a list to store processed data
      const listings = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
      });
      console.log(listings);
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete ?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter((listing) => listing.id !== listingID);
      setListings(updatedListings);
      toast.success("Deleted");
    }
  }
  const onEdit = (listingID) => {
    navigate(`/edit-listings/${listingID}`);
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
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">My Listings</h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-6 gap-3">
              {listings.map((listing) => (
                <ListingCard
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
