import axios from "axios";
import { toast } from "react-toastify";
import authAction from "../redux/actions/auth";
import storageService from "./storage";

const alertOnOffline = () => {
  const isOnline = window.navigator.onLine;
  !isOnline && toast.error("No Internet Connection");
};

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

axiosInstance.interceptors.request.use((request) => {
  alertOnOffline();
  let tokenKey = storageService.get()?.token;
  if (window.location.pathname.includes("/web-app"))
    tokenKey = storageService.get({ tokenKey: "paperclip-web-app" });
  request.headers.Authorization = `Bearer ${tokenKey}`;
  return request;
});

axiosInstance.interceptors.response.use(null, (error) => {
  const { status } = error?.response;
  if (status === 401) {
    authAction.logout();
  }

  if (status < 400 || status >= 500) {
    console.log("An unexpected error", error);
  }

  return Promise.reject(error);
});

const tryCatchWrapper = async (axiosObject) => {
  try {
    const { data } = await axiosInstance(axiosObject);
    return data;
  } catch (error) {
    return error?.response?.data || {};
  }
};

const httpService = {
  get: (url, params) => tryCatchWrapper({ method: "GET", url, params }),
  post: (url, body) => tryCatchWrapper({ method: "POST", url, data: body }),
  put: (url, body) => tryCatchWrapper({ method: "PUT", url, data: body }),
  patch: (url, body) => tryCatchWrapper({ method: "PATCH", url, data: body }),
  delete: (url, body) => tryCatchWrapper({ method: "DELETE", url, data: body }),
};

export default httpService;
