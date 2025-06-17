"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/app/lib/utils/utils";

interface FeatureSection {
  id: string;
  title: string;
  features: string[];
  isExpanded: boolean;
}
interface PropertyFeaturesProps {
  onChange?: (selectedFeatures: number[]) => void;
}


export default function PropertyFeatures({ onChange }: PropertyFeaturesProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set()
  );
  const [sections, setSections] = useState<FeatureSection[]>([
    {
      id: "amenities",
      title: "AMENITIES",
      isExpanded: true,
      features: [
        "COMMON AREA",
        "SPORTS FACILITIES",
        "PLAYGROUND",
        "SWIMMING POOL",
        "GYM/FITNESS CENTER",
        "JACUZZI",
        "SAUNA",
        "TENNIS COURT",
        "GARDEN",
        "CAR PARKING",
        "LIFT / ELEVATOR",
        "BACKUP ELECTRICITY / GENERATOR",
        "NON-FLOODING",
        "ON MAIN ROAD",
        "COMMERCIAL AREA",
      ],
    },
    {
      id: "property-features",
      title: "PROPERTY FEATURES",
      isExpanded: true,
      features: [
        "FULLY FURNISHED",
        "BALCONY",
        "AIR CONDITIONING",
        "INTERNET / WIFI",
        "PAY TV",
        "PET FRIENDLY",
        "SERVICED PROPERTY",
        "LONG TERM RENTAL",
      ],
    },
    {
      id: "security",
      title: "SECURITY",
      isExpanded: true,
      features: [
        "ALARM SYSTEM",
        "VIDEO SECURITY",
        "RECEPTION 24/7",
        "FIRE SPRINKLER SYSTEM",
        "FIRE ALARM",
        "GATED COMMUNITY",
      ],
    },
    {
      id: "views",
      title: "VIEWS",
      isExpanded: true,
      features: [
        "CITY VIEWS",
        "MOUNTAIN VIEWS",
        "GARDEN VIEWS",
        "POOL VIEWS",
        "SEA VIEWS",
        "LAKE VIEWS",
      ],
    },
  ]);

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(feature)) {
        newSet.delete(feature);
      } else {
        newSet.add(feature);
      }
      return newSet;
    });
  };

  const clearAllFeatures = () => {
    setSelectedFeatures(new Set());
  };

  const getSelectedCount = () => selectedFeatures.size;

  return (
    <div className="space-y-4">
      {/* Header with selected count */}
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

      {/* Feature Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <div
              className="bg-black text-white p-4 cursor-pointer flex items-center justify-between transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <h3 className="font-semibold text-sm tracking-wide">
                {section.title}
              </h3>
              {section.isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>

            {section.isExpanded && (
              <CardContent className="p-6 bg-slate-50">
                <div className="flex flex-wrap gap-3">
                  {section.features.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={cn(
                        "px-4 py-2 rounded-md border-2 text-sm font-medium transition-all duration-200 hover:shadow-md",
                        selectedFeatures.has(feature)
                          ? "border-green-500 bg-black text-green-700 shadow-sm"
                          : "border-green-300 bg-white text-green-600 hover:border-green-400 hover:bg-green-50"
                      )}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Selected Features Summary */}
      {getSelectedCount() > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-3">
              Selected Features ({getSelectedCount()})
            </h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedFeatures).map((feature) => (
                <Badge
                  key={feature}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
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
