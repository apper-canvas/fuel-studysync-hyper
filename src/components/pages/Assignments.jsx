import React, { useState, useEffect } from "react";
import { format, isToday, isPast, isTomorrow } from "date-fns";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Assignments = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (assignmentId) => {
    try {
      const updatedAssignment = await assignmentService.toggleComplete(assignmentId);
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? updatedAssignment : a
      ));
      toast.success("Assignment updated successfully");
    } catch (error) {
      toast.error("Failed to update assignment");
    }
  };

  const handleSaveAssignment = async (assignmentData) => {
    if (selectedAssignment) {
      const updatedAssignment = await assignmentService.update(selectedAssignment.Id, assignmentData);
      setAssignments(prev => prev.map(a => a.Id === selectedAssignment.Id ? updatedAssignment : a));
    } else {
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
    }
    setSelectedAssignment(null);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.delete(assignmentId);
        setAssignments(prev => prev.filter(a => a.Id !== assignmentId));
        toast.success("Assignment deleted successfully");
      } catch (error) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleCloseModal = () => {
    setShowAssignmentModal(false);
    setSelectedAssignment(null);
  };

  // Filter and sort assignments
  const filteredAndSortedAssignments = assignments
    .filter(assignment => {
      const course = courses.find(c => c.Id === assignment.courseId);
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = !filterCourse || assignment.courseId.toString() === filterCourse;
      const matchesPriority = !filterPriority || assignment.priority === filterPriority;
      const matchesStatus = filterStatus === "all" || 
                          (filterStatus === "completed" && assignment.completed) ||
                          (filterStatus === "pending" && !assignment.completed);
      
      return matchesSearch && matchesCourse && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "course":
          const courseA = courses.find(c => c.Id === a.courseId)?.name || "";
          const courseB = courses.find(c => c.Id === b.courseId)?.name || "";
          return courseA.localeCompare(courseB);
        default:
          return 0;
      }
    });

  // Get assignment stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
  const pendingAssignments = assignments.filter(a => !a.completed).length;
  const overdueAssignments = assignments.filter(a => 
    !a.completed && new Date(a.dueDate) < new Date()
  ).length;

  if (loading) return <Loading variant="assignments" />;
  if (error) return <Error error={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your academic assignments
          </p>
        </div>
        <Button onClick={() => setShowAssignmentModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <Badge variant="primary">Total: {totalAssignments}</Badge>
        <Badge variant="success">Completed: {completedAssignments}</Badge>
        <Badge variant="warning">Pending: {pendingAssignments}</Badge>
        {overdueAssignments > 0 && (
          <Badge variant="error">Overdue: {overdueAssignments}</Badge>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="relative lg:col-span-2">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
          />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.Id} value={course.Id}>
              {course.name}
            </option>
          ))}
        </Select>

        <Select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </Select>

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="course">Sort by Course</option>
        </Select>
      </div>

      {/* Assignments List */}
      {filteredAndSortedAssignments.length === 0 && assignments.length === 0 ? (
        <Empty
          icon="FileText"
          title="No assignments yet"
          description="Start by adding your first assignment to track your academic work"
          actionLabel="Add Assignment"
          onAction={() => setShowAssignmentModal(true)}
        />
      ) : filteredAndSortedAssignments.length === 0 ? (
        <Empty
          icon="Search"
          title="No assignments match your filters"
          description="Try adjusting your search criteria or filters to see more assignments"
        />
      ) : (
        <div className="space-y-4">
          {filteredAndSortedAssignments.map((assignment) => {
            const course = courses.find(c => c.Id === assignment.courseId);
            return (
              <AssignmentCard
                key={assignment.Id}
                assignment={assignment}
                course={course}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
              />
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseModal}
        onSave={handleSaveAssignment}
        assignment={selectedAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Assignments;