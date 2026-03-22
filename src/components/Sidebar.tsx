"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Pill, ShoppingCart, BarChart3, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/medicines', label: 'Medicines', icon: Pill },
    { href: '/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/reports', label: 'Reports', icon: BarChart3 }

]

export default function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside className={cn(
            'transition-all duration-300 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0',
            collapsed ? 'w-16' : 'w-64'
        )}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <Pill size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-green-700 text-lg">MediGo</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                    {collapsed ? <Menu size={18} /> : <X size={18} />}
                </button>
            </div>

            <nav className="flex-1 p-3 flex flex-col gap-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                                active
                                    ? 'bg-green-50 text-green-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <Icon size={18} className={active ? 'text-green-600' : ''} />
                            {!collapsed && <span className="text-sm">{label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {!collapsed && (
                <div className="p-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400">MediGo Admin v1.0</p>
                </div>
            )}
        </aside>
    )

}