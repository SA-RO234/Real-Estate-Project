import React from "react";

// Only renders children, no sidebar or header
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
