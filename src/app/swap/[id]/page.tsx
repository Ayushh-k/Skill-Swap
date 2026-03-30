"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { io as ClientIO, Socket } from "socket.io-client";
import Navbar from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, Paperclip, Video, Phone, DownloadCloud, Check, CheckCheck, Smile, Reply, Trash2, Copy, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

type Message = {
  _id?: string;
  swapId: string;
  senderId: string;
  text: string;
  type?: "text" | "file" | "system";
  fileUrl?: string;
  isRead?: boolean;
  replyTo?: { _id: string; text: string; senderId: string; isDeleted?: boolean } | null;
  reactions?: Record<string, string>;
  isDeleted?: boolean;
  _optimisticReplyTo?: { text: string; senderId: string; isDeleted?: boolean } | null;
};

export default function SwapChat() {
  const { id } = useParams() as { id: string };

  // Use refs for socket + userId so callbacks always get latest values
  const socketRef = useRef<Socket | null>(null);
  const userIdRef = useRef<string>("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [peer, setPeer] = useState<{ name: string; _id: string; avatar?: string; email?: string; bio?: string; skillsOffered?: string[]; skillsWanted?: string[] } | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat Action States
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);
  const emojiList = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  // Call States
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [callType, setCallType] = useState<"video" | "audio">("video");

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // ---- Action handlers use refs to avoid stale closures ----
  const deleteMessage = useCallback((messageId: string) => {
    const sock = socketRef.current;
    const uid = userIdRef.current;
    if (!sock || !uid) return;
    // Optimistic local update immediately
    setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDeleted: true, text: "This message was deleted." } : m));
    sock.emit("delete_message", { messageId, swapId: id, userId: uid });
  }, [id]);

  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    const sock = socketRef.current;
    const uid = userIdRef.current;
    if (!sock || !uid) return;
    setShowEmojiPickerFor(null);
    // Optimistic local update
    setMessages(prev => prev.map(m => {
      if (m._id !== messageId) return m;
      const currentReactions = { ...(m.reactions || {}) };
      if (currentReactions[uid] === emoji) {
        delete currentReactions[uid];
      } else {
        currentReactions[uid] = emoji;
      }
      return { ...m, reactions: currentReactions };
    }));
    sock.emit("react_message", { messageId, swapId: id, userId: uid, emoji });
  }, [id]);

  useEffect(() => {
    async function init() {
      const meRes = await fetch("/api/users/me");
      let currentUserId = "";
      if (meRes.ok) {
        const meData = await meRes.json();
        setUserId(meData.id);
        userIdRef.current = meData.id;
        currentUserId = meData.id;
      }

      const swapRes = await fetch(`/api/swaps/${id}`);
      if (swapRes.ok) {
        const swapData = await swapRes.json();
        const other = swapData.requester._id === currentUserId ? swapData.receiver : swapData.requester;
        setPeer(other);
      }

      const msgRes = await fetch(`/api/messages?swapId=${id}`);
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
        setTimeout(scrollToBottom, 200);
      }
    }
    init();

    const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL || "", {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      socketInstance.emit("join_swap", id);
      // Mark existing messages as read
      if (userIdRef.current) {
        socketInstance.emit("mark_read", { swapId: id, userId: userIdRef.current });
      }
    });

    socketInstance.on("receive_message", (message: Message) => {
      setMessages((prev) => {
        // Replace optimistic message (no real _id) with server message and keep _optimisticReplyTo
        const optimisticIdx = prev.findIndex(m => !m._id && m.text === message.text && m.senderId === message.senderId);
        if (optimisticIdx !== -1) {
          const optimistic = prev[optimisticIdx];
          const updated = [...prev];
          updated[optimisticIdx] = {
            ...message,
            _optimisticReplyTo: optimistic._optimisticReplyTo ?? null,
          };
          return updated;
        }
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });

      const currentId = userIdRef.current;
      if (message.senderId !== currentId) {
        socketInstance.emit("mark_read", { swapId: id, userId: currentId });
        toast(`New Message: ${message.text.substring(0, 30)}...`);
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const playOsci = (freq: number, startTime: number) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = "sine";
              osc.frequency.value = freq;
              osc.connect(gain);
              gain.connect(ctx.destination);
              gain.gain.setValueAtTime(0, startTime);
              gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
              gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
              osc.start(startTime);
              osc.stop(startTime + 0.4);
            };
            playOsci(523.25, ctx.currentTime);
            playOsci(659.25, ctx.currentTime + 0.15);
          }
        } catch(e) {}
      }
      setTimeout(scrollToBottom, 50);
    });

    socketInstance.on("messages_read", ({ readerId }: { readerId: string }) => {
      const currentId = userIdRef.current;
      if (readerId !== currentId) {
        setMessages(prev => prev.map(m => m.senderId === currentId ? { ...m, isRead: true } : m));
      }
    });

    // Live reaction updates from server (confirms/syncs)
    socketInstance.on("message_reacted", ({ messageId, reactions }: { messageId: string; reactions: Record<string, string> }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, reactions } : m));
    });

    // Live delete confirmation from server
    socketInstance.on("message_deleted", (messageId: string) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDeleted: true, text: "This message was deleted." } : m));
    });

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [id]);

  const saveAndEmitMessage = async (msgData: any) => {
    const optimisticId = `optimistic_${Date.now()}`;
    // Optimistic UI Update — include _optimisticReplyTo so it shows immediately
    setMessages(prev => [...prev, {
      ...msgData,
      _id: optimisticId,
      _optimisticReplyTo: msgData._optimisticReplyTo ?? null,
    }]);
    setTimeout(scrollToBottom, 50);

    try {
      const bodyToSend = { ...msgData };
      delete bodyToSend._optimisticReplyTo; // don't send internal field to API
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyToSend),
      });
      const savedMsg = await res.json();
      // Merge back the optimistic reply context before emitting so other user also sees it
      const toEmit = { ...savedMsg, _optimisticReplyTo: msgData._optimisticReplyTo ?? null };
      socketRef.current?.emit("send_message", toEmit);
      // Replace our own optimistic message with the saved one
      setMessages(prev => prev.map(m => m._id === optimisticId ? toEmit : m));
    } catch (err) {
      toast.error("Failed to send message securely.");
      setMessages(prev => prev.filter(m => m._id !== optimisticId));
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current || !userIdRef.current) return;
    const msgData: any = { swapId: id, senderId: userIdRef.current, text: input, type: "text" };
    if (replyingTo && replyingTo._id) {
      msgData.replyTo = replyingTo._id;
      msgData._optimisticReplyTo = {
        senderId: replyingTo.senderId,
        text: replyingTo.text,
        isDeleted: replyingTo.isDeleted,
      };
    }
    setInput("");
    setReplyingTo(null);
    await saveAndEmitMessage(msgData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("File is too large! Keep it under 5MB.");
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      await saveAndEmitMessage({
        swapId: id,
        senderId: userIdRef.current,
        text: `Sent an attachment: ${file.name}`,
        type: "file",
        fileUrl: base64Data,
      });
    };
    reader.readAsDataURL(file);
  };

  const joinCall = (type: "video" | "audio") => {
    setCallType(type);
    setIsVideoCallOpen(true);
  };

  const startCall = (type: "video" | "audio") => {
    joinCall(type);
    saveAndEmitMessage({ swapId: id, senderId: userIdRef.current, text: `Started a ${type} call. Click the button below to join!`, type: "system" });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col pt-16">
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-5xl relative z-10">
        <div className="absolute top-[10%] left-[-10%] w-[30vw] h-[30vw] min-w-[300px] rounded-full bg-accent-indigo/10 blur-[150px] -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10 w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link href="/dashboard" className="rounded-full p-2 border border-white/10 bg-surface hover:bg-white/5 transition-colors text-white mr-1 shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {peer ? (
              <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-3 overflow-hidden text-left hover:bg-white/5 p-1.5 -ml-1.5 rounded-xl transition-colors cursor-pointer group">
                <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full bg-gradient-to-br from-accent-indigo to-accent-teal flex items-center justify-center text-white font-bold text-lg uppercase shadow-inner border border-white/10 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-shadow relative overflow-hidden">
                  {peer.avatar ? <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" /> : peer.name[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight leading-tight truncate">{peer.name}</span>
                  <span className="text-xs text-accent-teal font-medium flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" /> Online
                  </span>
                </div>
              </button>
            ) : (
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight truncate">Active Swap Chat</h1>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-2 border-accent-indigo/40 text-accent-indigo hover:text-white hover:bg-accent-indigo/20 shadow-lg" onClick={() => startCall('audio')}>
              <Phone className="w-4 h-4" /><span className="hidden sm:inline">Voice</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-accent-teal/40 text-accent-teal hover:text-white hover:bg-accent-teal/20 shadow-lg" onClick={() => startCall('video')}>
              <Video className="w-4 h-4" /><span className="hidden sm:inline">Video</span>
            </Button>
          </div>
        </div>

        <Card className="flex-1 flex flex-col min-h-[60vh] max-h-[75vh] bg-surface/30 border border-white/10 relative overflow-hidden backdrop-blur-xl mb-4">
          <div ref={scrollContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-3 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-foreground/50 italic text-sm space-y-2">
                <div className="p-4 rounded-full bg-white/5"><Send className="w-8 h-8 text-accent-teal opacity-50" /></div>
                <p>No messages yet. Send a greeting to start coordinating your swap!</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const rep = msg.replyTo || msg._optimisticReplyTo;
                return (
                  <div key={msg._id || i} className={`flex ${msg.type === "system" ? "justify-center w-full" : msg.senderId === userId ? "justify-end" : "justify-start"} mb-1`}>
                    {msg.type === "system" ? (
                      <div className="flex flex-col items-center gap-2 my-1 w-full">
                        <div className="bg-white/5 text-foreground/70 text-[10px] sm:text-xs px-4 py-1.5 rounded-full border border-white/5 max-w-[90%] text-center italic">{msg.text}</div>
                        {msg.text.includes("Started a") && (
                          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-2 border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10 animate-pulse" onClick={() => joinCall(msg.text.includes("video") ? "video" : "audio")}>
                             {msg.text.includes("video") ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                             Join Call
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="relative group/msg flex flex-col max-w-[85%] sm:max-w-[70%]">

                        {/* Floating Action Toolbar */}
                        {msg._id && !msg.isDeleted && (
                          <div className={`absolute top-1 ${msg.senderId === userId ? "right-full pr-2" : "left-full pl-2"} opacity-0 group-hover/msg:opacity-100 transition-all duration-150 flex items-center gap-1 bg-surface/90 backdrop-blur-md rounded-lg p-1 border border-white/10 shadow-xl z-20 whitespace-nowrap`}>
                            <button onClick={() => setReplyingTo(msg)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-foreground/60 hover:text-white" title="Reply">
                              <Reply className="w-3.5 h-3.5" />
                            </button>
                            {msg.type !== "file" && (
                              <button onClick={() => { navigator.clipboard.writeText(msg.text); toast.success("Copied!"); }} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-foreground/60 hover:text-white" title="Copy">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <div className="relative">
                              <button onClick={() => setShowEmojiPickerFor(prev => prev === msg._id ? null : msg._id!)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-foreground/60 hover:text-white" title="React">
                                <Smile className="w-3.5 h-3.5" />
                              </button>
                              {showEmojiPickerFor === msg._id && (
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 flex bg-surface border border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 gap-0.5">
                                  {emojiList.map(em => (
                                    <button key={em} onClick={() => reactToMessage(msg._id!, em)} className="p-1 hover:bg-white/20 rounded-full text-base transition-transform hover:scale-125 active:scale-95">{em}</button>
                                  ))}
                                </div>
                              )}
                            </div>
                            {msg.senderId === userId && (
                              <button onClick={() => deleteMessage(msg._id!)} className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors text-red-400/70 hover:text-red-400" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Bubble */}
                        <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm relative overflow-visible
                          ${msg.senderId === userId
                            ? "bg-gradient-to-br from-accent-indigo to-accent-teal text-white rounded-br-none"
                            : "bg-white/10 text-foreground border border-white/5 rounded-bl-none"}
                          ${msg.reactions && Object.keys(msg.reactions).length > 0 ? "mb-4" : ""}`}>

                          {/* Reply Quote */}
                          {rep && (
                            <div className="text-xs bg-black/25 px-2.5 py-1.5 rounded-lg mb-2 border-l-2 border-white/30 flex flex-col gap-0.5 max-w-full">
                              <span className="font-semibold text-white/80">{rep.senderId === userId ? "You" : peer?.name}</span>
                              <span className="opacity-60 truncate">{rep.isDeleted ? "This message was deleted" : rep.text}</span>
                            </div>
                          )}

                          {/* Content */}
                          {msg.isDeleted ? (
                            <span className="italic opacity-40 flex items-center gap-1.5 text-xs"><Trash2 className="w-3 h-3" /> This message was deleted</span>
                          ) : msg.type === "file" && msg.fileUrl ? (
                            <div className="flex flex-col gap-2">
                              <span className="font-semibold text-xs opacity-70 flex items-center gap-1"><Paperclip className="w-3 h-3" /> Attachment</span>
                              {msg.fileUrl.startsWith("data:image") ? (
                                <div className="relative group/img max-w-[300px]">
                                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border border-white/10 shadow-lg mt-1 cursor-zoom-in">
                                    <img src={msg.fileUrl} alt="attachment" className="w-full object-contain transition-transform duration-300 group-hover/img:scale-105" />
                                  </a>
                                  <a 
                                    href={msg.fileUrl} 
                                    download={`image_${new Date().getTime()}.png`}
                                    className="absolute bottom-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-black/80 shadow-xl"
                                    title="Download Image"
                                  >
                                    <DownloadCloud className="w-4 h-4" />
                                  </a>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors group/file">
                                    <Paperclip className="w-5 h-5 opacity-80 shrink-0" />
                                    <span className="underline truncate max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm font-medium">{msg.text.replace("Sent an attachment: ", "")}</span>
                                    <DownloadCloud 
                                      className="w-4 h-4 ml-auto opacity-40 group-hover/file:opacity-100 transition-opacity cursor-pointer" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const link = document.createElement('a');
                                        link.href = msg.fileUrl!;
                                        link.download = msg.text.replace("Sent an attachment: ", "");
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                      }}
                                    />
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                          )}

                          {/* Read Receipts */}
                          {msg.senderId === userId && !msg.isDeleted && (
                            <div className="flex justify-end mt-1.5">
                              {msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-blue-300" /> : <Check className="w-3.5 h-3.5 text-white/40" />}
                            </div>
                          )}

                          {/* Reactions */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className={`absolute -bottom-4 ${msg.senderId === userId ? "right-2" : "left-2"} bg-surface/95 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg z-10`}>
                              <span className="text-sm">{Array.from(new Set(Object.values(msg.reactions))).slice(0, 3).join("")}</span>
                              <span className="text-[10px] text-foreground/60 font-medium">{Object.keys(msg.reactions).length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex flex-col bg-background/50 backdrop-blur-md border-t border-white/10">
            {/* Reply Banner */}
            {replyingTo && (
              <div className="px-4 py-2.5 flex items-center gap-3 border-b border-white/5 bg-surface/30 animate-in slide-in-from-bottom-2 duration-150">
                <div className="w-0.5 h-8 bg-accent-indigo rounded-full shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-accent-indigo">{replyingTo.senderId === userId ? "Replying to yourself" : `Replying to ${peer?.name}`}</span>
                  <span className="text-xs text-foreground/60 truncate mt-0.5">{replyingTo.isDeleted ? "Deleted message" : replyingTo.text}</span>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1.5 text-foreground/40 hover:text-white rounded-full hover:bg-white/5 transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="p-3 sm:p-4">
              <form onSubmit={sendMessage} className="flex items-center gap-2 sm:gap-3">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                <Button type="button" variant="ghost" className="shrink-0 text-white/60 hover:text-white px-3 flex items-center justify-center h-12" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={replyingTo ? "Write your reply..." : "Type your message..."}
                  className="flex-1 h-12 bg-white/5 border-white/10 focus-visible:ring-accent-teal/50 text-foreground"
                />
                <Button type="submit" className="shrink-0 w-12 h-12 px-0 flex items-center justify-center bg-accent-teal hover:bg-accent-teal/90 text-background shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  <Send className="w-5 h-5 ml-1" />
                </Button>
              </form>
            </div>
          </div>
        </Card>

        {/* Video/Audio Room */}
        <Modal isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)} title={`Secure ${callType === "video" ? "Video" : "Voice"} Room`} className="max-w-5xl h-[85vh] p-0 overflow-hidden flex flex-col bg-black">
          <iframe
            src={`https://meet.jit.si/skillswap-room-${id}#config.startVideoMuted=${callType === "audio"}&config.startAudioOnly=${callType === "audio"}&interfaceConfigOverwrite.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fittowindow","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]`}
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write; self; https://meet.jit.si"
            className="w-full flex-1 border-0 rounded-b-xl min-h-[500px]"
          />
        </Modal>

        {/* Contact Profile Modal */}
        <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Contact Info" className="max-w-md">
          <div className="space-y-6 pt-2">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent-indigo to-accent-teal flex items-center justify-center text-white font-bold text-4xl shadow-inner border border-white/10 relative overflow-hidden shrink-0">
                {peer?.avatar ? <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" /> : (peer?.name[0] || "?")}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{peer?.name}</h2>
                <p className="text-sm text-foreground/60 mt-1">{peer?.email}</p>
              </div>
            </div>

            {peer?.bio && (
              <div className="bg-surface/50 p-4 rounded-xl border border-white/5">
                <p className="text-sm text-foreground/80 italic text-center leading-relaxed">"{peer.bio}"</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-accent-teal uppercase tracking-wider mb-2">Can Teach</h4>
                {peer?.skillsOffered && peer.skillsOffered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {peer.skillsOffered.map((s, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-md bg-accent-teal/10 text-accent-teal border border-accent-teal/20 shadow-sm">{s}</span>
                    ))}
                  </div>
                ) : <span className="text-xs text-foreground/50">Not specified</span>}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-accent-indigo uppercase tracking-wider mb-2">Wants to Learn</h4>
                {peer?.skillsWanted && peer.skillsWanted.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {peer.skillsWanted.map((s, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded-md bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20 shadow-sm">{s}</span>
                    ))}
                  </div>
                ) : <span className="text-xs text-foreground/50">Not specified</span>}
              </div>
            </div>
          </div>
        </Modal>

      </main>
    </div>
  );
}
