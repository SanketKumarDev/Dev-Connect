import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Users
export const getUserByUsername = (username) => API.get(`/users/${username}`);
export const updateProfile = (data) => API.put("/users/profile", data);
export const followUser = (id) => API.put(`/users/${id}/follow`);
export const searchUsers = (q) => API.get(`/users/search?q=${q}`);
export const getSuggestions = () => API.get("/users/suggestions");

// Posts
export const getFeed = (page = 1) => API.get(`/posts/feed?page=${page}`);
export const getAllPosts = (page = 1) => API.get(`/posts?page=${page}`);
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);
export const createPost = (data) => API.post("/posts", data);
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const addComment = (id, text) => API.post(`/posts/${id}/comment`, { text });
export const deletePost = (id) => API.delete(`/posts/${id}`);

export default API;
