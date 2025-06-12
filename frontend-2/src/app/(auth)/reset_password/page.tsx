import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/common/home/users/resetPasswordform";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Safely extract token as string
  const token =
    typeof searchParams.token === "string"
      ? searchParams.token
      : Array.isArray(searchParams.token)
      ? searchParams.token[0]
      : undefined;

  if (!token) {
    redirect("/auth/login");
  }

  return (
    <section className="h-screen w-full flex items-center justify-center">
      <div className="container max-w-md bg-background rounded-md p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <ResetPasswordForm token={token} />
      </div>
    </section>
  );
}
