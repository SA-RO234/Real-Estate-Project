"use client";
import { fetchAllPropertyType } from "@/app/lib/api/api";
import React, { useEffect, useState } from "react";
import PropertyTypeTable from "@/components/admin/propertyType-table";

const Page = () => {
  const [propertyType, setPropertyType] = useState<any>([]);

  useEffect(() => {
    fetchAllPropertyType().then((res) => {
      setPropertyType(res);
    });
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold pb-[20px] tracking-tight transition-colors">
        Property Type
      </h2>
      <PropertyTypeTable property={propertyType} />
    </div>
  );
};

export default Page;
