"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Home,
  Bed,
  Bath,
  Sofa,
  ChefHat,
  Star,
  Info,
  Diamond,
  Layers,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PropertyDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/images/villa-main.png",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ];

  const propertyData = {
    title: "good villa",
    location: "tangier",
    address: "avenir moulay rachid",
    type: "villa",
    bedrooms: 6,
    bathrooms: 6,
    livingRooms: 6,
    kitchens: 6,
    standard: "economical",
    status: "rent",
    action: "available",
    floors: 0,
    garages: 0,
    description: "6666666",
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const overviewItems = [
    {
      icon: Home,
      label: "Type",
      value: propertyData.type,
      color: "text-blue-600",
    },
    {
      icon: Bed,
      label: "Bedrooms",
      value: propertyData.bedrooms,
      color: "text-purple-600",
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: propertyData.bathrooms,
      color: "text-cyan-600",
    },
    {
      icon: Sofa,
      label: "Living Rooms",
      value: propertyData.livingRooms,
      color: "text-indigo-600",
    },
    {
      icon: ChefHat,
      label: "Kitchens",
      value: propertyData.kitchens,
      color: "text-orange-600",
    },
    {
      icon: Star,
      label: "Standard",
      value: propertyData.standard,
      color: "text-yellow-600",
    },
    {
      icon: Info,
      label: "Status",
      value: propertyData.status,
      color: "text-blue-600",
    },
    {
      icon: Diamond,
      label: "Action",
      value: propertyData.action,
      color: "text-green-600",
    },
    {
      icon: Layers,
      label: "Floors",
      value: propertyData.floors,
      color: "text-gray-600",
    },
    {
      icon: Car,
      label: "Garages",
      value: propertyData.garages,
      color: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
            {propertyData.title}
          </h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-lg">
              {propertyData.location}, {propertyData.address}
            </span>
          </div>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            {propertyData.action}
          </Badge>
        </div>

        {/* Image Gallery */}
        <div className="mb-12">
          <div className="relative mb-6">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-200">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`Property view ${currentImageIndex + 1}`}
                width={1200}
                height={750}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0 w-12 h-12 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0 w-12 h-12 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-200 ${
                  index === currentImageIndex
                    ? "ring-4 ring-blue-500 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-32 h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {propertyData.description}
                </p>
              </CardContent>
            </Card>

            {/* Overview */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {overviewItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-lg bg-white shadow-sm ${item.color}`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">
                            {item.label}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 capitalize">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Agent
                </h3>
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Schedule Viewing
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save Property
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-semibold capitalize">
                      {propertyData.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {propertyData.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard</span>
                    <span className="font-semibold capitalize">
                      {propertyData.standard}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {propertyData.action}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
