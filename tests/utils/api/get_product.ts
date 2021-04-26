import axios from 'axios';

import { PORT } from '../../../source/constants';

export const getProductService = async (publicId: string, headers = {}) => {
  let response;

  try {
    response = await axios.get(`http://localhost:${PORT}/products/${publicId}`, { headers });
  } catch (error) {
    response = error.response;
  }

  return response;
};
