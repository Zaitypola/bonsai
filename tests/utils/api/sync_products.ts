import axios from 'axios';

import { PORT } from '../../../source/constants';

export const syncProductsService = async (headers = {}) => {
  let response;

  try {
    response = await axios.post(`http://localhost:${PORT}/products/sync`, {}, { headers });
  } catch (error) {
    response = error.response;
  }

  return response;
};
