import axios from 'axios';
import {PORT} from "../../../source/constants";

export const syncUsersService = async () => {
    let response

    try {
        response = await axios.post(`http://localhost:${PORT}/users/sync`);
    } catch (error) {
        response = error.response
    }

    return response
}