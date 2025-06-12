"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import axios from "axios";
import ResetPasswordForm from "@/components/common/home/users/resetPasswordform";
async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  const [newPassword, setNewPassword] = useState(""); // This won't work directly in Server Components

  return (
    <section className="h-screen w-full flex items-center justify-center">
      <div className="container max-w-md bg-background rounded-md p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <ResetPasswordForm token={token} />
      </div>
    </section>
  );
}
