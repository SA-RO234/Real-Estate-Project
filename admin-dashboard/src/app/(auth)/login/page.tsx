"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail } from "lucide-react";
import { cn } from "@/app/lib/utils/utils";
import axios from "axios";
import Lottie from "lottie-react";
import animationData from "@/assets/Unlock.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://real-estate-clientside2.onrender.com/users",
        {
          admin_login: true,
          email,
          password,
        }
      );
      if (response.data.session_id) {
        setIsUnlocking(true);
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          localStorage.setItem("adminsession_id", response.data.session_id);
          localStorage.setItem("admin", JSON.stringify(response.data.user));
          window.location.href = "/";
        }, 1500); // Show animation for 1.5 seconds
      } else {
        setError(response.data.message);
        toast.error(response.data.message || "Wrong email or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  if (isUnlocking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie
          animationData={animationData}
          style={{ width: 300, height: 300 }}
        />
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full flex justify-center items-center z-[1000] h-full bg-white">
        <div className="w-[70%] h-[600px] overflow-hidden flex justify-center gap-5 items-center  m-auto bg-gray-200 shadow p-[10px] rounded-[50px] ">
          <div className="w-[50%] flex justify-center items-center flex-col h-full  space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <span className="text-3xl">🏠</span>
              </div>
              <h1 className="text-3xl font-bold">Welcome home</h1>
              <p className="text-gray-500">Please enter your details.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 w-[80%]">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10  py-6 rounded-full"
                    required
                  />
                  <Mail className="absolute left-3  top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 py-6 rounded-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className={cn(
                  "w-full py-6 cursor-pointer rounded-full bg-blue-700 hover:bg-blue-800",
                  "text-white font-medium"
                )}
              >
                Login
              </Button>
            </form>
          </div>
          <div className="rounded-[50px] bg-white  w-[50%] h-[100%] justify-center flex items-center">
            <img
              className="h-[60%] object-cover w-[60%] rounded-4xl"
              src="/assets/logo2.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
