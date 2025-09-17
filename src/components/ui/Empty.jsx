import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  className, 
  icon = "FileText", 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel,
  onAction 
}) => {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Card className="text-center max-w-md mx-auto" variant="gradient">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name={icon} className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="w-full">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Empty;