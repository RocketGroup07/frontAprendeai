import axios from "axios";

export const api = axios.create({
   baseURL: "http://10.92.199.10:8080/",
});

const requestInterceptor = (config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    //console.log("aa");
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

api.interceptors.request.use(requestInterceptor);