import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { cn } from "@/utils/cn";

const Schedule = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weekDays = daysOfWeek.map((_, index) => addDays(currentWeek, index));

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

  const getClassesForDay = (dayName) => {
    return courses.filter(course => 
      course.schedule?.days?.includes(dayName)
    );
  };

  const getAssignmentsForDay = (date) => {
    return assignments.filter(assignment => 
      isSameDay(parseISO(assignment.dueDate), date)
    );
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => addDays(prev, direction * 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">
            View your weekly class schedule and assignment due dates
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm" onClick={goToCurrentWeek}>
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            This Week
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigateWeek(-1)}
        >
          <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-1" />
          Previous
        </Button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentWeek, "MMM dd")} - {format(addDays(currentWeek, 6), "MMM dd, yyyy")}
          </h2>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigateWeek(1)}
        >
          Next
          <ApperIcon name="ChevronRight" className="w-4 h-4 ml-1" />
        </Button>
      </Card>

      {/* Weekly Schedule Grid */}
      {courses.length === 0 && assignments.length === 0 ? (
        <Empty
          icon="Calendar"
          title="No schedule items"
          description="Add courses and assignments to see your weekly schedule"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDays.map((date, index) => {
            const dayName = daysOfWeek[index];
            const classes = getClassesForDay(dayName);
            const dayAssignments = getAssignmentsForDay(date);
            const isToday = isSameDay(date, new Date());

            return (
              <Card 
                key={date.toISOString()} 
                className={cn(
                  "min-h-[300px]",
                  isToday && "ring-2 ring-primary/20 border-primary/30"
                )}
              >
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{dayName}</h3>
                    {isToday && (
                      <Badge variant="primary" className="text-xs">Today</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{format(date, "MMM dd")}</p>
                </div>

                <div className="space-y-3">
                  {/* Classes */}
                  {classes.map(course => (
                    <div
                      key={`class-${course.Id}`}
                      className="p-3 rounded-lg border-l-4 bg-gray-50"
                      style={{ borderLeftColor: course.color }}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="font-medium text-sm text-gray-900">
                          {course.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {course.schedule?.time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.instructor}
                      </p>
                    </div>
                  ))}

                  {/* Assignments */}
                  {dayAssignments.map(assignment => {
                    const course = courses.find(c => c.Id === assignment.courseId);
                    return (
                      <div
                        key={`assignment-${assignment.Id}`}
                        className={cn(
                          "p-3 rounded-lg border border-gray-200",
                          assignment.completed && "opacity-60 bg-gray-50",
                          !assignment.completed && assignment.priority === "high" && "border-red-200 bg-red-50",
                          !assignment.completed && assignment.priority === "medium" && "border-yellow-200 bg-yellow-50",
                          !assignment.completed && assignment.priority === "low" && "border-green-200 bg-green-50"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="FileText" className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                            <span className={cn(
                              "font-medium text-sm",
                              assignment.completed ? "line-through text-gray-500" : "text-gray-900"
                            )}>
                              {assignment.title}
                            </span>
                          </div>
                          {assignment.completed && (
                            <ApperIcon name="Check" className="w-3 h-3 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        {course && (
                          <p className="text-xs text-gray-600 mb-1">
                            {course.name}
                          </p>
                        )}
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              assignment.priority === "high" ? "high" :
                              assignment.priority === "medium" ? "medium" : "low"
                            }
                            className="text-xs"
                          >
                            {assignment.priority}
                          </Badge>
                          {assignment.maxPoints && (
                            <span className="text-xs text-gray-500">
                              {assignment.maxPoints} pts
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty day message */}
                  {classes.length === 0 && dayAssignments.length === 0 && (
                    <div className="text-center py-8">
                      <ApperIcon name="Calendar" className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No schedule items</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Schedule;