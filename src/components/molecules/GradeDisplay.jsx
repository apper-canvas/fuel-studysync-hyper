import React from "react";
import { cn } from "@/utils/cn";

const GradeDisplay = ({ grade, size = "md", showPercentage = true }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "grade-a";
    if (grade >= 80) return "grade-b";
    if (grade >= 70) return "grade-c";
    if (grade >= 60) return "grade-d";
    return "grade-f";
  };

  const getGradeLetter = (grade) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
    xl: "w-20 h-20 text-2xl"
  };

  if (grade === null || grade === undefined) {
    return (
      <div className={cn(
        "flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-medium",
        sizes[size]
      )}>
        --
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={cn(
        "flex items-center justify-center rounded-full text-white font-bold shadow-lg",
        getGradeColor(grade),
        sizes[size]
      )}>
        {getGradeLetter(grade)}
      </div>
      {showPercentage && (
        <span className="text-sm font-semibold text-gray-700">
          {grade.toFixed(1)}%
        </span>
      )}
    </div>
  );
};

export default GradeDisplay;