"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "react-hot-toast";
import { Loader2, Plus } from "lucide-react";
import axios from "axios";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  role: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editData, setEditData] = useState<ProfileData | null>(null);
  const [userID, setUserID] = useState<any>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminStr = localStorage.getItem("admin");
      const user = adminStr ? JSON.parse(adminStr) : null;
      setUserID(user);
      if (user) {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          password: user.password || "",
          avatar: user.avatar || "",
          role: "admin", // Always set as admin
        });
        setEditData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          password: user.password || "",
          avatar: user.avatar || "",
          role: "admin", // Always set as admin
        });
      }
    }
  }, []);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editData || !userID?.id) return;
    setIsSaving(true); // Start loading
    try {
      await axios.put(
        `https://real-estate-clientside2.onrender.com/users?id=${userID.id}`,
        editData
      );
      setProfileData(editData);
      setIsEditing(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin", JSON.stringify(editData));
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile!");
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false); // Stop loading
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData((prev) =>
      prev
        ? { ...prev, [field]: value, role: "admin" }
        : {
            name: "",
            email: "",
            phone: "",
            password: "",
            avatar: "",
            role: "admin",
            [field]: value,
          }
    );
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "userImage"); // Your Cloudinary preset

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dnfahcxo3/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.secure_url) {
          setEditData((prev) =>
            prev ? { ...prev, avatar: data.secure_url } : null
          );
          toast.success("Avatar uploaded!");
        } else {
          toast.error("Failed to upload avatar.");
        }
      } catch (err) {
        toast.error("Failed to upload avatar.");
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white px-8 py-4 flex items-center justify-between border-b">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold text-gray-800">
                  {isEditing ? "Edit Profile" : "Profile"}
                </h1>
              </div>
            </div>
            {/* Profile Content */}
            <div className="p-8">
              <div className="w-full mx-auto">
                <div className="flex h-[700px] gap-8">
                  {/* Profile Image Section */}
                  <div className="flex justify-center w-[50%] overflow-hidden flex-col items-center ">
                    <input
                      type="file"
                      className="hidden"
                      id="file"
                      name="avatar"
                      accept="image/*"
                      disabled={avatarUploading}
                      onChange={isEditing ? handleAvatarChange : undefined}
                    />
                    <label
                      htmlFor="file"
                      className="w-[70%] group cursor-pointer flex justify-center items-center overflow-hidden relative h-[65%]"
                    >
                      <img
                        className="h-full rounded-full w-full object-cover"
                        src={isEditing ? editData?.avatar : profileData?.avatar}
                        alt="avatar"
                      />
                      <div className="overlay opacity-0 group-hover:opacity-100 duration-300 rounded-full absolute top-0 w-full h-full bg-[rgba(0,0,0,0.6)]"></div>
                      <Plus className="absolute opacity-0 group-hover:opacity-100 duration-300 text-white w-[50px] h-[50px]" />
                      {avatarUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <Loader2 className="animate-spin text-white w-8 h-8" />
                        </div>
                      )}
                    </label>
                  </div>
                  {/* Profile Information */}
                  <div className="flex-1 flex justify-start items-center">
                    {!isEditing ? (
                      <div className="space-y-6">
                        <div className="border-b-3 pb-5 mb-[50px] border-dashed">
                          <Label className="text-3xl font-bold text-gray-600">
                            Name:
                          </Label>
                          <div className="text-gray-800 text-7xl uppercase font-bold mt-1">
                            {profileData?.name}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xl font-bold text-gray-600">
                            Role:
                          </Label>
                          <div className="text-gray-800 text-3xl first-letter:uppercase  font-bold mt-1">
                            {profileData?.role}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xl font-bold text-gray-600">
                            Email:
                          </Label>
                          <div className="text-gray-800 font-bold text-2xl mt-1">
                            {profileData?.email}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xl font-bold text-gray-600">
                            Phone Number:
                          </Label>
                          <div className="text-gray-800 font-bold text-2xl mt-1">
                            {profileData?.phone}
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            onClick={handleEdit}
                            variant="outline"
                            className="px-8 cursor-pointer py-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            ✏️ EDIT PROFILE
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Name:
                            </Label>
                            <Input
                              value={editData?.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              className="mt-1 border-gray-300"
                            />
                          </div>
                          <div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Email:
                            </Label>
                            <Input
                              value={editData?.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="mt-1 border-gray-300"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Phone Number:
                            </Label>
                            <Input
                              value={editData?.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="mt-1 border-gray-300"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Password:
                            </Label>
                            <Input
                              type="password"
                              value={editData?.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              className="mt-1 border-gray-300"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-4 pt-4">
                          <Button
                            onClick={handleSave}
                            className="px-12 cursor-pointer py-2 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={avatarUploading || isSaving}
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Saving...
                              </>
                            ) : (
                              "SAVE"
                            )}
                          </Button>
                          <Button
                            onClick={handleCancel}
                            variant="outline"
                            className="px-12 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                            disabled={avatarUploading}
                          >
                            CANCEL
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
