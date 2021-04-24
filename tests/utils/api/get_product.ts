import axios from 'axios';
import {PORT} from "../../../source/constants";

export const getProductService = async (publicId: string) => {
    let response

    try {
        response = await axios.get(`http://localhost:${PORT}/products/${publicId}`);
    } catch (error) {
        response = error.response
    }

    return response
}