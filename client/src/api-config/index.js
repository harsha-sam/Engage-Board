import axios from "axios";

export const axiosInstance = axios.create({ baseURL: 'http://localhost:4000' })
// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access-token');
  const refreshToken = localStorage.getItem('refresh-token');
  if (accessToken) config.headers['access-token'] = accessToken;
  if (refreshToken) config.headers['refresh-token'] = refreshToken;
  return config;
});

// api endpoints
export const signin_URL = `/auth/signin`;
export const signup_URL = `/auth/signup`;
export const signout_URL = `/auth/signout`;

export const user_URL = `/users/me`;

export const teams_URL = `/teams`;
export const team_users_URL = `/teams/users`;

export const chat_URL = `/chat`;
export const channels_chat_URL = '/chat/channels'