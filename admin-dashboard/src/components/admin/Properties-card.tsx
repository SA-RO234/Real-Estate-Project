import Link from "next/link";
import { Property } from "@/app/lib/types";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
export default function PropertyCard({
  property,
  onDelete,
}: {
  property: Property;
  onDelete?: (propertyID: number) => void;
}) {
  // ...existing code...
  function handleDeleteClick() {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this property?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const res = await fetch(
                "https://real-estate-clientside2.onrender.com",
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ propertyID: property.propertyID }),
                }
              );
              if (res.ok) {
                const data = await res.json();
                alert(data.message);
                if (onDelete) onDelete(property.propertyID); // Remove from UI
              } else {
                alert("Failed to delete property.");
              }
            } catch (error) {
              alert("An error occurred while deleting.");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  }
  return (
    <div className="border p-2  rounded-2xl  cursor-pointer overflow-hidden shadow-lg bg-white">
      <div className="relative h-48">
        {property.image_url && property.image_url.length > 0 ? (
          <img
            src={property.image_url}
            alt=""
            className="w-full rounded-xl h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-2">
          {property.city}, {property.country}
        </p>
        <p className="text-indigo-600 font-bold text-2xl mb-2">
          ${property.price.toLocaleString()}
        </p>
        <div className="flex text-sm text-gray-600 mb-4">
          <p className="mr-4">
            {property.bedrooms}
            beds
          </p>
          <p className="mr-4">
            {property.bathrooms}
            baths
          </p>
          <p>
            {property.square_feet}
            sq ft
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <Link
            href={`/property/viewDetail/${property.propertyID}`}
            className="bg-indigo-700 p-[5px_20px] font-bold rounded-md text-white"
          >
            View Details
          </Link>
          <div className="flex gap-5 items-center">
            <button
              className="bg-red-700 p-[5px_20px] cursor-pointer font-bold rounded-md text-white"
              type="button"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
            <Link
              href={`/property/edit/${property.propertyID}`}
              className="text-white bg-green-700 p-[5px_20px] font-bold rounded-md"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
