import axios from 'axios';
import { PORT } from "../../../source/constants";

export const getProductsService = async (query = {}, headers = {}) => {
    let response

    try {
        response = await axios.get(`http://localhost:${PORT}/products`, { params: query, headers });
    } catch (error) {
        response = error.response
    }

    return response
}