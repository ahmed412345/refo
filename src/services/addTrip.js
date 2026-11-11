import api from "../config/serverConfig";

export const addTrip = async tripData => {
    try {
        const response = await api.post(`/trip`, tripData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
