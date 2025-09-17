import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, subtitle, icon, variant = "default", trend }) => {
  const variants = {
    default: "border-gray-200",
    primary: "border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5",
    success: "border-success/20 bg-gradient-to-br from-success/5 to-green-400/5",
    warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-orange-400/5",
    accent: "border-accent/20 bg-gradient-to-br from-accent/5 to-pink-400/5"
  };

  const iconVariants = {
    default: "bg-gray-100 text-gray-600",
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-orange-600 text-white",
    accent: "bg-gradient-to-r from-accent to-pink-600 text-white"
  };

  return (
    <Card className={cn("hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]", variants[variant])}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              <ApperIcon 
                name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "w-4 h-4",
                  trend.direction === "up" ? "text-success" : "text-error"
                )} 
              />
              <span className={cn(
                "text-sm font-medium",
                trend.direction === "up" ? "text-success" : "text-error"
              )}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
            iconVariants[variant]
          )}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;