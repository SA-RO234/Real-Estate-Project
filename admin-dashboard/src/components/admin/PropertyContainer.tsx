"use client";
import React, { useState, useEffect } from "react";
import { fetchProperties } from "@/app/lib/api/api";
import { Property } from "@/app/lib/types";
import PropertyCard from "./Properties-card";
const Propertycontainer = ({
  initialProperties,
}: {
  initialProperties: Property[];
}) => {
  const [properties, setProperties] = useState(initialProperties);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchProperties()
      .then((data: any) => {
        // Ensure data.data is an array
        setProperties(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch properties");
        setLoading(false);
      });
  }, []);



  if (loading)
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-6">
          <p className="text-center text-xl">Loading properties...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-6">
          <p className="text-center text-xl text-red-600">{error}</p>
        </div>
      </div>
    );

    const handleDelete = (propertyID: number) => {
      setProperties((prev) => prev.filter((p) => p.propertyID !== propertyID));
    };

  return (
    <div>
      <div className="min-h-screen">
        <div className="container mx-auto p-6">
          {properties.length === 0 ? (
            <p className="text-center text-xl py-10">No properties found</p>
          ) : (
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.propertyID}
                  property={property}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Propertycontainer;
