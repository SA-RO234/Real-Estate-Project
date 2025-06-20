"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface FeatureSection {
  id: number;
  name: string;
}

interface PropertyFeaturesProps {
  value?: number[];
  onChange?: (selectedFeatures: number[]) => void;
}
export default function PropertyFeatures({
  value,
  onChange,
}: PropertyFeaturesProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<number>>(
    new Set()
  );
  const [features, setFeatures] = useState<FeatureSection[]>([]);

  // Fetch all features from API
  useEffect(() => {
    fetch("https://real-estate-clientside2.onrender.com/propertyFeature.php")
      .then((res) => res.json())
      .then((data) => setFeatures(data))
      .catch((err) => console.error("Failed to fetch features", err));
  }, []);

  // Sync with value prop for edit mode, but only if value changes
  useEffect(() => {
    if (Array.isArray(value)) {
      const valueSet = new Set(value);
      let isDifferent = valueSet.size !== selectedFeatures.size;
      if (!isDifferent) {
        for (let v of valueSet) {
          if (!selectedFeatures.has(v)) {
            isDifferent = true;
            break;
          }
        }
      }
      if (isDifferent) {
        setSelectedFeatures(valueSet);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  // Only call onChange when user interacts
  const handleToggleFeature = (featureId: number) => {
    setSelectedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      if (onChange) {
        onChange(Array.from(newSet));
      }
      return newSet;
    });
  };

  const clearAllFeatures = () => {
    setSelectedFeatures(new Set());
    if (onChange) {
      onChange([]);
    }
  };
  const getSelectedCount = () => selectedFeatures.size;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Property Features & Amenities
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Select all features and amenities that apply to your property
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {getSelectedCount()} selected
          </Badge>
          {getSelectedCount() > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllFeatures}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Features List */}
      <Card>
        <CardContent className="p-6 bg-slate-50">
          <div className="flex flex-wrap gap-3">
            {features.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => handleToggleFeature(feature.id)}
                className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${
                  selectedFeatures.has(feature.id)
                    ? "border-green-500 bg-black text-green-700 shadow-sm"
                    : "border-green-300 bg-white text-green-600 hover:border-green-400 hover:bg-green-50"
                }`}
              >
                {feature.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Features Summary */}
      {getSelectedCount() > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-3">
              Selected Features ({getSelectedCount()})
            </h4>
            <div className="flex flex-wrap gap-2">
              {features
                .filter((f) => selectedFeatures.has(f.id))
                .map((feature) => (
                  <Badge
                    key={feature.id}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                    onClick={() => handleToggleFeature(feature.id)}
                  >
                    {feature.name}
                    <span className="ml-1 text-blue-600">×</span>
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
