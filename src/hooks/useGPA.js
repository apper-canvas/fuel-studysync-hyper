import { useMemo } from "react";

export const useGPA = (courses, assignments, grades) => {
  return useMemo(() => {
    if (!courses.length || !assignments.length) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.currentGrade !== null && course.currentGrade !== undefined) {
        const gradePoints = getGradePoints(course.currentGrade);
        totalPoints += gradePoints * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [courses, assignments, grades]);
};

const getGradePoints = (percentage) => {
  if (percentage >= 97) return 4.0;
  if (percentage >= 93) return 3.7;
  if (percentage >= 90) return 3.3;
  if (percentage >= 87) return 3.0;
  if (percentage >= 83) return 2.7;
  if (percentage >= 80) return 2.3;
  if (percentage >= 77) return 2.0;
  if (percentage >= 73) return 1.7;
  if (percentage >= 70) return 1.3;
  if (percentage >= 67) return 1.0;
  if (percentage >= 65) return 0.7;
  return 0.0;
};

export const calculateCourseGrade = (assignments, grades) => {
  const courseAssignments = assignments.filter(a => a.completed && a.grade !== null);
  
  if (courseAssignments.length === 0) return null;

  let totalPoints = 0;
  let totalMaxPoints = 0;

  courseAssignments.forEach(assignment => {
    totalPoints += assignment.grade;
    totalMaxPoints += assignment.maxPoints;
  });

  return totalMaxPoints > 0 ? (totalPoints / totalMaxPoints) * 100 : null;
};