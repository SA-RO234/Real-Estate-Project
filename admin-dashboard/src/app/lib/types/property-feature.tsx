export interface PropertyFeature {
  id: string;
  name: string;
  category: "amenities" | "property-features" | "security" | "views";
  selected: boolean;
}

export interface FeatureCategory {
  id: string;
  title: string;
  features: PropertyFeature[];
  isExpanded: boolean;
}

export interface PropertyFeaturesData {
  amenities: string[];
  propertyFeatures: string[];
  security: string[];
  views: string[];
}
