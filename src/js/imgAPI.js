import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39810315-82dfa50f63b3d0034a9eedb03';
export const per_page = 40

export const fetchImages = async (searchTerm, page) => {
  const response = await axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: searchTerm,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page,
      page,
    },
  });
  return response.data;
};
