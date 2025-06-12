"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Paperclip, Mic, Send, Minus, AwardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import Pusher from "pusher-js";

export default function MessagesClient({
  isOpen = true,
  onClose,
  sender_id,
  receiver_id,
  username,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  sender_id: number;
  receiver_id: number;
  username: string;
}) {
  const [message, setMessage] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 500); // Delay unmounting after animation
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://real-estate-clientside2.onrender.com/messages?action=get-messages&sender_id=${sender_id}&receiver_id=${receiver_id}`
        );
        // Ensure the response is an array
        setMessage(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessage([]); // fallback to empty array on error
      }
    };
    fetchMessages();

    const pusher = new Pusher("b5f97a526b071a7c2c0c", { cluster: "ap1" });
    const channel = pusher.subscribe("chat-channel");
    channel.bind("new-messages", function (data: any) {
      if (
        (data.sender_id === sender_id && data.receiver_id === receiver_id) ||
        (data.sender_id === receiver_id && data.receiver_id === sender_id)
      ) {
        setMessage((prev) => [...prev, data]);
      }
    });
    return () => {
      pusher.unsubscribe("chat-channel");
    };
  }, [sender_id, receiver_id]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const newMessage = {
        sender_id: sender_id,
        receiver_id: receiver_id,
        content: input,
      };

      await axios.post(
        "https://real-estate-clientside2.onrender.com/messages?action=send-message",
        newMessage,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage((prev) => [...prev, { ...newMessage }]);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  return (
    <Card
      className={`w-full bg-gray-200 duration-[0.10s] fixed bottom-[-50px] right-[10px] z-[1000] max-w-md h-[96vh] flex flex-col rounded-[20px] overflow-hidden transition-transform ${
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="flex justify-between border-b border-black pb-5  items-center  px-4 ">
        <img
          className="w-[70px] "
          src="https://res.cloudinary.com/dnfahcxo3/image/upload/v1745082558/9c2d1352-17cf-40b9-b71d-f6f2393ec6a0.png"
          alt=""
        />
        <Button
          variant="default"
          onClick={onClose}
          className="rounded-full text-black w-0 h-0 hover:bg-transparent shadow-none cursor-pointer bg-transparent scale-[2.2] "
        >
          <Minus />
        </Button>
      </div>

      {/* Chat content area */}
      <div className=" overflow-y-auto p-4 ">
        {message.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender_id === sender_id ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`${
                msg.sender_id === sender_id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-black"
              } rounded-2xl p-3 max-w-xs`}
            >
              <p>{msg.content}</p>
              <span className="text-xs text-gray-500">
                {msg.sent_at || "Just now"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-2 absolute bottom-0 w-full">
        <div className="flex items-center gap-2 bg-white rounded-full border p-1 pl-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 outline-none text-sm"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-10 cursor-pointer w-10 rounded-full bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
