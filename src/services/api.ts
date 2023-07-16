import axios from "axios";

const api = axios.create({
    baseURL: "https://fakestoreapi.com/",
    headers: {
        Authorization: `Baren ${localStorage.getItem("token")}`
    },
});

export default api;
