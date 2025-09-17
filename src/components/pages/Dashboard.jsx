import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, addDays } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import QuickAction from "@/components/molecules/QuickAction";
import CourseModal from "@/components/organisms/CourseModal";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { useGPA } from "@/hooks/useGPA";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const gpa = useGPA(courses, assignments);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
      await assignmentService.toggleComplete(assignmentId);
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? { ...a, completed: !a.completed } : a
      ));
      toast.success("Assignment updated successfully");
    } catch (error) {
      toast.error("Failed to update assignment");
    }
  };

  const handleSaveCourse = async (courseData) => {
    const savedCourse = await courseService.create(courseData);
    setCourses(prev => [...prev, savedCourse]);
  };

  const handleSaveAssignment = async (assignmentData) => {
    const savedAssignment = await assignmentService.create(assignmentData);
    setAssignments(prev => [...prev, savedAssignment]);
  };

  // Get upcoming assignments (due in next 7 days, not completed)
  const upcomingAssignments = assignments
    .filter(a => !a.completed && new Date(a.dueDate) <= addDays(new Date(), 7))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Get today's classes
  const todayClasses = courses.filter(course => 
    course.schedule?.days?.includes(format(new Date(), "EEEE"))
  );

  // Calculate stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
  const overdueAssignments = assignments.filter(a => 
    !a.completed && new Date(a.dueDate) < new Date()
  ).length;
  const completionRate = totalAssignments > 0 ? 
    Math.round((completedAssignments / totalAssignments) * 100) : 0;

  if (loading) return <Loading variant="stats" />;
  if (error) return <Error error={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your studies today.
          </p>
        </div>
        <div className="hidden md:flex space-x-3">
          <Button 
            onClick={() => setShowCourseModal(true)}
            size="sm"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Course
          </Button>
          <Button 
            onClick={() => setShowAssignmentModal(true)}
            variant="secondary"
            size="sm"
          >
            <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
            Add Assignment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={gpa.toFixed(2)}
          subtitle="4.0 scale"
          icon="Award"
          variant="primary"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${completedAssignments}/${totalAssignments} assignments`}
          icon="CheckCircle"
          variant="success"
        />
        <StatCard
          title="Active Courses"
          value={courses.length}
          subtitle="This semester"
          icon="BookOpen"
          variant="accent"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueAssignments}
          subtitle="Need attention"
          icon="AlertTriangle"
          variant={overdueAssignments > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Assignments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming Assignments
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/assignments")}
            >
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {upcomingAssignments.length === 0 ? (
            <Empty 
              icon="CheckCircle"
              title="All caught up!"
              description="No upcoming assignments. Great job staying organized!"
              actionLabel="Add Assignment"
              onAction={() => setShowAssignmentModal(true)}
            />
          ) : (
            <div className="space-y-4">
              {upcomingAssignments.map(assignment => {
                const course = courses.find(c => c.Id === assignment.courseId);
                return (
                  <AssignmentCard
                    key={assignment.Id}
                    assignment={assignment}
                    course={course}
                    onToggleComplete={handleToggleComplete}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Classes */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Classes
            </h3>
            {todayClasses.length === 0 ? (
              <div className="text-center py-4">
                <ApperIcon name="Calendar" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No classes today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map(course => (
                  <div key={course.Id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-600">{course.schedule?.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <QuickAction
                icon="BookOpen"
                title="Add Course"
                description="Register a new course"
                onClick={() => setShowCourseModal(true)}
              />
              <QuickAction
                icon="FileText"
                title="New Assignment"
                description="Track upcoming work"
                onClick={() => setShowAssignmentModal(true)}
              />
              <QuickAction
                icon="Calendar"
                title="View Schedule"
                description="Check your timetable"
                onClick={() => navigate("/schedule")}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onSave={handleSaveCourse}
      />
      
      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onSave={handleSaveAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Dashboard;