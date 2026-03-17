"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Radar,
    PenTool,
    BarChart3,
    FileText,
    GitBranch,
    Workflow,
    CreditCard,
    Shield,
    Settings,
    Menu,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Key,
    RefreshCw,
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClient } from "@/lib/supabase/client";
import { FloatingChat } from "@/components/FloatingChat";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { user } = useGlobal();

    const handleLogout = async () => {
        try {
            const client = await createSPASassClient();
            await client.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    const handleChangePassword = async () => {
        router.push('/app/user-settings')
    };

    const getInitials = (email: string) => {
        const parts = email.split('@')[0].split(/[._-]/);
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    };

    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME;

    const navigation = [
        { name: 'Overview', href: '/app', icon: LayoutDashboard },
        { name: 'Products', href: '/app/products', icon: Package },
        { name: 'Intelligence Feeds', href: '/app/feeds', icon: Radar },
        { name: 'Content', href: '/app/content', icon: PenTool },
        { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
        { name: 'Reports', href: '/app/reports', icon: FileText },
        { name: 'Workflows', href: '/app/workflows', icon: GitBranch },
        { name: 'Pipeline', href: '/app/pipeline', icon: Workflow },
        { name: 'Refresh', href: '/app/refresh', icon: RefreshCw },
        { name: 'Billing', href: '/app/billing', icon: CreditCard },
        { name: 'Admin', href: '/app/admin', icon: Shield },
        { name: 'Settings', href: '/app/user-settings', icon: Settings },
    ];

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const sidebarWidth = isCollapsed ? 'w-[68px]' : 'w-64';
    const mainPadding = isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-64';

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 ${sidebarWidth} bg-white shadow-lg transform transition-all duration-200 ease-in-out z-30
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                {/* Header */}
                <div className="h-16 flex items-center justify-between px-3 border-b">
                    <div className={`flex items-center gap-2 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0">
                            <Radar className="w-3.5 h-3.5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap">
                                {productName}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-4 px-2 space-y-1 flex-1">
                    {navigation.map((item) => {
                        const isActive = item.href === '/app'
                            ? pathname === '/app'
                            : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={isCollapsed ? item.name : undefined}
                                className={`group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-2'} py-2 text-sm font-medium rounded-md transition-colors ${
                                    isActive
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon
                                    className={`${isCollapsed ? '' : 'mr-3'} h-5 w-5 shrink-0 ${
                                        isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                {!isCollapsed && item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle — desktop only */}
                <div className="hidden lg:flex absolute bottom-4 left-0 right-0 px-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'w-full'} px-2 py-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors`}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <>
                                <ChevronLeft className="h-5 w-5 mr-3" />
                                Collapse
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className={`${mainPadding} transition-all duration-200`}>
                {/* Top bar */}
                <div className="sticky top-0 z-10 flex items-center justify-between h-16 bg-white shadow-sm px-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <Menu className="h-6 w-6"/>
                    </button>

                    <div className="relative ml-auto">
                        <button
                            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                            className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-700 font-medium">
                                    {user ? getInitials(user.email) : '??'}
                                </span>
                            </div>
                            <span>{user?.email || 'Loading...'}</span>
                            <ChevronDown className="h-4 w-4"/>
                        </button>

                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border">
                                <div className="p-2 border-b border-gray-100">
                                    <p className="text-xs text-gray-500">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setUserDropdownOpen(false);
                                            handleChangePassword()
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Key className="mr-3 h-4 w-4 text-gray-400"/>
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setUserDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="mr-3 h-4 w-4 text-red-400"/>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <main className="p-4">
                    {children}
                </main>
            </div>

            <FloatingChat />
        </div>
    );
}
