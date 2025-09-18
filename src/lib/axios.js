import axios from "axios";

export const api = axios.create({
   baseURL: "http://10.92.199.25:8080/",
});

const requestInterceptor = (config) => {
  if (config.url && config.url.includes("alunos/cadastrar")) {
    return config;
  }

  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

api.interceptors.request.use(requestInterceptor);