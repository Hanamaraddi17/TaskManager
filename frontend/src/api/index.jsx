import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-eight-pied.vercel.app/api",
});
export default api;
