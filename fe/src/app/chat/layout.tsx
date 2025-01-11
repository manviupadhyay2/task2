"use client";

import { useUserContext } from "@/context/userContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useUserContext();

  useEffect(() => {
    if (!id) {
      redirect('/');
    }
  }, [id]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {children}
    </div>
  );
}