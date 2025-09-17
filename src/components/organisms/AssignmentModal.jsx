import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const AssignmentModal = ({ isOpen, onClose, onSave, assignment = null, courses = [], selectedCourseId = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    maxPoints: ""
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        courseId: assignment.courseId || "",
        dueDate: assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy-MM-dd") : "",
        priority: assignment.priority || "medium",
        maxPoints: assignment.maxPoints?.toString() || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        courseId: selectedCourseId || "",
        dueDate: format(new Date(), "yyyy-MM-dd"),
        priority: "medium",
        maxPoints: ""
      });
    }
  }, [assignment, isOpen, selectedCourseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Assignment title is required");
      return;
    }
    
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }
    
    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }

    const assignmentData = {
      ...formData,
      maxPoints: formData.maxPoints ? parseFloat(formData.maxPoints) : null,
      completed: assignment?.completed || false,
      grade: assignment?.grade,
      Id: assignment?.Id
    };

    try {
      await onSave(assignmentData);
      toast.success(assignment ? "Assignment updated successfully" : "Assignment created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save assignment");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {assignment ? "Edit Assignment" : "Add New Assignment"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Assignment Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Chapter 5 Quiz"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Assignment details..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>

          <Select
            label="Course"
            value={formData.courseId}
            onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.Id} value={course.Id}>
                {course.name}
              </option>
            ))}
          </Select>

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>

          <Input
            label="Max Points (Optional)"
            type="number"
            min="0"
            step="0.01"
            value={formData.maxPoints}
            onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: e.target.value }))}
            placeholder="e.g., 100"
          />

          <div className="flex items-center space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {assignment ? "Update Assignment" : "Create Assignment"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AssignmentModal;