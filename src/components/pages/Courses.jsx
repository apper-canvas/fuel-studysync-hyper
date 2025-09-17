import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import CourseModal from "@/components/organisms/CourseModal";
import CourseCard from "@/components/molecules/CourseCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

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

  const handleSaveCourse = async (courseData) => {
    if (selectedCourse) {
      const updatedCourse = await courseService.update(selectedCourse.Id, courseData);
      setCourses(prev => prev.map(c => c.Id === selectedCourse.Id ? updatedCourse : c));
    } else {
      const newCourse = await courseService.create(courseData);
      setCourses(prev => [...prev, newCourse]);
    }
    setSelectedCourse(null);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This will also delete all associated assignments.")) {
      try {
        await courseService.delete(courseId);
        setCourses(prev => prev.filter(c => c.Id !== courseId));
        setAssignments(prev => prev.filter(a => a.courseId !== courseId));
        toast.success("Course deleted successfully");
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const handleAddAssignment = (courseId) => {
    setSelectedCourseId(courseId);
    setShowAssignmentModal(true);
  };

  const handleSaveAssignment = async (assignmentData) => {
    const newAssignment = await assignmentService.create(assignmentData);
    setAssignments(prev => [...prev, newAssignment]);
    setSelectedCourseId(null);
  };

  const handleCloseModals = () => {
    setShowCourseModal(false);
    setShowAssignmentModal(false);
    setSelectedCourse(null);
setSelectedCourseId(null);
  };

  const handleViewNotes = (courseId) => {
    navigate(`/courses/${courseId}/notes`);
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error error={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage your academic courses and track progress
          </p>
        </div>
        <Button onClick={() => setShowCourseModal(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 && !searchTerm ? (
        <Empty
          icon="BookOpen"
          title="No courses yet"
          description="Start by adding your first course to track your academic progress"
          actionLabel="Add Course"
          onAction={() => setShowCourseModal(true)}
        />
      ) : filteredCourses.length === 0 && searchTerm ? (
        <Empty
          icon="Search"
          title="No courses found"
          description={`No courses match "${searchTerm}". Try adjusting your search.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredCourses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onAddAssignment={handleAddAssignment}
              onViewNotes={handleViewNotes}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CourseModal
        isOpen={showCourseModal}
        onClose={handleCloseModals}
        onSave={handleSaveCourse}
        course={selectedCourse}
      />

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseModals}
        onSave={handleSaveAssignment}
        courses={courses}
        selectedCourseId={selectedCourseId}
      />
</div>
  );
};

export default Courses;