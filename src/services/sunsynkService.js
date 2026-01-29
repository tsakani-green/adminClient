// frontend/src/services/sunsynkService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002';

export const sunsynkService = {
  // Get comprehensive Bertha House data
  getBerthaHouseData: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/sunsynk/bertha-house/data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Bertha House data:', error);
      throw error;
    }
  },

  // Get real-time Bertha House data
  getBerthaHouseRealtime: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/sunsynk/bertha-house/realtime`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Bertha House realtime data:', error);
      throw error;
    }
  },

  // Get available devices
  getDevices: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/sunsynk/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }
};
