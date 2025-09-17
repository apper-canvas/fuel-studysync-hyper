import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-success/10 to-green-400/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-orange-400/10 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-400/10 text-error border border-error/20",
    accent: "bg-gradient-to-r from-accent/10 to-pink-400/10 text-accent border border-accent/20",
    high: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
    medium: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm",
    low: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
  };
  
  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;