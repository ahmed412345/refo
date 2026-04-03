import api from "../config/serverConfig";

export const getSources = async (page = 1, search, novel_name, year, author) => {
  let query = `page=${page}`;

  if (search) query = query + `&search=${search}`;

  if (novel_name) query = query + `&novel=${novel_name}`;

  if (year) query = query + `&year=${year}`;

  if (author) query = query + `&author=${author}`;


  try {
    const response = await api.get(`/sources?${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
