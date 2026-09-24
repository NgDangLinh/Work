import axios from "axios";

const api = axios.create({
    // domain api
  baseURL: "https://059.nt-member.newgen.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;