"use client";

import { useUserContext } from "@/context/userContext";
import { axiosClient } from "@/lib/axios-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Send, LogOut, Loader2, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { username, logout } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosClient.get<Message[]>("/chat/messages");
      setMessages(response.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: username,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axiosClient.post<Message>("/chat/send", message);
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again later.");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Enhanced Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 p-6 fixed w-full top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-7 h-7 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Welcome, {username}!
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 px-6 py-3 rounded-xl text-red-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 pt-24 pb-24 px-4 overflow-y-auto bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-5xl mx-auto">
          {isLoading && (
            <div className="flex justify-center items-center space-x-3 text-blue-400 py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-lg">Loading messages...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 text-red-400 p-6 rounded-xl mb-6 border border-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.15)] font-medium">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 rounded-xl ${
                    msg.sender === username
                      ? "bg-blue-500/10 ml-auto border border-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.15)]"
                      : "bg-gray-800/50 border border-gray-700/50 shadow-[0_0_25px_rgba(31,41,55,0.15)]"
                  } max-w-[85%] transition-all duration-300 hover:shadow-lg backdrop-blur-sm`}
                >
                  <div className="font-semibold text-base text-blue-400">
                    {msg.sender}
                  </div>
                  <div className="mt-2 text-gray-100 text-lg leading-relaxed">
                    {msg.content}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 flex flex-col items-center space-y-4 py-12">
                <MessageSquare className="w-12 h-12" />
                <p className="text-xl font-medium">No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="p-6 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50 fixed bottom-0 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] font-medium text-lg"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}