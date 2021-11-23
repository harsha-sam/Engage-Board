import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
})
// Add a request interceptor and store access token within the request
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access-token');
  const refreshToken = localStorage.getItem('refresh-token');
  if (accessToken) config.headers['access-token'] = accessToken;
  if (refreshToken) config.headers['refresh-token'] = refreshToken;
  return config;
},
  (error) => {
    Promise.reject(error);
  }
);

// refreshing access token with refresh token when request failed
axiosInstance.interceptors.response.use(
  (response) => response,
  (err) => {
    const request = err.config;
    const refreshToken = localStorage.getItem('refresh-token');
    // if request failed with 401, try fetching new access token and again make the request
    if (refreshToken &&
      err.response.status === 401 &&
      !request._retry
    ) {
      request._retry = true;
      return axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/token`, {
        headers: {
          'refresh-token': refreshToken
        }
      })
        .then((res) => {
          if (res.status === 204) {
            localStorage.setItem("access-token", res.headers['access-token']);
            // console.log("access token is refreshed")
            return axiosInstance(request);
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        })
    }
    return Promise.reject(err);
  }
)

// api endpoints
export const signin_URL = `/auth/signin`;
export const signup_URL = `/auth/signup`;

export const users_URL = `/users`;
export const user_URL = `/users/me`;

export const classrooms_URL = `/classrooms`;
export const classroom_users_URL = `/classrooms/users`;

export const channels_URL = '/channels'

export const requests_URL = '/requests';

export const chat_URL = `/chat`;
export const channels_chat_URL = '/chat/channels'

export const notes_URL = `/notes`;