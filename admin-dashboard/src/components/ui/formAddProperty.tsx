"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Star, Camera, DollarSign } from "lucide-react";
import PropertyImageUpload from "@/components/ui/property-image-upload";
import PropertyFeatures from "@/components/ui/property-fetures";
import axios from "axios";

export default function PropertyRegistrationForm() {
  const [activeTab, setActiveTab] = useState("general");
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  // Add state for form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState<
    { id: number; name: string }[]
  >([]);

  const [propertyStatus, setPropertyStatus] = useState("");
  const [description, setDescription] = useState("");
  const [propertyFor, setPropertyFor] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [hoaFees, setHoaFees] = useState("");
  const [listedDate, setListedDate] = useState("");
  const [locations, setLocations] = useState<{ id?: number; city: string }[]>(
    []
  );
  const [images, setImages] = useState<{ url: string; image_for_ad: number }[]>(
    []
  );
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [features, setFeatures] = useState<number[]>([]); // Array of feature IDs
  const [selectedPropertyTypeId, setSelectedPropertyTypeId] =
    useState<string>("");

  const handleFeaturesChange = useCallback((features: number[]) => {
    setSelectedFeatures(features);
  }, []);

  useEffect(() => {
    // Only runs on client
    const adminStr = localStorage.getItem("admin");
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        setUserId(admin.id);
      } catch (e) {
        setUserId(null);
      }
    }
  }, []);

  // Handle form submission
  const handleCreateProperty = async () => {
    const propertyData = {
      title,
      description,
      price: Number(price),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      square_feet: Number(squareFeet),
      lot_size: lotSize,
      year_built: Number(yearBuilt),
      status: propertyStatus,
      listed_date: listedDate,
      hoa_fees: Number(hoaFees),
      location_id: Number(selectedLocationId),
      property_type_id: Number(selectedPropertyTypeId),
      property_for: propertyFor,
      user_id: userId,
      features : selectedFeatures,
      images,
    };

    try {
      const response = await fetch(
        "https://real-estate-clientside2.onrender.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyData),
        }
      );
  
      if (response.ok) {
        alert("Property created successfully!");
      } else {
        const errorText = await response.text();
        alert("Failed to create property.\n" + errorText);
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  useEffect(() => {
    const FetchPropertyType = async () => {
      try {
        const responce = await axios.get(
          "https://real-estate-clientside2.onrender.com?propertyType"
        );
        setPropertyType(Array.isArray(responce.data) ? responce.data : []);
      } catch (error) {
        console.error("Fail To fetch  property Type ! ", error);
        setPropertyType([]); // fallback
      }
    };
    FetchPropertyType();
  }, []);

  //  Location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const responce = await axios.get(
          "https://real-estate-clientside2.onrender.com/location.php?only=city"
        );
        // If response is array of strings, convert to array of objects
        let locationsArray: { id?: number; city: string }[] = [];
        if (Array.isArray(responce.data)) {
          locationsArray = responce.data.map((city: string, idx: number) => ({
            id: idx + 1, // Generate a temporary id
            city,
          }));
        } else if (Array.isArray(responce.data.locations)) {
          locationsArray = responce.data.locations.map(
            (city: string, idx: number) => ({
              id: idx + 1,
              city,
            })
          );
        }
        setLocations(locationsArray);
      } catch (error) {
        console.error("Fail To fetch city!", error);
        setLocations([]); // fallback
      }
    };
    fetchLocation();
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 ">
      <div className="mx-auto w-full">
        <Card className="shadow-xl border-0">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 rounded-none border-b bg-slate-50">
                <TabsTrigger
                  value="general"
                  className="flex items-center gap-2 data-[state=active]:bg-white"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="flex items-center gap-2 data-[state=active]:bg-white"
                >
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Features</span>
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="flex items-center gap-2 data-[state=active]:bg-white"
                >
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">Images</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="property-title"
                      className="text-sm font-medium text-slate-700"
                    >
                      Property Title *
                    </Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      id="property-title"
                      placeholder="Enter property title"
                      className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="sale-price"
                      className="text-sm font-medium text-slate-700 flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Sale Price *
                    </Label>
                    <Input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      id="sale-price"
                      placeholder="Enter price"
                      type="number"
                      className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">
                      Property For *
                    </Label>
                    <RadioGroup
                      value={propertyFor}
                      onValueChange={setPropertyFor}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rent" id="rent" />
                        <Label htmlFor="rent" className="cursor-pointer">
                          Rent
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sale" id="sale" />
                        <Label htmlFor="sale" className="cursor-pointer">
                          Sale
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="cursor-pointer">
                          Both
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Property Type *
                      </Label>
                      <Select
                        value={selectedPropertyTypeId}
                        onValueChange={setSelectedPropertyTypeId}
                      >
                        <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white">
                          {(Array.isArray(propertyType)
                            ? propertyType
                            : []
                          ).map((e) =>
                            e && e.id !== undefined ? (
                              <SelectItem key={e.id} value={e.id.toString()}>
                                {e.name}
                              </SelectItem>
                            ) : null
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Property Status *
                    </Label>
                    <Select
                      value={propertyStatus}
                      onValueChange={setPropertyStatus}
                    >
                      <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white">
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under-construction">
                          Under Construction
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Location *
                    </Label>
                    <Select
                      value={selectedLocationId}
                      onValueChange={setSelectedLocationId}
                    >
                      <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white">
                        {(Array.isArray(locations) ? locations : []).map(
                          (loc) =>
                            loc && loc.city ? (
                              <SelectItem
                                key={loc.id ?? loc.city}
                                value={loc.id ? loc.id.toString() : loc.city}
                              >
                                {loc.city}
                              </SelectItem>
                            ) : null
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Bedrooms *
                    </Label>
                    <Input
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      type="number"
                      placeholder="Number of bedrooms"
                      className="h-11 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Bathrooms *
                    </Label>
                    <Input
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      type="number"
                      placeholder="Number of bathrooms"
                      className="h-11 border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Square Feet *
                    </Label>
                    <Input
                      value={squareFeet}
                      onChange={(e) => setSquareFeet(e.target.value)}
                      type="number"
                      placeholder="Square feet"
                      className="h-11 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Lot Size
                    </Label>
                    <Input
                      value={lotSize}
                      onChange={(e) => setLotSize(e.target.value)}
                      placeholder="Lot size"
                      className="h-11 border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Year Built
                    </Label>
                    <Input
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      type="number"
                      placeholder="Year built"
                      className="h-11 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      HOA Fees
                    </Label>
                    <Input
                      value={hoaFees}
                      onChange={(e) => setHoaFees(e.target.value)}
                      type="number"
                      placeholder="HOA fees"
                      className="h-11 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="listed-date"
                    className="text-sm font-medium text-slate-700"
                  >
                    Listed Date
                  </Label>
                  <Input
                    value={listedDate}
                    onChange={(e) => setListedDate(e.target.value)}
                    id="listed-date"
                    type="date"
                    className="h-11 border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-700"
                  >
                    Property Description *
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    placeholder="Describe your property in detail..."
                    className="min-h-[120px] border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-slate-500">
                    Minimum 50 characters recommended
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="features" className="p-6">
                <PropertyFeatures onChange={handleFeaturesChange} />
              </TabsContent>

              <TabsContent value="images" className="p-6">
                <PropertyImageUpload images={images} setImages={setImages} />
              </TabsContent>
            </Tabs>
          </CardContent>

          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-b-lg border-t">
            <Button variant="outline" className="px-8">
              Back
            </Button>
            <div className="flex items-center gap-4">
              <Button
                className="px-8 bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateProperty}
              >
                Create Property
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
