import { toast } from "react-toastify";

export const gradeService = {
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
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "date_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 200, "offset": 0}
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || grade.course_id_c || null,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c || null,
        points: grade.points_c || 0,
        maxPoints: grade.max_points_c || 0,
        weight: grade.weight_c || 1.0,
        date: grade.date_c || new Date().toISOString().split('T')[0]
      }));
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
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
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "date_c"}}
        ]
      };

      const response = await apperClient.getRecordById('grade_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Grade not found");
      }

      const grade = response.data;
      return {
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || grade.course_id_c || null,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c || null,
        points: grade.points_c || 0,
        maxPoints: grade.max_points_c || 0,
        weight: grade.weight_c || 1.0,
        date: grade.date_c || new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
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
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || grade.course_id_c || null,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c || null,
        points: grade.points_c || 0,
        maxPoints: grade.max_points_c || 0,
        weight: grade.weight_c || 1.0,
        date: grade.date_c || new Date().toISOString().split('T')[0]
      }));
    } catch (error) {
      console.error("Error fetching course grades:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByAssignment(assignmentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "points_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "weight_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [{"FieldName": "assignment_id_c", "Operator": "EqualTo", "Values": [parseInt(assignmentId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || grade.course_id_c || null,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c || null,
        points: grade.points_c || 0,
        maxPoints: grade.max_points_c || 0,
        weight: grade.weight_c || 1.0,
        date: grade.date_c || new Date().toISOString().split('T')[0]
      }));
    } catch (error) {
      console.error("Error fetching assignment grades:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Grade for Assignment ${gradeData.assignmentId}`,
          course_id_c: parseInt(gradeData.courseId),
          assignment_id_c: parseInt(gradeData.assignmentId),
          points_c: parseInt(gradeData.points) || 0,
          max_points_c: parseInt(gradeData.maxPoints) || 0,
          weight_c: gradeData.weight || 1.0,
          date_c: gradeData.date || new Date().toISOString().split('T')[0]
        }]
      };

      const response = await apperClient.createRecord('grade_c', params);
      
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
          throw new Error("Failed to create grade");
        }
        
        const created = response.results[0].data;
        return {
          Id: created.Id,
          courseId: created.course_id_c?.Id || created.course_id_c || null,
          assignmentId: created.assignment_id_c?.Id || created.assignment_id_c || null,
          points: created.points_c || 0,
          maxPoints: created.max_points_c || 0,
          weight: created.weight_c || 1.0,
          date: created.date_c || new Date().toISOString().split('T')[0]
        };
      }
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Grade for Assignment ${gradeData.assignmentId}`,
          course_id_c: parseInt(gradeData.courseId),
          assignment_id_c: parseInt(gradeData.assignmentId),
          points_c: parseInt(gradeData.points) || 0,
          max_points_c: parseInt(gradeData.maxPoints) || 0,
          weight_c: gradeData.weight || 1.0,
          date_c: gradeData.date || new Date().toISOString().split('T')[0]
        }]
      };

      const response = await apperClient.updateRecord('grade_c', params);
      
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
          throw new Error("Failed to update grade");
        }
        
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          courseId: updated.course_id_c?.Id || updated.course_id_c || null,
          assignmentId: updated.assignment_id_c?.Id || updated.assignment_id_c || null,
          points: updated.points_c || 0,
          maxPoints: updated.max_points_c || 0,
          weight: updated.weight_c || 1.0,
          date: updated.date_c || new Date().toISOString().split('T')[0]
        };
      }
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('grade_c', params);
      
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
          throw new Error("Failed to delete grade");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      throw error;
    }
  }
};