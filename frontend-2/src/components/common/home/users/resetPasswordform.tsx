"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ResetPasswordForm = ({ token }: { token?: string }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!token) {
      setError("Invalid or missing token.");
      toast.error("Invalid or missing token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        "https://real-estate-clientside2.onrender.com/users",
        {
          reset_password: true,
          token,
          password: newPassword,
        }
      );
      if (response.data.message?.toLowerCase().includes("success")) {
        setMessage("Your password has been reset.");
        toast.success("Your password has been reset.");
      } else {
        setError(response.data.message || "Failed to reset password.");
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
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
        <div>
          <Label className="pb-3">Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Reset Password
        </Button>
        {/* Use shadcn alert for feedback */}
        {message && (
          <Alert variant="default" className="mt-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </>
  );
};

export default ResetPasswordForm;
