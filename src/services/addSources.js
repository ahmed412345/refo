/* Created by Ahmed Eltahan - 2026 */
import api from "../config/serverConfig";

export const addSource = async (source) => {
  try {
    const response = await api.post(`/sources`, source);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
