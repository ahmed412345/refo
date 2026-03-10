import api from "../config/serverConfig";

export const getSources = async (page = 1, search, category, year, author) => {
    let query = `page=${page}`;

    if (search) query = query + `&search=${search}`;

    if (category) query = query + `&category=${category}`;

    if (year) query = query + `&year=${year}`;

    if (author) query = query + `&author=${author}`;
    

    try {
        const response = await api.get(`/sources?${query}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
