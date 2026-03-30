"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-md p-6 shadow-2xl pointer-events-auto custom-scrollbar",
                className
              )}
            >
              <div className="flex items-center justify-between mx-auto mb-6">
                <h2 className="text-xl font-heading font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
