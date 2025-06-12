"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { useState } from "react";
const ResetPasswordForm = ({ token }: { token?: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    try {
      const response = await axios.post(
        "https://real-estate-clientside2.onrender.com/users",
        {
          reset_password: true,
          token,
          new_password: newPassword,
        }
      );
      if (response.data.message?.toLowerCase().includes("success")) {
        setMessage("Your password has been reset.");
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="pb-3">New Password</Label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
      </div>
      <Button type="submit" className="w-full cursor-pointer">
        Reset Password
      </Button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </form>
  );
};

export default ResetPasswordForm;
