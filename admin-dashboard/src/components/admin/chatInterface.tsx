"use client";
import { useState } from "react";
import { Search, Settings, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/app/lib/utils/utils";

// Dummy data for UI preview
const DUMMY_CONVERSATIONS = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/assets/logo.png",
    isActive: true,
    time: "10:30 AM",
    lastMessage: "See you soon!",
    messages: [
      {
        id: 1,
        sender_role: "buyer",
        content: "Hello, I need more info.",
        time: "10:00 AM",
        avatar: "/assets/logo.png",
      },
      {
        id: 2,
        sender_role: "admin",
        content: "Sure! What would you like to know?",
        time: "10:01 AM",
        avatar: "/assets/favicon.ico",
      },
      {
        id: 3,
        sender_role: "buyer",
        content: "Is the property still available?",
        time: "10:02 AM",
        avatar: "/assets/logo.png",
      },
      {
        id: 4,
        sender_role: "admin",
        content: "Yes, it is available.",
        time: "10:03 AM",
        avatar: "/assets/favicon.ico",
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/assets/logo.png",
    isActive: false,
    time: "Yesterday",
    lastMessage: "Thank you!",
    messages: [
      {
        id: 1,
        sender_role: "buyer",
        content: "Can I schedule a visit?",
        time: "Yesterday",
        avatar: "/assets/logo.png",
      },
      {
        id: 2,
        sender_role: "admin",
        content: "Of course! Let me know your preferred time.",
        time: "Yesterday",
        avatar: "/assets/favicon.ico",
      },
    ],
  },
];

const ChatInterface = () => {
  const [conversations] = useState(DUMMY_CONVERSATIONS);
  const [activeChat, setActiveChat] = useState(DUMMY_CONVERSATIONS[0]);
  const [message, setMessage] = useState("");

  const handleConversationClick = (conversation: any) => {
    setActiveChat(conversation);
  };

  const handleSendMessage = () => {
    setMessage("");
  };

  return (
    <div className="flex w-full h-full">
      {/* Left sidebar - Conversation list */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 bg-gray-100 border-0"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {Array.isArray(conversations) && conversations.length > 0 ? (
            conversations.map((conversation: any) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50",
                  activeChat?.id === conversation.id && "bg-gray-50"
                )}
                onClick={() => handleConversationClick(conversation)}
              >
                <Avatar className="h-10 w-10">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="h-full w-full object-cover"
                  />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">
                      {conversation.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 text-sm text-muted-foreground">
              No conversations available.
            </p>
          )}
        </div>
      </div>

      {/* Right side - Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        {activeChat && (
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div>
                <div className="font-medium">{activeChat.name}</div>
                <div className="text-xs text-muted-foreground">
                  {activeChat.isActive ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {activeChat?.messages?.map((msg: any) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.sender_role === "admin" && "justify-end"
              )}
            >
              {msg.sender_role === "buyer" && (
                <Avatar className="h-8 w-8 mt-1">
                  <img
                    src={msg.avatar}
                    alt="Client"
                    className="h-full w-full object-cover"
                  />
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[70%] space-y-1",
                  msg.sender_role === "admin" && "order-1"
                )}
              >
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    msg.sender_role === "admin"
                      ? "bg-blue-100 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  <p>{msg.content}</p>
                </div>
                <div
                  className={cn(
                    "text-xs text-muted-foreground",
                    msg.sender_role === "admin" ? "text-right" : "text-left"
                  )}
                >
                  {msg.time}
                </div>
              </div>
              {msg.sender_role === "admin" && (
                <Avatar className="h-8 w-8 mt-1">
                  <img
                    src={msg.avatar}
                    alt="Admin"
                    className="h-full w-full object-cover"
                  />
                </Avatar>
              )}
            </div>
          ))}
        </div>
        {/* Message input */}
        <div className="p-3 border-t flex items-center gap-2">
          <Input
            placeholder="Type a message"
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            className="rounded-full bg-blue-500 hover:bg-blue-600"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
            <span className="ml-1">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
