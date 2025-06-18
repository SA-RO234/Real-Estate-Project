"use client";
import LocationTable from "@/components/admin/propertyCityTable";
import React, { useEffect, useState } from "react";
import axios from "axios";
interface location {
  id: number;
  city: string;
  country: string;
  image: string;
}
const page = () => {
  const [location , setLocations] = useState<location[]>([]);
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(
          "https://real-estate-clientside2.onrender.com/location.php"
        );
        setLocations(response.data);
      } catch (error) {
        console.error("Failed to fetch users: ", error);
      }
    };
    fetchLocation();
  }, []);
  return (
    <div>
      <h2 className="text-3xl font-semibold pb-[20px] tracking-tight transition-colors">
        Cities/Property City Management
      </h2>
      <LocationTable location={location} />
    </div>
  );
};

export default page;
