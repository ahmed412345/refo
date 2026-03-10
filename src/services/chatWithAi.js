import api from "../config/serverConfig";

export const chatWithAi = async messages => {
    try {
        // نرسل مصفوفة الرسائل كاملة للسيرفر
        const response = await api.post(`/askai`, {
            messages,
        });
        return response.data; // نفترض أن الـ response يحتوي على نص رد الـ AI
    } catch (error) {
        throw error.response?.data || error;
    }
};
