import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/tickets/"
});

export const createTicket = (data) => API.post("", data);
export const listTickets = (params) => API.get("list/", { params });
export const updateTicket = (id, data) => API.patch(`${id}/`, data);
export const getStats = () => API.get("stats/");
export const classifyTicket = (description) =>
  API.post("classify/", { description });
