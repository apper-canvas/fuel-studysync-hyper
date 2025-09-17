import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Schedule from "@/components/pages/Schedule";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const CourseCard = ({ course, onEdit, onDelete, onAddAssignment, onViewNotes }) => {
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

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: course.color }}
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{course.name}</h3>
            <p className="text-gray-600 text-sm">{course.instructor}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {course.currentGrade ? (
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-lg",
              getGradeColor(course.currentGrade)
            )}>
              {getGradeLetter(course.currentGrade)}
            </div>
          ) : (
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-500 font-medium text-sm">
              --
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Credits</span>
          <Badge variant="primary">{course.credits} units</Badge>
        </div>
        {course.schedule && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Schedule</span>
            <span className="text-sm font-medium text-gray-900">
              {course.schedule.days?.join(", ")} {course.schedule.time}
            </span>
          </div>
        )}
        {course.currentGrade && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Grade</span>
            <span className="text-sm font-bold text-gray-900">
              {course.currentGrade.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

<div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddAssignment(course.Id)}
          className="flex-1 text-xs"
        >
          <ApperIcon name="Plus" className="w-3 h-3 mr-1" />
          Add Assignment
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewNotes(course.Id)}
          className="flex-1 text-xs"
        >
          <ApperIcon name="FileText" className="w-3 h-3 mr-1" />
          Notes
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(course)}
          className="px-3"
        >
          <ApperIcon name="Edit2" className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(course.Id)}
          className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CourseCard;