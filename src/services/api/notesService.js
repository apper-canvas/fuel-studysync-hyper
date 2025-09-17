import { toast } from "react-toastify";

export const notesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        orderBy: [{"fieldName": "updated_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 200, "offset": 0}
      };

      const response = await apperClient.fetchRecords('note_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(note => ({
        Id: note.Id,
        title: note.title_c || note.Name || '',
        content: note.content_c || '',
        createdAt: note.created_at_c || new Date().toISOString(),
        updatedAt: note.updated_at_c || new Date().toISOString(),
        courseId: note.course_id_c?.Id || note.course_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching notes:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByCourseId(courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}],
        orderBy: [{"fieldName": "updated_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('note_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(note => ({
        Id: note.Id,
        title: note.title_c || note.Name || '',
        content: note.content_c || '',
        createdAt: note.created_at_c || new Date().toISOString(),
        updatedAt: note.updated_at_c || new Date().toISOString(),
        courseId: note.course_id_c?.Id || note.course_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching course notes:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "course_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('note_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error('Note not found');
      }

      const note = response.data;
      return {
        Id: note.Id,
        title: note.title_c || note.Name || '',
        content: note.content_c || '',
        createdAt: note.created_at_c || new Date().toISOString(),
        updatedAt: note.updated_at_c || new Date().toISOString(),
        courseId: note.course_id_c?.Id || note.course_id_c || null
      };
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(noteData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const currentTime = new Date().toISOString();
      const params = {
        records: [{
          Name: noteData.title || 'Untitled Note',
          title_c: noteData.title,
          content_c: noteData.content || '',
          created_at_c: currentTime,
          updated_at_c: currentTime,
          course_id_c: parseInt(noteData.courseId)
        }]
      };

      const response = await apperClient.createRecord('note_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create note");
        }
        
        const created = response.results[0].data;
        return {
          Id: created.Id,
          title: created.title_c || created.Name || '',
          content: created.content_c || '',
          createdAt: created.created_at_c || currentTime,
          updatedAt: created.updated_at_c || currentTime,
          courseId: created.course_id_c?.Id || created.course_id_c || null
        };
      }
    } catch (error) {
      console.error("Error creating note:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, noteData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const currentTime = new Date().toISOString();
      const params = {
        records: [{
          Id: parseInt(id),
          Name: noteData.title || 'Untitled Note',
          title_c: noteData.title,
          content_c: noteData.content || '',
          updated_at_c: currentTime,
          course_id_c: parseInt(noteData.courseId)
        }]
      };

      const response = await apperClient.updateRecord('note_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update note");
        }
        
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          title: updated.title_c || updated.Name || '',
          content: updated.content_c || '',
          createdAt: updated.created_at_c || new Date().toISOString(),
          updatedAt: updated.updated_at_c || currentTime,
          courseId: updated.course_id_c?.Id || updated.course_id_c || null
        };
      }
    } catch (error) {
      console.error("Error updating note:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('note_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete note");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting note:", error?.response?.data?.message || error);
      throw error;
    }
  }
};