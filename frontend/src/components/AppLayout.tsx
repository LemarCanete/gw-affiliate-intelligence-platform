"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {
    LayoutDashboard,
    Search,
    Globe,
    PenTool,
    ClipboardCheck,
    Send,
    Eye,
    BarChart3,
    CreditCard,
    Settings,
    Plug,
    Menu,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Key,
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

    const mainNav = [
        { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
        { name: 'Keywords', href: '/app/keywords', icon: Search },
        { name: 'Domain Analysis', href: '/app/domain', icon: Globe },
        { name: 'Content Writer', href: '/app/writer', icon: PenTool },
        { name: 'Staging', href: '/app/staging', icon: ClipboardCheck },
        { name: 'Publishing', href: '/app/pipeline', icon: Send },
        { name: 'Monitoring', href: '/app/monitoring', icon: Eye },
        { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    ];

    const bottomNav = [
        { name: 'Billing', href: '/app/billing', icon: CreditCard },
        { name: 'Settings', href: '/app/user-settings', icon: Settings },
        { name: 'Connections', href: '/app/connect', icon: Plug },
    ];

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const sidebarWidth = isCollapsed ? 'w-[68px]' : 'w-[240px]';
    const mainPadding = isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-[240px]';

    const renderNavItem = (item: { name: string; href: string; icon: React.ElementType }) => {
        const isActive = item.href === '/app'
            ? pathname === '/app'
            : pathname.startsWith(item.href);
        return (
            <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2 text-[13px] font-medium rounded-lg transition-all duration-150 ${
                    isActive
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                }`}
            >
                <item.icon
                    className={`${isCollapsed ? '' : 'mr-3'} h-[18px] w-[18px] shrink-0 transition-colors duration-150 ${
                        isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                    strokeWidth={1.75}
                />
                {!isCollapsed && item.name}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb]">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar — dark theme */}
            <div className={`fixed inset-y-0 left-0 ${sidebarWidth} bg-[#0f172a] transform transition-all duration-200 ease-out z-30
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                {/* Logo */}
                <div className={`h-14 flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} border-b border-white/[0.08]`}>
                    <div className={`flex items-center gap-2.5 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <img src="/gigwavelogo.png" alt="GW" className="w-7 h-7 object-contain shrink-0" />
                        {!isCollapsed && (
                            <span className="text-[15px] font-semibold text-white tracking-tight whitespace-nowrap">
                                {productName}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-slate-400 hover:text-white ml-auto"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Main navigation */}
                <div className="flex flex-col h-[calc(100%-3.5rem)] justify-between">
                    <nav className="mt-3 px-2 space-y-0.5">
                        {!isCollapsed && (
                            <p className="px-3 mb-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Platform</p>
                        )}
                        {mainNav.map(renderNavItem)}
                    </nav>

                    {/* Bottom section */}
                    <div className="px-2 pb-3 space-y-0.5">
                        {!isCollapsed && (
                            <p className="px-3 mb-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Account</p>
                        )}
                        {bottomNav.map(renderNavItem)}

                        {/* Collapse toggle */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`hidden lg:flex items-center ${isCollapsed ? 'justify-center w-full' : 'w-full'} px-3 py-2 mt-2 text-[13px] font-medium text-slate-500 rounded-lg hover:bg-white/[0.06] hover:text-slate-300 transition-all duration-150`}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
                            ) : (
                                <>
                                    <ChevronLeft className="h-[18px] w-[18px] mr-3" strokeWidth={1.75} />
                                    Collapse
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`${mainPadding} transition-all duration-200`}>
                {/* Top bar — clean, minimal */}
                <div className="sticky top-0 z-10 flex items-center justify-between h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-5">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <Menu className="h-5 w-5"/>
                    </button>

                    <div className="relative ml-auto">
                        <button
                            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                            className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <span className="text-[11px] font-semibold text-white">
                                    {user ? getInitials(user.email) : '??'}
                                </span>
                            </div>
                            <span className="text-[13px] font-medium hidden sm:block">{user?.email || 'Loading...'}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-gray-400"/>
                        </button>

                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/80 overflow-hidden">
                                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 truncate mt-0.5">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="p-1">
                                    <button
                                        onClick={() => {
                                            setUserDropdownOpen(false);
                                            handleChangePassword()
                                        }}
                                        className="w-full flex items-center px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <Key className="mr-2.5 h-4 w-4 text-gray-400"/>
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setUserDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="mr-2.5 h-4 w-4 text-red-400"/>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <main className="p-5 lg:p-6">
                    {children}
                </main>
            </div>

            <FloatingChat />
        </div>
    );
}
