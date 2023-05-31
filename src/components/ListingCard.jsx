import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaTrash, FaEdit } from "react-icons/fa";

const ListingCard = ({ listing, id, onEdit, onDelete }) => {
  return (
    <li
      className="relative bg-white flex flex-col justify-between items-center
     shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 mb-6"
    >
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in-out"
          loading="lazy"
          src={listing.imgUrls[0]}
          alt="house"
        />
        <Moment
          className="absolute top-2 left-2 bg-[#3377cc] text-white font-semibold uppercase text-xs rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {listing.timeStamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold m-0 text-xl">{listing.name}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10xp] space-x-2">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-sm">
                {listing.bedRooms > 1 ? `${listing.bedRooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-sm">
                {listing.bathRooms > 1 ? `${listing.bathRooms} Baths` : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-600"
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <FaEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer text-black-600"
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
};

export default ListingCard;
