"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL || "", {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", async () => {
      setIsConnected(true);
      
      // Get current user to join their private room
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
           const user = await res.json();
           socketInstance.emit("join_user", user.id);
        }
      } catch (err) {}
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Global Notification Listeners
    socketInstance.on("notif_new_swap", (data: any) => {
      toast.success(`New Swap Request!`, {
        description: `${data.senderName} wants to learn ${data.requestedSkill}`,
        action: {
          label: "View Dashboard",
          onClick: () => router.push("/dashboard"),
        },
        duration: 8000,
      });
    });

    socketInstance.on("notif_swap_updated", (data: any) => {
      const statusColor = data.status === "accepted" ? "text-accent-teal" : "text-red-400";
      toast.info(`Swap Request ${data.status}`, {
        description: (
           <span>Your request to swap with <strong>{data.receiverName}</strong> was {data.status}.</span>
        ),
        action: data.status === "accepted" ? {
          label: "Start Chat",
          onClick: () => router.push(`/swap/${data.swapId}`),
        } : undefined,
        duration: 8000,
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [router]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
