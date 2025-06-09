import React, { ReactNode } from "react";
import { AppSidebar } from "@/components/admin/app-sidebar";
import "./globals.css";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/assets/favicon.ico" />
      </head>
      <body className="">
        <SidebarProvider>
          {/* <AppSidebar variant="inset" /> */}
          <SidebarInset>
            {/* <SiteHeader /> */}
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
