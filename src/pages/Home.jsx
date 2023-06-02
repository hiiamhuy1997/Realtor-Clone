import React from "react";
import Slider from "../components/Slider";
import { useState } from "react";
import { useEffect } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const Home = () => {
  //Offers
  const [offerListings, setOfferListings] = useState(null);

  useEffect(() => {
    async function fetchOfferListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("offer", "==", true), limit(4));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, []);
  //Rents
  const [rentListings, setRentListings] = useState(null);

  useEffect(() => {
    async function fetchRentListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("type", "==", "rent"), limit(4));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRentListings();
  }, []);
  //Sell
  const [sellListings, setSellListings] = useState(null);

  useEffect(() => {
    async function fetchSellListings() {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("type", "==", "sell"), limit(4));
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSellListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSellListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
            <Link to="/offer">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {offerListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places for rent</h2>
            <Link to="/catetory/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </div>
        )}
        {sellListings && sellListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places for sell</h2>
            <Link to="/catetory/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out">
                Show more places for sell
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sellListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
