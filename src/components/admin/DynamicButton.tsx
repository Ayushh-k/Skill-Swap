"use client";

import React from "react";
import "./DynamicButton.css";

interface DynamicButtonProps {
  label: string;
  topDrawerText?: string;
  bottomDrawerText?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function DynamicButton({
  label,
  topDrawerText,
  bottomDrawerText,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: DynamicButtonProps) {
  return (
    <div className={`btn-container ${className}`}>
      {/* Top drawer */}
      {topDrawerText && (
        <div className="btn-drawer transition-top">{topDrawerText}</div>
      )}

      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className="btn"
      >
        {/* Corner decorations */}
        <svg className="btn-corner" viewBox="0 0 32 32" width="32" height="32">
          <path d="M0 16 Q0 0 16 0" strokeWidth="2" />
        </svg>
        <svg className="btn-corner" viewBox="0 0 32 32" width="32" height="32">
          <path d="M0 16 Q0 0 16 0" strokeWidth="2" />
        </svg>
        <svg className="btn-corner" viewBox="0 0 32 32" width="32" height="32">
          <path d="M0 16 Q0 0 16 0" strokeWidth="2" />
        </svg>
        <svg className="btn-corner" viewBox="0 0 32 32" width="32" height="32">
          <path d="M0 16 Q0 0 16 0" strokeWidth="2" />
        </svg>

        <span className="btn-text">{disabled ? "Processing..." : label}</span>
      </button>

      {/* Bottom drawer */}
      {bottomDrawerText && (
        <div className="btn-drawer transition-bottom">{bottomDrawerText}</div>
      )}
    </div>
  );
}
