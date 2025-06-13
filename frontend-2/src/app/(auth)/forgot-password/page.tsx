"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        "https://real-estate-clientside2.onrender.com/users",
        { forgot_password: true, email }
      );
      if (response.data.success) {
        setMessage("A verification link has been sent to your email.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to send verification email.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <section className="h-screen w-full flex items-center justify-center">
      <div className="container max-w-md bg-background rounded-md p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="pb-3">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading} // Disable input while loading
            />
          </div>
          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Sending..." : "Send Verification Link"}
          </Button>
        </form>
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
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
