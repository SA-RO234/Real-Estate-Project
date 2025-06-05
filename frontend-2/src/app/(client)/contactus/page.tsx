"use client";
import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: true,
    email: true,
    phone: true,
    subject: true,
    message: true,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update error state
    setErrors((prev) => ({
      ...prev,
      [field]: value.trim() === "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === "",
      phone: formData.phone.trim() === "",
      subject: formData.subject.trim() === "",
      message: formData.message.trim() === "",
    };

    setErrors(newErrors);

    // Check if form is valid
    const isValid = !Object.values(newErrors).some((error) => error);

    if (isValid) {
      console.log("Form submitted:", formData);
      // Handle form submission here
    }
  };

  return (
    <div className="container m-auto py-6">
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
            <h1 className="text-5xl md:text-7xl font-bold mb-4">Contact us</h1>
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span>/</span>
              <span>Contact us</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
            Free to Drop Us a Message
          </h1>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* First Row - Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="sr-only">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="h-14 text-lg border-0 bg-white shadow-sm rounded-lg px-4 placeholder:text-gray-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  Please fill out this field.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-14 text-lg border-0 bg-white shadow-sm rounded-lg px-4 placeholder:text-gray-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  Please fill out this field.
                </p>
              )}
            </div>
          </div>

          {/* Second Row - Phone and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="phone" className="sr-only">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-14 text-lg border-0 bg-white shadow-sm rounded-lg px-4 placeholder:text-gray-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">
                  Please fill out this field.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="sr-only">
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="h-14 text-lg border-0 bg-white shadow-sm rounded-lg px-4 placeholder:text-gray-500"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm">
                  Please fill out this field.
                </p>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Write a Message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="min-h-32 text-lg border-0 bg-white shadow-sm rounded-lg p-4 placeholder:text-gray-500 resize-none"
              rows={6}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">
                Please fill out this field.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button type="submit" className="text-white btn">
              Submit Now
            </Button>
          </div>
        </form>
      </div>

      <div className="container pt-[100px] m-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
            How to Reach us?
          </h1>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d250177.01487869336!2d104.9001984!3d11.55072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2skh!4v1749062474325!5m2!1sen!2skh"
          className="w-full h-[600px] rounded-[50px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
