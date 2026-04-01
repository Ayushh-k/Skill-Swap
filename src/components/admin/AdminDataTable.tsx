"use client";

import { useState, useMemo } from "react";
import { 
  ChevronDown, 
  Search, 
  MoreHorizontal, 
  ArrowUpDown,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onAction?: (item: T) => void;
}

export default function AdminDataTable<T extends { id: string }>({ 
  columns, 
  data,
  searchPlaceholder = "Search records...",
  onAction
}: AdminDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.values(item).some((val) => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-admin-surface border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-admin-emerald/20 focus:border-admin-emerald/50 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="bg-admin-surface border border-white/10 rounded-xl px-3 py-2.5 text-xs font-medium text-foreground/60 focus:outline-none focus:ring-2 focus:ring-admin-emerald/20 transition-all hover:text-white"
            onChange={(e) => setSearchQuery(e.target.value === "all" ? "" : e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="relative rounded-2xl bg-admin-surface border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            {/* Sticky Header */}
            <thead className="sticky top-0 z-10 bg-admin-surface/95 backdrop-blur-md border-b border-white/10">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={String(column.accessorKey)}
                    className="px-6 py-4 text-[11px] font-bold text-foreground/40 uppercase tracking-widest"
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && (
                        <button 
                          onClick={() => handleSort(String(column.accessorKey))}
                          className="hover:text-white transition-colors"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout" initial={false}>
                {sortedData.map((item, index) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    key={item.id}
                    className="group hover:bg-white/[0.03] transition-colors cursor-default"
                  >
                    {columns.map((column) => (
                      <td key={String(column.accessorKey)} className="px-6 py-4 text-sm font-medium text-foreground/80 group-hover:text-white transition-colors uppercase">{column.cell ? column.cell(item) : String((item as any)[column.accessorKey])}</td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {sortedData.length === 0 && (
            <div className="p-12 text-center text-foreground/20">
              <p className="text-sm font-medium italic">No matching records found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-foreground/40 font-medium tracking-tight">
          Showing <span className="text-white font-bold">{sortedData.length}</span> of {data.length} records
        </p>
        <div className="flex gap-2">
          <button disabled className="px-3 py-1.5 rounded-lg border border-white/5 text-xs font-bold text-foreground/20 disabled:opacity-50">Previous</button>
          <button disabled className="px-3 py-1.5 rounded-lg border border-white/5 text-xs font-bold text-foreground/20 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
