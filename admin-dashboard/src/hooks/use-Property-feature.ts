"use client";

import { useState, useCallback } from "react";
import type { PropertyFeaturesData } from "@/app/lib/types/property-feature";

export function usePropertyFeatures(propertyId?: number) {
  const [features, setFeatures] = useState<PropertyFeaturesData>({
    amenities: [],
    propertyFeatures: [],
    security: [],
    views: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveFeatures = useCallback(
    async (featuresData: PropertyFeaturesData) => {
      if (!propertyId) return false;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/properties/${propertyId}/features`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(featuresData),
        });

        const data = await response.json();

        if (data.success) {
          setFeatures(featuresData);
          return true;
        } else {
          setError(data.error || "Failed to save features");
          return false;
        }
      } catch (err) {
        setError("Network error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [propertyId]
  );

  const loadFeatures = useCallback(async () => {
    if (!propertyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/properties/${propertyId}/features`);
      const data = await response.json();

      if (data.success) {
        setFeatures(data.features);
      } else {
        setError(data.error || "Failed to load features");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  return {
    features,
    loading,
    error,
    saveFeatures,
    loadFeatures,
  };
}
