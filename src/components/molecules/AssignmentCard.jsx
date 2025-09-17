import React from "react";
import { format, isToday, isPast, isTomorrow } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AssignmentCard = ({ assignment, course, onToggleComplete, onEdit, onDelete }) => {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = isPast(dueDate) && !assignment.completed;
  const isDueToday = isToday(dueDate);
  const isDueTomorrow = isTomorrow(dueDate);

  const getDueDateLabel = () => {
    if (isDueToday) return "Due Today";
    if (isDueTomorrow) return "Due Tomorrow";
    if (isOverdue) return "Overdue";
    return format(dueDate, "MMM dd");
  };

  const getDueDateVariant = () => {
    if (isOverdue) return "error";
    if (isDueToday) return "warning";
    if (isDueTomorrow) return "accent";
    return "default";
  };

  const getPriorityVariant = () => {
    switch (assignment.priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg group",
      assignment.completed && "opacity-75 bg-gray-50",
      assignment.priority === "high" && "priority-high",
      assignment.priority === "medium" && "priority-medium",
      assignment.priority === "low" && "priority-low"
    )}>
      <div className="flex items-start space-x-4">
        <div className="pt-1">
          <Checkbox
            checked={assignment.completed}
            onChange={() => onToggleComplete(assignment.Id)}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold text-gray-900 text-lg transition-all duration-200",
                assignment.completed && "line-through text-gray-500"
              )}>
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                <span 
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: course?.color }}
                />
                <span>{course?.name}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(assignment)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(assignment.Id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {assignment.description && (
            <p className={cn(
              "text-sm text-gray-600 mb-3",
              assignment.completed && "line-through"
            )}>
              {assignment.description}
            </p>
          )}

          <div className="flex items-center space-x-3">
            <Badge variant={getDueDateVariant()}>
              <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
              {getDueDateLabel()}
            </Badge>
            <Badge variant={getPriorityVariant()}>
              {assignment.priority} priority
            </Badge>
            {assignment.grade !== undefined && assignment.maxPoints && (
              <Badge variant="success">
                {assignment.grade}/{assignment.maxPoints} pts
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AssignmentCard;