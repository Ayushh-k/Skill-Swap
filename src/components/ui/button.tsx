import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "premium"
  size?: "default" | "sm" | "lg"
  isLoading?: boolean
  topDrawer?: string
  bottomDrawer?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, topDrawer, bottomDrawer, ...props }, ref) => {
    if (variant === "premium") {
      return (
        <div className={cn("premium-btn-container", className)}>
          {topDrawer && <div className="btn-premium-drawer drawer-top">{topDrawer}</div>}
          <button
            ref={ref}
            disabled={isLoading || props.disabled}
            className="btn-premium"
            {...props}
          >
            {/* SVG Corners */}
            {[...Array(4)].map((_, i) => (
              <svg key={i} className="btn-premium-corner" viewBox="0 0 32 32" width="32" height="32">
                <path d="M0 16 Q0 0 16 0" strokeWidth="2" />
              </svg>
            ))}
            
            <span className="btn-premium-text">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
            </span>
          </button>
          {bottomDrawer && <div className="btn-premium-drawer drawer-bottom">{bottomDrawer}</div>}
        </div>
      )
    }

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 hover:opacity-80",
          {
            "bg-accent-indigo text-white shadow hover:bg-accent-indigo/90 focus-visible:ring-accent-indigo": variant === "default",
            "border border-white/10 bg-surface backdrop-blur-md shadow-sm hover:bg-white/5 focus-visible:ring-white/20": variant === "outline",
            "hover:bg-white/10 text-foreground focus-visible:ring-white/20": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
