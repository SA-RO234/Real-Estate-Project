"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  PropertyFilterSchema,
  PropertyFilterSchemaType,
} from "@/lib/validations/propertyFilterSchema";

// --- Your Price Range Data ---
// (Ideally, place this in a separate constants/data file and import it)
const priceRanges = [
  { id: 1, name: "Under $50,000", min: 0, max: 50000 },
  { id: 2, name: "$50,000 - $100,000", min: 50000, max: 100000 },
  { id: 3, name: "$100,000 - $200,000", min: 100000, max: 200000 },
  { id: 4, name: "$200,000 - $300,000", min: 200000, max: 300000 },
  { id: 5, name: "Over $300,000", min: 300000, max: Infinity }, // Use Infinity for no upper bound
];
// --- End Price Range Data ---

// Define the structure of the payload expected by your API/mutation
interface ApiFilterPayload {
  propertyType?: string;
  location?: string;
  bedrooms?: string;
  minPrice?: number; // API likely expects numbers
  maxPrice?: number | null; // API might expect null or absence for infinity/no upper limit
}

interface PropertyFilterProps {
  setSearchResults: (results: any[]) => void;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ setSearchResults }) => {
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [propertyCity, setPropertyCity] = useState<any[]>([]);
  const form = useForm<PropertyFilterSchemaType>({
    resolver: zodResolver(PropertyFilterSchema),
    defaultValues: {
      propertyType: undefined,
      location: "",
      bedrooms: undefined,
      // Default for the new price range ID field
      priceRangeId: undefined,
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ApiFilterPayload) => {
      const response = await fetch("http://localhost:3000/app/api/index.php",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch properties");
      return response.json();
    },
    onSuccess: (data) => {
      setSearchResults(data); 
    },
    onError: (error) => {
      console.error("Filter error:", error);
    },
  });

  function onSubmit(data: PropertyFilterSchemaType) {
    const selectedRange = data.priceRangeId
      ? priceRanges.find((range) => String(range.id) === data.priceRangeId) // Compare string ID from form with stringified number ID
      : undefined;

    const payload: ApiFilterPayload = {
      propertyType: data.propertyType || undefined,
      location: data.location || undefined,
      bedrooms: data.bedrooms || undefined,
    };

    if (selectedRange) {
      payload.minPrice = selectedRange.min;
      payload.maxPrice =
        selectedRange.max === Infinity ? undefined : selectedRange.max;
    }
    mutate(payload);
  }

  // Fetch All property types
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/app/api/index.php?allpropertiestype"
        );
        if (!response.ok) throw new Error("Failed to fetch property types");
        const data = await response.json();
        setPropertyTypes(data); // Save to state
      } catch (error) {
        console.error("Error fetching property types:", error);
      }
    };
    fetchPropertyTypes();
  }, []);

  // Fetch All property cities
  useEffect(() => {
    const fetchPropertyCities = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/app/api/index.php?allcities"
        );
        if (!response.ok) throw new Error("Failed to fetch property cities");
        const data = await response.json();
        setPropertyCity(data); // Save to state
      } catch (error) {
        console.error("Error fetching property cities:", error);
      }
    };
    fetchPropertyCities();
  }, []);
  return (
    <div className="absolute bg-white rounded-3xl shadow bottom-[-100px] left-0 right-0 w-[80%] mx-auto z-50 px-4">
      <Card>
        <CardHeader>
          <h2>Find Your Property</h2>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {/* Property Type */}
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Any Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyTypes.map((type: any) => (
                            <SelectItem
                              key={type.id}
                              value={String(type.id)} // Ensure value is a string
                            >
                              {type.name} {/* Display the user-friendly name */}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Any Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            ...new Map(
                              propertyCity.map((city: any) => [city.city, city])
                            ).values(),
                          ].map((city: any) => (
                            <SelectItem key={city.id} value={String(city.id)}>
                              {city.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Bedrooms */}
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Any Bedrooms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Bedroom</SelectItem>
                          <SelectItem value="2">2 Bedrooms</SelectItem>
                          <SelectItem value="3">3 Bedrooms</SelectItem>
                          <SelectItem value="4">4 Bedrooms</SelectItem>
                          <SelectItem value="5+">5+ Bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Price Range Select */}
                <FormField
                  control={form.control}
                  name="priceRangeId" // Use the new field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Range</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            {/* Placeholder for the price range dropdown */}
                            <SelectValue placeholder="Any Price" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Map over your priceRanges to create SelectItems */}
                          {priceRanges.map((range) => (
                            <SelectItem
                              key={range.id}
                              // Value must be a string for SelectItem
                              value={String(range.id)}
                            >
                              {range.name}{" "}
                              {/* Display the user-friendly name */}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search />
                    Search Properties
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PropertyFilter;
