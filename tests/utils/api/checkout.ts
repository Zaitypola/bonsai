import axios from 'axios';

import { PORT } from '../../../source/constants';
import { ICreateCart } from '../../../source/services/checkout';

export const checkout = async (data: ICreateCart) => {
  let response;

  try {
    response = await axios.post(`http://localhost:${PORT}/checkout`, data);
  } catch (error) {
    response = error.response;
  }

  return response;
};
