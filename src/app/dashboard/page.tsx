'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts'
import {
    ShoppingCart, Pill, Users, MessageSquare,
    TrendingUp, AlertTriangle
} from 'lucide-react'
import { obatAPI } from '@/lib/api'

const salesData = [
    { month: 'Jan', revenue: 4200000 },
    { month: 'Feb', revenue: 5800000 },
    { month: 'Mar', revenue: 5200000 },
    { month: 'Apr', revenue: 7100000 },
    { month: 'May', revenue: 6400000 },
    { month: 'Jun', revenue: 8900000 },
    { month: 'Jul', revenue: 7600000 },
]

const recentOrders = [
    { id: 'ORD-001', customer: 'Budi Santoso', items: 3, total: 145000, status: 'Completed' },
    { id: 'ORD-002', customer: 'Siti Rahayu', items: 1, total: 80000, status: 'Processing' },
    { id: 'ORD-003', customer: 'Ahmad Fauzi', items: 5, total: 230000, status: 'Pending' },
    { id: 'ORD-004', customer: 'Dewi Lestari', items: 2, total: 95000, status: 'Completed' },
    { id: 'ORD-005', customer: 'Riko Pratama', items: 4, total: 178000, status: 'Cancelled' },
]

const statusColor: Record<string, string> = {
    Completed: 'bg-green-100 text-green-700',
    Processing: 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Cancelled: 'bg-red-100 text-red-700',
}

function formatRupiah(num: number) {
    return 'Rp ' + num.toLocaleString('id-ID')
}

export default function DashboardPage() {
    const [medicines, setMedicines] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        obatAPI.getAll()
            .then(res => setMedicines(res.data.data || []))
            .catch(() => setMedicines([]))
            .finally(() => setLoading(false))
    }, [])

    const lowStock = medicines.filter(m => m.stok < 20)

    const stats = [
        {
            title: 'Total Revenue',
            value: formatRupiah(45600000),
            change: '+12.5% from last month',
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            title: 'Total Orders',
            value: '284',
            change: '+8.2% from last month',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Total Medicines',
            value: loading ? '...' : medicines.length.toString(),
            change: 'Active products',
            icon: Pill,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            title: 'Consultations',
            value: '53',
            change: '+3 today',
            icon: MessageSquare,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
    ]

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, Admin! Here's what's happening today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border border-gray-100 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon size={18} className={stat.color} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts + Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Sales Chart */}
                <Card className="lg:col-span-2 border border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-800">Sales Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}jt`} />
                                <Tooltip formatter={(v: number) => formatRupiah(v)} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#16a34a"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#16a34a', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card className="border border-gray-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-amber-500" />
                            Low Stock Alert
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-sm text-gray-400">Loading...</p>
                        ) : lowStock.length === 0 ? (
                            <p className="text-sm text-gray-400">All stocks are sufficient</p>
                        ) : (
                            <div className="space-y-3">
                                {lowStock.slice(0, 5).map((m) => (
                                    <div key={m.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{m.nama}</p>
                                            <p className="text-xs text-gray-400">{m.kategori}</p>
                                        </div>
                                        <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
                                            {m.stok} left
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-800">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Order ID</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Customer</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Items</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Total</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-2 font-mono text-gray-600">{order.id}</td>
                                        <td className="py-3 px-2 text-gray-800 font-medium">{order.customer}</td>
                                        <td className="py-3 px-2 text-gray-600">{order.items} items</td>
                                        <td className="py-3 px-2 text-gray-800">{formatRupiah(order.total)}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}