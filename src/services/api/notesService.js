import notesData from '@/services/mockData/notes.json';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let notes = [...notesData];

export const notesService = {
  async getAll() {
    await delay(300);
    return [...notes];
  },

  async getByCourseId(courseId) {
    await delay(250);
    return notes.filter(note => note.courseId === courseId).map(note => ({ ...note }));
  },

  async getById(id) {
    await delay(200);
    const note = notes.find(n => n.Id === parseInt(id));
    if (!note) {
      throw new Error('Note not found');
    }
    return { ...note };
  },

  async create(noteData) {
    await delay(400);
    const newNote = {
      ...noteData,
      Id: Math.max(...notes.map(n => n.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    return { ...newNote };
  },

  async update(id, noteData) {
    await delay(400);
    const index = notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Note not found');
    }
    notes[index] = {
      ...notes[index],
      ...noteData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...notes[index] };
  },

  async delete(id) {
    await delay(300);
    const index = notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Note not found');
    }
    const deleted = notes.splice(index, 1)[0];
    return { ...deleted };
  }
};