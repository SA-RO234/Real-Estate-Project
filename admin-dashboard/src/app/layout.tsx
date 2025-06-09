"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/admin/app-sidebar";
import "./globals.css";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isUser, setUser] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const sessionId = localStorage.getItem("adminsession_id");
    // Only redirect if NOT on /login
    if (!sessionId && pathname !== "/login") {
      window.location.href = "/login";
    } else if (sessionId) {
      setUser(true);
    }
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/assets/favicon.ico" />
      </head>
      <body className="">
        <SidebarProvider>
          {isUser ? <AppSidebar variant="inset" /> : null}
          <SidebarInset>
            {isUser ? <SiteHeader /> : null}
            <div className="flex flex-1 flex-col bg-white">
              <div className="@container/main flex flex-1 flex-col gap-2 p-4 lg:px-6">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
