import api from "../config/serverConfig";

export const addMuseum = async museumData => {
    try {
        const response = await api.post(`/museums`, museumData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
