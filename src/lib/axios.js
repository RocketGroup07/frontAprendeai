import axios from "axios";
export const baseURL = "http://10.92.199.28:8080/"

export const api = axios.create({

   baseURL
 
});

const requestInterceptor = (config) => {
  if (config.url && config.url.includes("alunos/cadastrar")) {
    return config;
  }

  const token = sessionStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

api.interceptors.request.use(requestInterceptor);