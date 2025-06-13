"use client";

import * as React from "react";
import {
  BadgeDollarSign,
  LayoutDashboardIcon,
  HousePlus,
  UsersIcon,
  List,
  PlusCircle,
  Bath,
  Mails,
  MapPinHouse,
  Building,
} from "lucide-react";

import { NavDocuments } from "@/components/admin/nav-documents";
import { NavMain } from "@/components/admin/nav-main";
import { NavSecondary } from "@/components/admin/nav-secondary";
import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Property",
      url: "/property",
      icon: HousePlus,
      children: [
        { title: "List Property", url: "/property", icon: List },
        {
          title: "Add Property",
          url: "/property/add",
          icon: PlusCircle,
        },
        {
          title: "Property Type",
          url: "/property/propetyType",
          icon: Building,
        },
        {
          title: "Property City",
          url: "/property/propertyEachCity",
          icon: MapPinHouse,
        },
        {
          title: "Property Feature",
          url: "/property/propertyEachCity",
          icon: Bath,
        },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: UsersIcon,
      children: [
        { title: "All Users", url: "/users", icon: List },
        { title: "Add User", url: "/users/add", icon: PlusCircle },
      ],
    },
    {
      title: "Transaction",
      url: "/Transaction",
      icon: BadgeDollarSign,
      // children: [
      //   { title: "All Users", url: "/users", icon: List },
      //   { title: "Add User", url: "/users/add", icon: PlusCircle },
      // ],
    },
    {
      title: "Messages",
      url: "/messages",
      icon: Mails,
      // children: [
      //   { title: "All Users", url: "/users", icon: List },
      //   { title: "Add User", url: "/users/add", icon: PlusCircle },
      // ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const Navbar = {
    url: "/",
    src: "https://res.cloudinary.com/dnfahcxo3/image/upload/v1745082558/9c2d1352-17cf-40b9-b71d-f6f2393ec6a0.png",
    alt: "logo",
  };
  type UserType = {
    name: string;
    email: string;
    avatar: string;
  };
  const [User, setUser] = useState<UserType>({
    name: "",
    email: "",
    avatar: "",
  });
  useEffect(() => {
    try {
      const user = localStorage.getItem("admin");
      if (user) {
        setUser(JSON.parse(user));
      }
    } catch (error) {
      setUser({
        name: "",
        email: "",
        avatar: "",
      });
    }
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarMenu className="w-[100px]  h-[100px]">
        <a href={Navbar.url} className="h-[100%] w-[100%]">
          <img src={Navbar.src} alt="" className="w-full" />
        </a>
      </SidebarMenu>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={User} />
      </SidebarFooter>
    </Sidebar>
  );
}
