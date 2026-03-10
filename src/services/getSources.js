import api from "../config/serverConfig";

export const getSources = async page => {
    try {
        const response = await api.get(`/sources?page=${page}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error; // مهم جداً عشان الـ Try/Catch في المكون تحس بالخطأ
    }
};
