import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/common/home/users/resetPasswordform";

// Define the searchParams type
interface SearchParams {
  token?: string;
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Access token from searchParams
  const token = searchParams.token;

  // Redirect if token is missing (optional, based on your logic)
  if (!token) {
    redirect("/auth/login"); // Adjust the redirect path as needed
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
