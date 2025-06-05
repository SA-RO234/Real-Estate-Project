"use client";
import { ChevronDown, ShoppingCart, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserNavigation({ setUser }: { setUser: (user: any) => void }) {
  const [user, setLocalUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storeUser = localStorage.getItem("user") || "";
      if (storeUser && storeUser !== "undefined" && storeUser !== "null") {
        const parsedUser = JSON.parse(storeUser);
        setLocalUser(parsedUser); // <-- update local state
        setUser(parsedUser); // <-- update parent state
      }
    }
    // Optionally: remove or update your console.log
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user")
    setLocalUser(null);
    setUser(null); // <-- This updates Navbar state immediately
    router.push("/");
  };

  return (
    <div className="flex bg-transparent  relative p-[20px]  top-0 items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-600 cursor-pointer text-white p-[0_100px]  border-0 border-red-600 outline-0 hover:bg-blue-600 hover:text-white rounded-full px-4 py-2 h-auto">
            <img
              className="w-[50px] rounded-full h-[50px] object-cover"
              src={user?.avatar}
              alt=""
            />
            <p className="name text-[18px] font-bold">{user?.name}</p>
            <ChevronDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 absolute top-0 right-[50px] z-[1000] mt-2 bg-white rounded-2xl shadow-lg border-0 p-2"
        >
          {/* <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl  cursor-pointer">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">My Orders</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer">
            <Heart className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">My Favorites</span>
          </DropdownMenuItem> */}
          <Link href="/Profile">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">My Profile</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
