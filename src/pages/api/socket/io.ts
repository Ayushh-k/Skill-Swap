import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types/socket";
import dbConnect from "@/lib/db";
import { Message } from "@/models/Message";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join_swap", (swapId: string) => {
        socket.join(swapId);
      });

      socket.on("send_message", (data: any) => {
        // Broadcast the already-saved message payload to the room
        io.to(data.swapId).emit("receive_message", data);
      });

      socket.on("mark_read", async ({ swapId, userId }: { swapId: string, userId: string }) => {
        try {
          await dbConnect();
          await Message.updateMany(
             { swapId, senderId: { $ne: userId }, isRead: false },
             { $set: { isRead: true } }
          );
          io.to(swapId).emit("messages_read", { swapId, readerId: userId });
        } catch (err) {
          console.error("Failed to mark messages as read", err);
        }
      });

      socket.on("delete_message", async ({ messageId, swapId, userId }: any) => {
        try {
          await dbConnect();
          const msg = await Message.findOneAndUpdate(
            { _id: messageId, senderId: userId }, 
            { isDeleted: true, text: "This message was deleted." }, 
            { new: true }
          );
          if(msg) io.to(swapId).emit("message_deleted", messageId);
        } catch (err) {}
      });

      socket.on("react_message", async ({ messageId, swapId, userId, emoji }: any) => {
        try {
          await dbConnect();
          const msg = await Message.findById(messageId);
          if (msg) {
             if (!msg.reactions) msg.reactions = new Map();
             if (msg.reactions.get(userId.toString()) === emoji) {
                 msg.reactions.delete(userId.toString());
             } else {
                 msg.reactions.set(userId.toString(), emoji);
             }
             await msg.save();
             io.to(swapId).emit("message_reacted", { messageId, reactions: Object.fromEntries(msg.reactions) });
          }
        } catch (err) {}
      });

      socket.on("join_user", (userId: string) => {
        socket.join(`user_${userId}`);
      });

      socket.on("new_swap_request", (data: any) => {
        // Emit to the receiver's private room
        io.to(`user_${data.receiverId}`).emit("notif_new_swap", data);
      });

      socket.on("swap_status_updated", (data: any) => {
        // Notify the requester that their request was accepted/rejected
        io.to(`user_${data.requesterId}`).emit("notif_swap_updated", data);
      });

      socket.on("disconnect", () => {});
    });
  }
  res.end();
};

export default ioHandler;
