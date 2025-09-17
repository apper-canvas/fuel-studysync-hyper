import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import GradeDisplay from "@/components/molecules/GradeDisplay";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { useGPA, calculateCourseGrade } from "@/hooks/useGPA";
import { toast } from "react-toastify";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    assignmentId: "",
    points: "",
    maxPoints: ""
  });

  const gpa = useGPA(courses, assignments, grades);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData, gradesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    
    if (!gradeForm.assignmentId || !gradeForm.points || !gradeForm.maxPoints) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const assignment = assignments.find(a => a.Id.toString() === gradeForm.assignmentId);
      const gradeData = {
        assignmentId: parseInt(gradeForm.assignmentId),
        courseId: assignment.courseId,
        points: parseFloat(gradeForm.points),
        maxPoints: parseFloat(gradeForm.maxPoints),
        weight: 1.0
      };

      const newGrade = await gradeService.create(gradeData);
      setGrades(prev => [...prev, newGrade]);

      // Update assignment with grade
      const updatedAssignment = {
        ...assignment,
        grade: parseFloat(gradeForm.points),
        maxPoints: parseFloat(gradeForm.maxPoints),
        completed: true
      };
      
      await assignmentService.update(assignment.Id, updatedAssignment);
      setAssignments(prev => prev.map(a => 
        a.Id === assignment.Id ? updatedAssignment : a
      ));

      // Recalculate course grade
      const courseAssignments = assignments.filter(a => a.courseId === assignment.courseId);
      const courseGrade = calculateCourseGrade(courseAssignments, grades);
      if (courseGrade !== null) {
        const updatedCourse = courses.find(c => c.Id === assignment.courseId);
        await courseService.update(assignment.courseId, {
          ...updatedCourse,
          currentGrade: courseGrade
        });
        setCourses(prev => prev.map(c => 
          c.Id === assignment.courseId ? { ...c, currentGrade: courseGrade } : c
        ));
      }

      toast.success("Grade added successfully");
      setShowGradeForm(false);
      setGradeForm({ assignmentId: "", points: "", maxPoints: "" });
    } catch (error) {
      toast.error("Failed to add grade");
    }
  };

  const filteredAssignments = selectedCourse 
    ? assignments.filter(a => a.courseId.toString() === selectedCourse)
    : assignments;

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  if (loading) return <Loading variant="stats" />;
  if (error) return <Error error={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">
            Track your academic performance and GPA
          </p>
        </div>
        <Button onClick={() => setShowGradeForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center" variant="gradient">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">{gpa.toFixed(2)}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Current GPA</h3>
            <p className="text-sm text-gray-600">4.0 scale</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {courses.length}
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Active Courses</h3>
            <p className="text-xs text-gray-500">This semester</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {assignments.filter(a => a.completed).length}/{assignments.length}
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Graded Assignments</h3>
            <p className="text-xs text-gray-500">Completion rate</p>
          </div>
        </Card>
      </div>

      {/* Course Filter */}
      <div className="max-w-xs">
        <Select
          label="Filter by Course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.Id} value={course.Id}>
              {course.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Courses and Grades */}
      {courses.length === 0 ? (
        <Empty
          icon="Award"
          title="No courses to grade"
          description="Add courses and assignments to start tracking grades"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(selectedCourse ? courses.filter(c => c.Id.toString() === selectedCourse) : courses)
            .map(course => {
              const courseAssignments = assignments.filter(a => a.courseId === course.Id);
              const gradedAssignments = courseAssignments.filter(a => a.completed && a.grade !== null);
              
              return (
                <Card key={course.Id}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.instructor}</p>
                      </div>
                    </div>
                    <GradeDisplay grade={course.currentGrade} size="md" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Credits</span>
                      <Badge variant="primary">{course.credits} units</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Assignments Graded</span>
                      <span className="font-medium text-gray-900">
                        {gradedAssignments.length}/{courseAssignments.length}
                      </span>
                    </div>

                    {gradedAssignments.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">Recent Grades</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {gradedAssignments.slice(-5).map(assignment => (
                            <div key={assignment.Id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 truncate mr-2">
                                {assignment.title}
                              </span>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className="font-medium text-gray-900">
                                  {assignment.grade}/{assignment.maxPoints}
                                </span>
                                <Badge 
                                  variant={
                                    (assignment.grade / assignment.maxPoints) >= 0.9 ? "success" :
                                    (assignment.grade / assignment.maxPoints) >= 0.8 ? "primary" :
                                    (assignment.grade / assignment.maxPoints) >= 0.7 ? "warning" : "error"
                                  }
                                  className="text-xs"
                                >
                                  {Math.round((assignment.grade / assignment.maxPoints) * 100)}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* Grade Entry Form Modal */}
      {showGradeForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add Grade</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowGradeForm(false)}
                className="p-2"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleAddGrade} className="space-y-4">
              <Select
                label="Assignment"
                value={gradeForm.assignmentId}
                onChange={(e) => setGradeForm(prev => ({ ...prev, assignmentId: e.target.value }))}
                required
              >
                <option value="">Select an assignment</option>
                {assignments
                  .filter(a => !a.completed || a.grade === null)
                  .map(assignment => {
                    const course = courses.find(c => c.Id === assignment.courseId);
                    return (
                      <option key={assignment.Id} value={assignment.Id}>
                        {assignment.title} ({course?.name})
                      </option>
                    );
                  })}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Points Earned"
                  type="number"
                  min="0"
                  step="0.01"
                  value={gradeForm.points}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, points: e.target.value }))}
                  placeholder="85"
                  required
                />

                <Input
                  label="Max Points"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={gradeForm.maxPoints}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, maxPoints: e.target.value }))}
                  placeholder="100"
                  required
                />
              </div>

              {gradeForm.points && gradeForm.maxPoints && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Percentage</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">
                        {Math.round((parseFloat(gradeForm.points) / parseFloat(gradeForm.maxPoints)) * 100)}%
                      </span>
                      <Badge variant="primary">
                        {getLetterGrade((parseFloat(gradeForm.points) / parseFloat(gradeForm.maxPoints)) * 100)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  Add Grade
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setShowGradeForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Grades;