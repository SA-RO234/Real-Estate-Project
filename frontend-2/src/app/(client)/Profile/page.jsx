"use client";
import { Camera, Upload, Plus, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import React,{useState , useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
export default function EditProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password : "",
    avatar: "",
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storeUser = localStorage.getItem("user");
      if (storeUser && storeUser !== "undefined" && storeUser !== "null") {
        const userData = JSON.parse(storeUser);
        setUser({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          password : userData.password || "",
          avatar:
            userData.avatar || "",
        });
      }
    }
  }, []);
  return (
    <div className="container m-auto pt-6">
      <div className="relative w-full h-[500px] overflow-hidden rounded-[30px] mb-16">
        <Image
          src="https://res.cloudinary.com/dnfahcxo3/image/upload/v1746551551/333b412d-b694-42f4-9144-974bb6b255a9.png"
          alt="Modern property exterior"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">My Profile</h1>
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span>/</span>
              <span>My Profile</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-5 pb-[100px] bg-gray-200 rounded-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <h1 className="text-3xl py-[50px] font-semibold text-gray-800">
            My Profile
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center lg:flex-row gap-12">
          {/* Left Side - Profile Image and Upload Areas */}
          <div className="flex group cursor-pointer items-center rounded-full relative overflow-hidden w-[400px] h-[400px] justify-center">
            <input type="file" name="" id="file" className="hidden" />
            <img
              src={
                user.avatar ||
                "https://res.cloudinary.com/dnfahcxo3/image/upload/v1749059211/f694aef9-8ea1-428e-9451-344b0c4a672b.png"
              }
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
            <label
              htmlFor="file"
              className="overlay cursor-pointer opacity-0 duration-200 group-hover:opacity-100 absolute w-full h-full bg-[rgba(0,0,0,0.58)]"
            ></label>
            <CirclePlus className="absolute  w-[70px] opacity-0 group-hover:opacity-50 h-[70px] text-white z-50" />
          </div>

          {/* Right Side - Form Fields */}
          <div className="flex bg-transparent flex-col gap-8 lg:w-1/2">
            <Card className="p-8">
              <div className="flex flex-col gap-6">
                {/* Name Field */}
                <div className="flex flex-wrap items-center">
                  <Label className="text-gray-600 font-medium w-full md:w-1/3 mb-2 md:mb-0">
                    Name:
                  </Label>
                  <div className="w-full md:w-2/3">
                    <Input
                      defaultValue={user.name}
                      className="border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-wrap items-center">
                  <Label className="text-gray-600 font-medium w-full md:w-1/3 mb-2 md:mb-0">
                    Email:
                  </Label>
                  <div className="w-full md:w-2/3">
                    <Input
                      defaultValue={user.email}
                      type="email"
                      className="border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="flex flex-wrap items-center">
                  <Label className="text-gray-600 font-medium w-full md:w-1/3 mb-2 md:mb-0">
                    Phone Number:
                  </Label>
                  <div className="w-full md:w-2/3">
                    <Input
                      defaultValue={user.phone}
                      type="tel"
                      className="border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* password Field */}
                <div className="flex flex-wrap items-start">
                  <Label className="text-gray-600 font-medium w-full md:w-1/3 mb-2 md:mb-0 pt-2">
                    Password:
                  </Label>
                  <div className="w-full md:w-2/3">
                    <Input
                      type="password"
                      defaultValue={user.password}
                      className="border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                className="px-8 py-3 cursor-pointer border-blue-500 text-blue-600 hover:bg-blue-50 font-medium tracking-wider"
              >
                CANCEL
              </Button>
              <Button className="px-8 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 font-medium tracking-wider">
                SAVE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
