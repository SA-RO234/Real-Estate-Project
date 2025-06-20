"use client";
import SectionTitle from "@/components/shared/SectionTitle";
import React, { useState } from "react";
import PropertyList from "./PropertyList";
import { PropertyType } from "@/lib/types";
import { Loader2 } from "lucide-react";
import PaginationControls from "@/components/shared/PaginationControl";
import { useGetPropertiesQuery } from "@/hooks/useGetPropertiesQuery";
import PropertybyCityContainer from "./PropertyByCity/PropertybyCityContainer";
import "./HomeForYou.scss";
import { fetchProperties } from "@/lib/api/api";
const ITEMS_PER_PAGE = 8;
interface HomeForYouProps {
  searchResults?: PropertyType[];
}

const HomeForYou = ({ searchResults }: HomeForYouProps) => {
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties using fetchProperties directly
  React.useEffect(() => {
    if (searchResults) return; // Don't fetch if searchResults provided
    setLoading(true);
    setError(null);
    fetchProperties(page, ITEMS_PER_PAGE)
      .then((res) => {
        setProperties(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Unknown error");
        setLoading(false);
      });
  }, [page, searchResults]);

  const handleSeeMore = () => {
    const sessionId = localStorage.getItem("session_id");
    if (!sessionId) {
      window.location.href = "/login";
    } else {
      window.location.href = "/listing";
    }
  };

  return (
    <section className="w-[90%] m-[32px_auto] order-2 ">
      <SectionTitle
        title="Newly Developed Condominium Projects in Phnom Penh"
        subTitle="One of the surest ways to grow your money is by investing in pre-construction or under-construction condos. Your investment increases value from the first day you purchase the unit and will continue to appreciate until you decide to sell it. This long-term investment plan is an excellent way to earn passive income. Click here to get all condominium project in Phnom Penh capital Cambodia."
      />
      {/* Show search results if present, else default */}
      {searchResults ? (
        searchResults.length > 0 ? (
          <PropertyList properties={searchResults} />
        ) : (
          <p className="text-center text-muted-foreground mt-8">
            No properties found for your search.
          </p>
        )
      ) : (
        <>
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {/* Error State */}
          {error && (
            <div className="text-center text-destructive p-4 rounded-md">
              <p>Error loading properties: {error}</p>
            </div>
          )}
          {/* Success State */}
          {!loading && !error && properties.length > 0 && (
            <PropertyList properties={properties.slice(0, 6)} />
          )}
          {!loading && !error && properties.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">
              No properties found for this page.
            </p>
          )}
        </>
      )}
      {!loading && !error && (
        <div className="w-[10%] m-[50px_auto]">
          <button className="Show-more" onClick={handleSeeMore}>
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Show More</span>
          </button>
        </div>
      )}
      <PropertybyCityContainer />
    </section>
  );
};

export default HomeForYou;
