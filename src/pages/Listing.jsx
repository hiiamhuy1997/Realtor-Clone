import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css/bundle";
import { FaShare, FaMapMarkedAlt, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Listing = () => {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkPopUp, setLinkPopUp] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
        console.log(listing);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <h3>Loading....</h3>;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setLinkPopUp(true);
          setTimeout(() => {
            setLinkPopUp(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {linkPopUp && (
        <p className="fixed z-10 top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white p-2">
          Link Copied
        </p>
      )}

      <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 m-4 rounded-lg  shadow-lg bg-white lg:space-x-5">
        <div className=" w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - $
            {listing.offer
              ? listing.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center gap-2 mt-6 mb-3 font-semibold truncate">
            <FaMapMarkedAlt className="text-green-700" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : "Sell"}
            </p>
            <p className="bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.offer && <p>${+listing.regularPrice - +listing.discountPrice} discount</p>}
            </p>
          </div>
          <p className="my-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-4 lg:space-x-10 text-sm font-semibold">
            <li className="flex items-center whitespace-nowrap gap-1">
              <FaBed className="text-lg" />
              {+listing.bedRooms > 1 ? `${listing.bedRooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap gap-1">
              <FaBath className="text-lg" />
              {+listing.bathRooms > 1 ? `${listing.bathRooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap gap-1">
              <FaParking className="text-lg" />
              {+listing.parking ? "Parking spot" : "No Parking"}
            </li>
            <li className="flex items-center whitespace-nowrap gap-1">
              <FaChair className="text-lg" />
              {+listing.furnish ? "Furnished" : "Not furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandlord(true)}
                className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && <Contact userRef={listing.userRef} listing={listing} />}
        </div>
        <div className="w-full h-[200px] md:h-[260px] lg:h-[400px] z-10 overflow-x-hidden mt-6 lg:mt-0 md:ml-2">
          <MapContainer
            center={[listing.geoLocation.lat, listing.geoLocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[listing.geoLocation.lat, listing.geoLocation.lng]}>
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

export default Listing;
