import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CourseModal = ({ isOpen, onClose, onSave, course = null }) => {
const [formData, setFormData] = useState({
    name: "",
    title: "",
    instructor: "",
    description: "",
    credits: "",
    color: "#7C3AED",
    schedule: {
      days: [],
      time: "",
      location: ""
    }
  });

  const courseColors = [
    "#7C3AED", "#EC4899", "#10B981", "#F59E0B", "#EF4444",
    "#3B82F6", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
  ];

  const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    if (course) {
      setFormData({
name: course.name || "",
        title: course.title || "",
        instructor: course.instructor || "",
        description: course.description || "",
        credits: course.credits?.toString() || "",
        color: course.color || "#7C3AED",
        schedule: course.schedule || { days: [], time: "", location: "" }
      });
    } else {
      setFormData({
name: "",
        title: "",
        instructor: "",
        description: "",
        credits: "",
        color: "#7C3AED",
        schedule: { days: [], time: "", location: "" }
      });
    }
  }, [course, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Course name is required");
      return;
    }
    
    if (!formData.instructor.trim()) {
      toast.error("Instructor name is required");
      return;
    }
    
    if (!formData.credits || isNaN(formData.credits) || formData.credits <= 0) {
      toast.error("Please enter valid credits");
      return;
    }

    const courseData = {
      ...formData,
      credits: parseInt(formData.credits),
      Id: course?.Id
    };

    try {
      await onSave(courseData);
      toast.success(course ? "Course updated successfully" : "Course created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save course");
    }
  };

  const handleDayToggle = (day) => {
    const newDays = formData.schedule.days.includes(day)
      ? formData.schedule.days.filter(d => d !== day)
      : [...formData.schedule.days, day];
    
    setFormData(prev => ({
      ...prev,
      schedule: { ...prev.schedule, days: newDays }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {course ? "Edit Course" : "Add New Course"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
<Input
            label="Course Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Advanced Mathematics"
            required
          />
          
          <Input
            label="Course Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., MATH 301 - Advanced Calculus III"
          />

<Input
            label="Instructor"
            value={formData.instructor}
            onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
            placeholder="e.g., Dr. Smith"
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Course description, objectives, or additional details..."
            multiline
            rows={3}
          />

          <Input
            label="Credits"
            type="number"
            min="1"
            max="6"
            value={formData.credits}
            onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
            placeholder="e.g., 3"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Course Color
            </label>
            <div className="flex flex-wrap gap-2">
              {courseColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    formData.color === color 
                      ? "border-gray-800 scale-110 shadow-lg" 
                      : "border-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Schedule (Optional)
            </label>
            
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Days</span>
              <div className="flex flex-wrap gap-2">
                {dayOptions.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.schedule.days.includes(day)
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Time"
              value={formData.schedule.time}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                schedule: { ...prev.schedule, time: e.target.value }
              }))}
              placeholder="e.g., 10:00 AM - 11:30 AM"
            />

            <Input
              label="Location"
              value={formData.schedule.location}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                schedule: { ...prev.schedule, location: e.target.value }
              }))}
              placeholder="e.g., Room 201, Science Building"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {course ? "Update Course" : "Create Course"}
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

export default CourseModal;