import api from "../config/serverConfig";

export const getSources = async (
  page = 1,
  search,
  novel_name,
  year,
  author,
  category,
  volume,
  issue
) => {
  let query = `page=${page}`;

  if (search) query = query + `&search=${search}`;

  if (novel_name) query = query + `&novel=${novel_name}`;

  if (year) query = query + `&year=${year}`;

  if (author) query = query + `&author=${author}`;

  if (category) query = query + `&category=${category}`;

  if (volume) query = query + `&volume=${volume}`;

  if (issue) query = query + `&issue=${issue}`;

  try {
    const response = await api.get(`/sources?${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
