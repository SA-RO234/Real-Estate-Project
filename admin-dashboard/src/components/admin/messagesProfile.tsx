import React from "react";
import Image from "next/image";
import { Message } from "./messages";
const MessagesProfile = ({message}:{message: Message}) => {
  return (
    <div className="flex cursor-pointer items-center gap-3">
      <div className="relative">
        <Image
          src="https://res.cloudinary.com/dnfahcxo3/image/upload/v1746976988/eb902573-6af2-4244-a3d5-d6593aea6651.png"
          alt={message.sender_name}
          width={40}
          height={40}
          className="rounded-full h-[50px] w-[50px] object-cover"
        />
        {/* {message.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
        )} */}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">Sun Rosa</p>
        <p className="text-sm text-gray-500 truncate">
          Lorem, ipsum. Lorem, ipsum dolor.
        </p>
      </div>

      <div className="text-[20px] font-bold text-gray-500">
        {message.send_at}
      </div>
    </div>
  );
};

export default MessagesProfile;
