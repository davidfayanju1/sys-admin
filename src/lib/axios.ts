import axios from "axios";

// Create base Axios instance
const api = axios.create({
  baseURL: "https://sysempire.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor: Attach access token to headers if it exists
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// State to track token refresh queueing
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Logout function to clear all session data
const logoutUser = () => {
  // Clear all storage
  // sessionStorage.clear();
  // localStorage.clear();
  // // Clear axios default header
  // delete api.defaults.headers.common["Authorization"];
  // // Show toast notification
  // toast.error("Your session has expired. Please log in again.", {
  //   duration: 4000,
  //   position: "bottom-right",
  // });
  // // Redirect to login page if not already there
  // if (
  //   window.location.pathname !== "/" &&
  //   !window.location.pathname.includes("/signup")
  // ) {
  //   setTimeout(() => {
  //     window.location.href = "/";
  //   }, 1500);
  // }
};

// Response Interceptor: Handle token expiration and refresh attempts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized errors (often indicating expired tokens)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for login and signup endpoints
      const isAuthEndpoint =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register");

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        sessionStorage.getItem("refreshToken") ||
        localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Attempt silent token refresh
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            {
              refreshToken,
            },
          );

          const { accessToken, newRefreshToken } = response.data;

          if (accessToken) {
            // Save fresh credentials
            sessionStorage.setItem("accessToken", accessToken);
            localStorage.setItem("accessToken", accessToken);

            if (newRefreshToken) {
              sessionStorage.setItem("refreshToken", newRefreshToken);
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // Update axios default header
            api.defaults.headers.common["Authorization"] =
              `Bearer ${accessToken}`;

            // Process queued requests with the new token
            processQueue(null, accessToken);

            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } else {
            throw new Error("No access token returned");
          }
        } catch (refreshError) {
          // If silent refresh fails, log the user out
          processQueue(refreshError, null);
          logoutUser();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available, log out immediately
        logoutUser();
        return Promise.reject(error);
      }
    }

    // Handle 403 Forbidden (invalid token)
    if (error.response?.status === 403) {
      logoutUser();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
