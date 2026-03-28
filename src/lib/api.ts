import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// mmebuat otomatis token disetiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// membuat redirect jika 401 ke halaman login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.getItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

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

export const authAPI = {
    register: (data: { nama: string, email: string, password: string }) => api.post('/auth/register', data),
    login: (data: { email: string, password: string }) => api.post('/auth/login', data),
    me: () => api.get('/auth/me')
}

export default api;