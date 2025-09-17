import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByCourse(courseId) {
    await delay(250);
    return grades.filter(g => g.courseId === courseId).map(g => ({ ...g }));
  },

  async getByAssignment(assignmentId) {
    await delay(250);
    return grades.filter(g => g.assignmentId === assignmentId).map(g => ({ ...g }));
  },

  async create(gradeData) {
    await delay(400);
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1,
      date: new Date().toISOString().split('T')[0]
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(400);
    const index = grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Grade not found");
    }
    const deletedGrade = grades.splice(index, 1)[0];
    return { ...deletedGrade };
  }
};