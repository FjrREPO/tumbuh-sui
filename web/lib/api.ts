import axios from "axios";

let baseURL = process.env.NEXT_PUBLIC_API_URL || "";

if (baseURL && !baseURL.endsWith("/")) {
  baseURL += "/";
}

const apiSet = axios.create({
  baseURL,
});

const api = {
  get: (endpoint: any) =>
    apiSet.get(endpoint).then((res: any) => (res as any).data),
  post: (endpoint: any, body?: Record<any, any>): Promise<any> =>
    apiSet.post(endpoint, body).then((res: any) => (res as any).data),
  put: (endpoint: any, body?: Record<any, any>): Promise<any> =>
    apiSet.put(endpoint, body).then((res: any) => (res as any).data),
  delete: (endpoint: any, body?: Record<any, any>): Promise<any> =>
    apiSet.delete(endpoint, body).then((res: any) => (res as any).data),
  patch: (endpoint: any, body?: Record<any, any>): Promise<any> =>
    apiSet.patch(endpoint, body).then((res: any) => (res as any).data),
  all: (requests: any) => axios.all(requests),
  spread: (callback: any) => axios.spread(callback),
  setHeader: (header: any, value: any) => {
    apiSet.defaults.headers.common[header] = value;
  },
};

export default api;
