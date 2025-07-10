import axios from "axios";

export const axiosInstance= axios.create({
    baseURL: "https://chat-club-backend-gr78.onrender.com/api/v1",
    withCredentials:true
})