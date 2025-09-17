import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  variant = "default",
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg";
  
  const variants = {
    default: "p-6",
    compact: "p-4",
    padded: "p-8",
    gradient: "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 p-6"
  };
  
  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;