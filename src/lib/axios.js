import axios from "axios";

export const api = axios.create({

   baseURL: "localhost:8080/",
   headers: {
      "Content-Type": "application/json",
   }
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