import type { User } from "@/types";

export const saveAuth = (token: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

export const getToken = () => {
    return localStorage.getItem('token')
}

export const getUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

export const removeAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
}

export const isAuthenticated = () => {
    return !!getToken()
}


