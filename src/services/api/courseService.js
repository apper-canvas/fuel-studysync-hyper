import { toast } from "react-toastify";

export const courseService = {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "current_grade_c"}},
          {"field": {"Name": "schedule_days_c"}},
          {"field": {"Name": "schedule_time_c"}},
          {"field": {"Name": "schedule_location_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('course_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(course => ({
        Id: course.Id,
        name: course.name_c || course.Name || '',
        instructor: course.instructor_c || '',
        credits: course.credits_c || 0,
        color: course.color_c || '#7C3AED',
        currentGrade: course.current_grade_c,
        schedule: {
          days: course.schedule_days_c ? course.schedule_days_c.split(',') : [],
          time: course.schedule_time_c || '',
          location: course.schedule_location_c || ''
        }
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "current_grade_c"}},
          {"field": {"Name": "schedule_days_c"}},
          {"field": {"Name": "schedule_time_c"}},
          {"field": {"Name": "schedule_location_c"}}
        ]
      };

      const response = await apperClient.getRecordById('course_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Course not found");
      }

      const course = response.data;
      return {
        Id: course.Id,
        name: course.name_c || course.Name || '',
        instructor: course.instructor_c || '',
        credits: course.credits_c || 0,
        color: course.color_c || '#7C3AED',
        currentGrade: course.current_grade_c,
        schedule: {
          days: course.schedule_days_c ? course.schedule_days_c.split(',') : [],
          time: course.schedule_time_c || '',
          location: course.schedule_location_c || ''
        }
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: courseData.name || 'Untitled Course',
          name_c: courseData.name,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits) || 0,
          color_c: courseData.color || '#7C3AED',
          current_grade_c: courseData.currentGrade || null,
          schedule_days_c: courseData.schedule?.days ? courseData.schedule.days.join(',') : '',
          schedule_time_c: courseData.schedule?.time || '',
          schedule_location_c: courseData.schedule?.location || ''
        }]
      };

      const response = await apperClient.createRecord('course_c', params);
      
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
          throw new Error("Failed to create course");
        }
        
        const created = response.results[0].data;
        return {
          Id: created.Id,
          name: created.name_c || created.Name || '',
          instructor: created.instructor_c || '',
          credits: created.credits_c || 0,
          color: created.color_c || '#7C3AED',
          currentGrade: created.current_grade_c,
          schedule: {
            days: created.schedule_days_c ? created.schedule_days_c.split(',') : [],
            time: created.schedule_time_c || '',
            location: created.schedule_location_c || ''
          }
        };
      }
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: courseData.name || 'Untitled Course',
          name_c: courseData.name,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits) || 0,
          color_c: courseData.color || '#7C3AED',
          current_grade_c: courseData.currentGrade,
          schedule_days_c: courseData.schedule?.days ? courseData.schedule.days.join(',') : '',
          schedule_time_c: courseData.schedule?.time || '',
          schedule_location_c: courseData.schedule?.location || ''
        }]
      };

      const response = await apperClient.updateRecord('course_c', params);
      
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
          throw new Error("Failed to update course");
        }
        
        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          name: updated.name_c || updated.Name || '',
          instructor: updated.instructor_c || '',
          credits: updated.credits_c || 0,
          color: updated.color_c || '#7C3AED',
          currentGrade: updated.current_grade_c,
          schedule: {
            days: updated.schedule_days_c ? updated.schedule_days_c.split(',') : [],
            time: updated.schedule_time_c || '',
            location: updated.schedule_location_c || ''
          }
        };
      }
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('course_c', params);
      
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
          throw new Error("Failed to delete course");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      throw error;
    }
  }
};