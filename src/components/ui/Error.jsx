import React from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  className, 
  error = "Something went wrong", 
  onRetry, 
  title = "Oops!" 
}) => {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Card className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} className="w-full">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Error;