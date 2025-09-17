import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className, 
  checked, 
  onChange,
  label,
  ...props 
}, ref) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <div className={cn(
          "w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
          checked 
            ? "bg-gradient-to-r from-primary to-secondary border-primary shadow-sm" 
            : "border-gray-300 bg-white hover:border-primary/50",
          className
        )}>
          {checked && (
            <ApperIcon 
              name="Check" 
              className="w-3 h-3 text-white" 
            />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;