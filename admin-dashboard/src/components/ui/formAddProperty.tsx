"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Home, MapPin, FileText, Star, Camera, DollarSign } from "lucide-react";
import PropertyImageUpload from "@/components/ui/property-image-upload";
import PropertyFeatures from "@/components/ui/property-fetures";

export default function PropertyRegistrationForm() {
  const [propertyFor, setPropertyFor] = useState("rent");
  const [activeTab, setActiveTab] = useState("general");

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
                  value="location"
                  className="flex items-center gap-2 data-[state=active]:bg-white"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Location</span>
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
                      <Select>
                        <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
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
                    <Select>
                      <SelectTrigger className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
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

                  <div className="flex items-end">
                    <Badge variant="secondary" className="h-fit">
                      Step 1 of 5
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-700"
                  >
                    Property Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail..."
                    className="min-h-[120px] border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-slate-500">
                    Minimum 50 characters recommended
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="location" className="p-6">
                <div className="flex items-center justify-center h-64 text-slate-500">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p>Location details will be configured here</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="p-6">
                <PropertyFeatures />
              </TabsContent>

              <TabsContent value="images" className="p-6">
                <PropertyImageUpload />
              </TabsContent>
            </Tabs>
          </CardContent>

          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-b-lg border-t">
            <Button variant="outline" className="px-8">
              Back
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Save progress automatically
              </span>
              <Button className="px-8 bg-blue-600 hover:bg-blue-700">
                Next Step
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
