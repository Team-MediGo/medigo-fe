'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import { saveAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pill } from "lucide-react"


export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({
        nama: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRegister = async () => {
        if (!form.nama || !form.email || !form.password) {
            setError("Password dan konfirmasi tidak sama!")
            return
        }

        setLoading(true)
        setError('')

        try {
            await authAPI.register({
                nama: form.nama,
                email: form.email,
                password: form.password
            })
            router.push('/login')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Register gagal')
        } finally {
            setLoading(true)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
                {/* logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                        <Pill size={20} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-green-700">MediGo</span>
                </div>

                {/* title */}
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold text-gray-900">Buat akun baru</h1>
                    <p className="text-sm text-gray-500 mt-1">Daftar sebagai admin MediGo</p>
                </div>

                {/* error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
                )}

                {/* form */}
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input
                            className="mt-1 border border-gray-300 rounded-lg px-4 py-2"
                            placeholder="Admin MediGo"
                            value={form.nama}
                            onChange={e => setForm({ ...form, nama: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            className="mt-1 border border-gray-300 rounded-lg px-4 py-2"
                            type="email"
                            placeholder="example@gmail.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            className="mt-1 border border-gray-300 rounded-lg px-4 py-2"
                            type="password"
                            placeholder="*****"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                </div>

                {/* button */}
                <Button
                    className="w-full mt-6 bg-green-600 hover:bg-green-700"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? 'Register...' : ' Register'}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Sudah punya akun?{' '}
                    <a href="/login" className="text-green-600 font-medium hover:underline">
                        Login Sekarang
                    </a>
                </p>
            </div>
        </div>
    )
}