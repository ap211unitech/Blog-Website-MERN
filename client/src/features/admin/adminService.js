import axios from "axios";
import { BACKEND_HOST_URL } from "../../config/defaults";

// Get All Users List
const getAllUsers = async (authToken) => {
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }
    const res = await axios.get(`${BACKEND_HOST_URL}/admin/getAllUsers`, config);
    return res.data;
}

export default {
    getAllUsers
}