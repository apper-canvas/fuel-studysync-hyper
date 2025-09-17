import { toast } from "react-toastify";

export const assignmentService = {
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 200, "offset": 0}
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || new Date().toISOString().split('T')[0],
        priority: assignment.priority_c || 'medium',
        completed: assignment.completed_c || false,
        maxPoints: assignment.max_points_c || null,
        grade: assignment.grade_c || null,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "course_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('assignment_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Assignment not found");
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || new Date().toISOString().split('T')[0],
        priority: assignment.priority_c || 'medium',
        completed: assignment.completed_c || false,
        maxPoints: assignment.max_points_c || null,
        grade: assignment.grade_c || null,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByCourse(courseId) {
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || new Date().toISOString().split('T')[0],
        priority: assignment.priority_c || 'medium',
        completed: assignment.completed_c || false,
        maxPoints: assignment.max_points_c || null,
        grade: assignment.grade_c || null,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching course assignments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: assignmentData.title || 'Untitled Assignment',
          title_c: assignmentData.title,
          description_c: assignmentData.description || '',
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority || 'medium',
          completed_c: assignmentData.completed || false,
          max_points_c: assignmentData.maxPoints ? parseInt(assignmentData.maxPoints) : null,
          grade_c: assignmentData.grade ? parseInt(assignmentData.grade) : null,
          course_id_c: parseInt(assignmentData.courseId)
        }]
      };

      const response = await apperClient.createRecord('assignment_c', params);
      
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
          throw new Error("Failed to create assignment");
        }
        
        const created = response.results[0].data;
        return {
          Id: created.Id,
          title: created.title_c || created.Name || '',
          description: created.description_c || '',
          dueDate: created.due_date_c || new Date().toISOString().split('T')[0],
          priority: created.priority_c || 'medium',
          completed: created.completed_c || false,
          maxPoints: created.max_points_c || null,
          grade: created.grade_c || null,
          courseId: created.course_id_c?.Id || created.course_id_c || null
        };
      }
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.title || 'Untitled Assignment',
          title_c: assignmentData.title,
          description_c: assignmentData.description || '',
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority || 'medium',
          completed_c: assignmentData.completed || false,
          max_points_c: assignmentData.maxPoints ? parseInt(assignmentData.maxPoints) : null,
          grade_c: assignmentData.grade ? parseInt(assignmentData.grade) : null,
          course_id_c: parseInt(assignmentData.courseId)
        }]
      };

      const response = await apperClient.updateRecord('assignment_c', params);
      
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
          throw new Error("Failed to update assignment");
        }
        
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          title: updated.title_c || updated.Name || '',
          description: updated.description_c || '',
          dueDate: updated.due_date_c || new Date().toISOString().split('T')[0],
          priority: updated.priority_c || 'medium',
          completed: updated.completed_c || false,
          maxPoints: updated.max_points_c || null,
          grade: updated.grade_c || null,
          courseId: updated.course_id_c?.Id || updated.course_id_c || null
        };
      }
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('assignment_c', params);
      
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
          throw new Error("Failed to delete assignment");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current assignment
      const currentAssignment = await this.getById(id);
      
      // Update with toggled completed status
      return await this.update(id, {
        ...currentAssignment,
        completed: !currentAssignment.completed
      });
    } catch (error) {
      console.error("Error toggling assignment completion:", error?.response?.data?.message || error);
      throw error;
    }
  }
};