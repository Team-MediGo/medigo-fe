import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const obatAPI = {
    getAll: () => api.get('/obat'),
    getById: (id: string) => api.get(`/obat/${id}`),
    create: (data: FormData) => api.post('/obat', data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }),
    update: (id: string, data: FormData) => api.put(`/obat/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }),
    delete: (id: string) => api.delete(`/obat/${id}`)
}

export default api;