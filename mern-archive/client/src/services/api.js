import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Event APIs
export const getAllEvents = (params) => API.get('/events', { params });
export const getEvent = (id) => API.get(`/events/${id}`);
export const createEvent = (formData) => API.post('/events', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateEvent = (id, formData) => API.put(`/events/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const getMyEvents = () => API.get('/events/my/created');

// RSVP APIs
export const rsvpToEvent = (eventId) => API.post(`/rsvp/${eventId}`);
export const cancelRSVP = (eventId) => API.delete(`/rsvp/${eventId}`);
export const getMyRSVPs = () => API.get('/rsvp/my-rsvps');
export const checkRSVP = (eventId) => API.get(`/rsvp/check/${eventId}`);

export default API;