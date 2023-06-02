import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { collection, getDocs, limit, query, startAfter, where } from "firebase/firestore";
import { db } from "../firebase";
import ListingCard from "../components/ListingCard";
import { useParams } from "react-router-dom";
const Category = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListings] = useState(null);
  const params = useParams();

  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        startAfter(lastFetchListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListings(lastVisible);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prev) => [...prev, ...listings]);
      console.log(listings);
      setLoading(false);
    } catch (error) {
      // toast.error("Could not fetch listings");
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("type", "==", params.categoryName), limit(8));
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListings(lastVisible);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        console.log(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
        console.log(error);
      }
    }
    fetchListings();
  }, [params.categoryName]);

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-center text-3xl mt-6 font-bold">
        {params.categoryName === "rent" ? "Places for rent" : "Places for sell"}
      </h1>
      {loading ? (
        <h3>Loading...</h3>
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-3 gap-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </main>
          {lastFetchListing && (
            <div className="flex justify-center items-center">
              <button
                onClick={onFetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 hover:border-slate-600 transition duration-150 ease-in-out rounded"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p>
          There are no current{" "}
          {params.categoryName === "rent" ? "places for rent" : "places for sell"}
        </p>
      )}
    </div>
  );
};

export default Category;
