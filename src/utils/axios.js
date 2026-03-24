import { useCommonStore } from "@/store";
import axios from "axios";
import { ElMessage } from "element-plus";


// Create axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 120000,
});

// Request interceptor
service.interceptors.request.use(
  (config) => {
    // 从 store 获取 token 并添加到请求头
    const commonStore = useCommonStore();
    const token = commonStore.token;

    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    const { success, code, msg } = res;
    if (success == true) {
      return res;
    } else {
      if (code == 500) {
        ElMessage({
          message: msg,
          type: "error",
          duration: 2 * 1000,
        });
        return res;
      } else if (code == 401) {
        ElMessage({
          message: "Session expired",
          type: "error",
          duration: 2 * 1000,
        });
        return Promise.reject(new Error("Session expired"));
      } else {
        return Promise.reject(new Error(msg || "Error"));
      }
    }
  },
  (error) => {
    // Handle network errors
    if (error.message.indexOf("Network Error") !== -1) {
      ElMessage({
        message: "Backend service is not running",
        type: "error",
        duration: 2 * 1000,
      });
      return Promise.reject(new Error("Backend service is not running"));
    }

 
    ElMessage({
      message: error.message,
      type: "error",
      duration: 2 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
