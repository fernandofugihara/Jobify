import axios from "axios";

const custonFetch = axios.create({
    baseURL: "/api/v1"
});

export default custonFetch;