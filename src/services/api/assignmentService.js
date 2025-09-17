import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async getByCourse(courseId) {
    await delay(250);
    return assignments.filter(a => a.courseId === courseId).map(a => ({ ...a }));
  },

  async create(assignmentData) {
    await delay(400);
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      completed: false,
      grade: null
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(400);
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index] = { ...assignments[index], ...assignmentData };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    const deletedAssignment = assignments.splice(index, 1)[0];
    return { ...deletedAssignment };
  },

  async toggleComplete(id) {
    await delay(300);
    const assignment = assignments.find(a => a.Id === id);
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    assignment.completed = !assignment.completed;
    return { ...assignment };
  }
};