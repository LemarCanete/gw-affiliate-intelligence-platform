"use client";

import React, { useCallback, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getAdminUsers } from "@/lib/mock-data/admin";
import type { AdminUser } from "@/lib/mock-data/admin";

const ROLES = ["all", "admin", "editor", "viewer"] as const;
const STATUSES = ["all", "active", "suspended", "pending"] as const;
const PAGE_SIZE = 8;

const roleBadge: Record<AdminUser["role"], string> = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  editor: "bg-blue-100 text-blue-700 border-blue-200",
  viewer: "bg-gray-100 text-gray-700 border-gray-200",
};

const statusBadge: Record<AdminUser["status"], string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  suspended: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const planBadge: Record<AdminUser["plan"], string> = {
  Starter: "bg-gray-100 text-gray-700 border-gray-200",
  Pro: "bg-blue-100 text-blue-700 border-blue-200",
  Enterprise: "bg-purple-100 text-purple-700 border-purple-200",
};

function formatRelativeTime(iso: string): string {
  const diff = new Date("2026-03-17T10:30:00").getTime() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminUsersPage() {
  const fetchUsers = useCallback(() => getAdminUsers(), []);
  const { data: users } = useAsyncData<AdminUser[]>(fetchUsers);

  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleAction = (action: string, user: AdminUser) => {
    console.log(`Action: ${action}`, user);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage platform users and roles" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(0); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-64"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Plan</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Products</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Last Active</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={roleBadge[user.role]}>{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusBadge[user.status]}>{user.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={planBadge[user.plan]}>{user.plan}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">{user.productsTracked}</td>
                    <td className="py-3 px-4 text-gray-500">{formatRelativeTime(user.lastActive)}</td>
                    <td className="py-3 px-4 text-gray-500">{user.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "active" && (
                          <button
                            onClick={() => handleAction("suspend", user)}
                            className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                        {user.status === "suspended" && (
                          <button
                            onClick={() => handleAction("activate", user)}
                            className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          >
                            Activate
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleAction("make-admin", user)}
                            className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-400">
                      No users match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing {page * PAGE_SIZE + 1}--{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} users
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
