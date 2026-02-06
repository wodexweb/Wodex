// import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders } from "axios";
// import config from "../config";

// const { api } = config;

// /* ================= AXIOS INSTANCE ================= */

// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: api.API_URL,
//   withCredentials: true,
// });

// /* ================= REQUEST INTERCEPTOR ================= */

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const authUser = localStorage.getItem("authUser");

//     if (authUser) {
//       const parsed = JSON.parse(authUser);

//       if (parsed?.token) {
//         if (!config.headers) {
//           config.headers = new AxiosHeaders();
//         }

//         (config.headers as AxiosHeaders).set(
//           "Authorization",
//           `Bearer ${parsed.token}`,
//         );
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// /* ================= RESPONSE INTERCEPTOR ================= */

// axiosInstance.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     let message = "Something went wrong";

//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           message = "Unauthorized";
//           break;
//         case 403:
//           message = "Forbidden";
//           break;
//         case 422:
//           message = error.response.data?.message || "Validation error";
//           break;
//         case 404:
//           message = "API not found";
//           break;
//         case 500:
//           message = "Server error";
//           break;
//         default:
//           message = error.response.data?.message || error.message;
//       }
//     }

//     return Promise.reject(message);
//   },
// );

// /* ================= AUTH HELPERS ================= */

// export const setAuthorization = (token: string, user?: any) => {
//   const stored = localStorage.getItem("authUser");
//   const parsed = stored ? JSON.parse(stored) : {};

//   localStorage.setItem(
//     "authUser",
//     JSON.stringify({
//       ...parsed,
//       token,
//       user: user ?? parsed.user,
//     }),
//   );
// };

// export const clearAuthorization = () => {
//   localStorage.removeItem("authUser");
// };

// export const getLoggedInUser = () => {
//   const stored = localStorage.getItem("authUser");
//   return stored ? JSON.parse(stored) : null;
// };

// /* ================= API CLIENT ================= */

// export class APIClient {
//   /* ---------- GET ---------- */
//   get<T = any>(url: string, params?: any): Promise<T> {
//     return axiosInstance.get(url, { params });
//   }

//   /* ---------- POST ---------- */
//   post<T = any>(
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig,
//   ): Promise<T> {
//     return axiosInstance.post(url, data, config);
//   }

//   /* ---------- PUT ---------- */
//   put<T = any>(
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig,
//   ): Promise<T> {
//     if (data instanceof FormData) {
//       if (!config) config = {};
//       if (!config.headers) {
//         config.headers = new AxiosHeaders();
//       }

//       (config.headers as AxiosHeaders).set(
//         "Content-Type",
//         "multipart/form-data",
//       );
//     }

//     return axiosInstance.put(url, data, config);
//   }

//   /* ---------- DELETE ---------- */
//   delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
//     return axiosInstance.delete(url, config);
//   }

//   /* ================= BACKWARD COMPATIBILITY ================= */
//   /* DO NOT REMOVE – used across your project */

//   create<T = any>(
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig,
//   ): Promise<T> {
//     return this.post(url, data, config);
//   }

//   update<T = any>(
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig,
//   ): Promise<T> {
//     return this.put(url, data, config);
//   }
// }

import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders } from "axios";
import config from "../config";

const { api } = config;

/* ================= AXIOS INSTANCE ================= */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: api.API_URL,
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */

axiosInstance.interceptors.request.use(
  (config) => {
    const authUser = sessionStorage.getItem("authUser");

    if (authUser) {
      const parsed = JSON.parse(authUser);

      if (parsed?.token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        (config.headers as AxiosHeaders).set(
          "Authorization",
          `Bearer ${parsed.token}`,
        );
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = "Something went wrong";

    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = "Unauthorized";
          break;
        case 403:
          message = "Forbidden";
          break;
        case 422:
          message = error.response.data?.message || "Validation error";
          break;
        case 404:
          message = "API not found";
          break;
        case 500:
          message = "Server error";
          break;
        default:
          message = error.response.data?.message || error.message;
      }
    }

    return Promise.reject(message);
  },
);

/* ================= AUTH HELPERS ================= */

export const setAuthorization = (token: string, user?: any) => {
  const stored = sessionStorage.getItem("authUser");
  const parsed = stored ? JSON.parse(stored) : {};

  sessionStorage.setItem(
    "authUser",
    JSON.stringify({
      ...parsed,
      token,
      user: user ?? parsed.user,
    }),
  );
};

export const clearAuthorization = () => {
  sessionStorage.removeItem("authUser");
};

/* ===== NEW: ROLE HELPER ===== */

export const getRoleId = (): number => {
  const stored = sessionStorage.getItem("authUser");
  if (!stored) return 0;

  try {
    const parsed = JSON.parse(stored);
    return parsed?.user?.role_id ?? 0;
  } catch {
    return 0;
  }
};

export const getLoggedInUser = () => {
  const stored = sessionStorage.getItem("authUser");
  return stored ? JSON.parse(stored) : null;
};

/* ================= URL HELPERS ================= */

export const getStorageUrl = (path?: string | null) => {
  if (!path) return null;
  return `${api.API_URL}/storage/${path}`;
};

/* ================= API CLIENT ================= */

export class APIClient {
  get<T = any>(url: string, params?: any): Promise<T> {
    return axiosInstance.get(url, { params });
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return axiosInstance.post(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return axiosInstance.patch(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    if (data instanceof FormData) {
      if (!config) config = {};
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      (config.headers as AxiosHeaders).set(
        "Content-Type",
        "multipart/form-data",
      );
    }

    return axiosInstance.put(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete(url, config);
  }

  /* backward compatibility */
  create<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.post(url, data, config);
  }

  update<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.put(url, data, config);
  }
}
