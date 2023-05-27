import Reafalsect, { useState } from "react";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedRooms: 1,
    bathRooms: 1,
    parking: false,
    furnish: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountPrice: 0,
    latitued: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedRooms,
    bathRooms,
    parking,
    furnish,
    address,
    description,
    offer,
    regularPrice,
    discountPrice,
    latitued,
    longitude,
    images,
  } = formData;

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    //Files
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }
    //Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (discountPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discount price must be lower than regular price");
      return;
    }
    if (images.length > 6) {
      toast.error("Maximum 6 images are allowed");
      return;
    }
    let geoLocation = {};
    let location;
    if (geoLocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;
      if (location === undefined) {
        setLoading(false);
        toast.error("Error");
        return;
      }
    } else {
      geoLocation.lat = latitued;
      geoLocation.lng = longitude;
    }

    async function storeImage(img) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${images.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all([...images].map((img) => storeImage(img))).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
    const formDataCopy = { ...formData, imgUrls, geoLocation, timeStamp: serverTimestamp() };
    delete formDataCopy.images;
    delete formDataCopy.latitued;
    delete formDataCopy.longitude;
    !formDataCopy.offer && delete formDataCopy.discountPrice;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listings created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <h3>Loading....</h3>;
  }
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-center text-3xl mt-6 font-bold">Create a Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="label-text">Sell/Rent</p>
        <div className="flex gap-2">
          <button
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-150 ease-in-out w-full ${
              type === "rent" ? "bg-white" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="type"
            value="sell"
            onClick={onChange}
          >
            Sell
          </button>
          <button
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-150 ease-in-out w-full ${
              type === "sell" ? "bg-white" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
          >
            Rent
          </button>
        </div>
        <p className="label-text">Name</p>
        <input
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-150 focus:border-slate-600"
          type="text"
          placeholder="Name"
          maxLength="32"
          minLength="10"
          value={name}
          id="name"
          onChange={onChange}
          required
        />
        <div className="flex items-center justify-start gap-3">
          <div className="">
            <p className="label-text">Bed Rooms</p>
            <input
              className="px-4 py-2 text-xl rounded text-gray-700 border border-gray-700 transition duration-150 ease-in-out focus:border-slate-700"
              type="number"
              id="bedrooms"
              value={bedRooms}
              onChange={onChange}
              min="1"
              max="15"
              required
            />
          </div>
          <div className="">
            <p className="label-text">Bath Rooms</p>
            <input
              className="px-4 py-2 text-xl rounded text-gray-700 border border-gray-700 transition duration-150 ease-in-out focus:border-slate-700"
              type="number"
              id="bedrooms"
              value={bathRooms}
              onChange={onChange}
              min="1"
              max="15"
              required
            />
          </div>
        </div>
        <p className="label-text">Parking Spot</p>
        <div className="flex gap-2">
          <button
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-150 ease-in-out w-full ${
              parking ? "bg-white" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <p className="label-text">Furnish</p>
        <div className="flex gap-2">
          <button
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-150 ease-in-out w-full ${
              !furnish ? "bg-white" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="furnish"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-150 ease-in-out w-full ${
              furnish ? "bg-white" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="furnish"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <p className="label-text">Address</p>
        <input
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-150 focus:border-slate-600"
          type="text"
          placeholder="Address"
          minLength="10"
          value={address}
          id="address"
          onChange={onChange}
          required
        />
        {!geoLocationEnabled && (
          <div className="flex gap-4 justify-start">
            <div>
              <p className="label-text">Latitude</p>
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transitio duration-150 ease-in-out focus:border-slate-600 text-center focus:text-gray-700"
                type="number"
                id="latitude"
                value={latitued}
                onChange={onChange}
                min="-90"
                required
              />
            </div>
            <div>
              <p className="label-text">Longitude</p>
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transitio duration-150 ease-in-out focus:border-slate-600 text-center focus:text-gray-700"
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                min="-90"
                required
              />
            </div>
          </div>
        )}
        <p className="label-text">Description</p>
        <input
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-150 focus:border-slate-600"
          type="text"
          placeholder="Description"
          minLength="10"
          value={description}
          id="description"
          onChange={onChange}
          required
        />
        <p className="label-text">Offer</p>
        <div className="flex gap-2">
          <button
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-xl transition duration-150 ease-in-out w-full ${
              offer ? "bg-white" : "bg-slate-600 text-white"
            }`}
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <div className="">
          <div>
            <p className="label-text">Regular Price</p>
          </div>
          <div className="w-full flex justify-center items-center gap-4">
            <input
              className="w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transitio duration-150 ease-in-out focus:border-slate-600 text-center focus:text-gray-700"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onChange}
              min="0"
              max="99999999"
              required
            />
            {type === "rent" && (
              <div className="">
                <p className="text-md w-full whitespace-nowrap">$/ Month</p>
              </div>
            )}
          </div>
        </div>
        {offer && (
          <div className="">
            <div>
              <p className="label-text">Discounted Price</p>
            </div>
            <div className="w-full flex justify-center items-center gap-4">
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 rounded transitio duration-150 ease-in-out focus:border-slate-600 text-center focus:text-gray-700"
                type="number"
                id="discountPrice"
                value={discountPrice}
                onChange={onChange}
                min="0"
                max="99999999"
                required
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$/ Month</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div>
          <p className="label-text">Images</p>
          <p className="text-sm text-gray-400">The first image will be the cover (max:6)</p>
          <input
            className="bg-white py-1.5 px-3 text-gray-700 border border-gray-300 rounded transition duration-150 ease-in-out  focus:border-slate-600 w-full"
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
        </div>
        <button
          type="submit"
          className="my-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md shadow-gray-400 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-800 active:bg-blue-900 transition duration-150 ease-in-out focus:shadow-xl"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
