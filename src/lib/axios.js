import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/", //"https://bonus-analyzer.vercel.app/",
  timeout: 325000,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});
