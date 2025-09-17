import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuickAction = ({ icon, title, description, onClick, variant = "primary" }) => {
  return (
    <div className="text-center p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-all duration-200 hover:bg-primary/5 group cursor-pointer" onClick={onClick}>
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-200">
        <ApperIcon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default QuickAction;