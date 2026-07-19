"use client";

import { useState, useMemo, ReactNode } from "react";
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Search,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  emptyMessage?: string;
  toolbar?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data, columns, searchable = true, searchKeys,
  pageSize = 8, emptyMessage = "لا توجد بيانات للعرض", toolbar,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) => {
      const keys = searchKeys ?? (Object.keys(row) as (keyof T)[]);
      return keys.some((k) => String(row[k] ?? "").toLowerCase().includes(q));
    });
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av);
      const bs = String(bv);
      return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageData = sorted.slice(pageStart, pageStart + pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      {(searchable || toolbar) && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="بحث..."
                className="input pr-10"
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/5 overflow-hidden bg-ink-800/40">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-ink-900/50 border-b border-white/5">
              <tr>
                <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-bold w-12 text-right">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-[11px] uppercase tracking-wider text-slate-500 font-bold text-right whitespace-nowrap",
                      col.className
                    )}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-gold-300 transition-colors"
                      >
                        <span>{col.label}</span>
                        {sortKey === col.key ? (
                          sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronsUpDown className="w-3 h-3 opacity-50" />
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-16 text-center text-slate-500 text-sm">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                pageData.map((row, idx) => (
                  <tr
                    key={row.id ?? idx}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">
                      {String(pageStart + idx + 1).padStart(2, "0")}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3.5 text-sm text-slate-200",
                          col.className
                        )}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-ink-900/30">
            <p className="text-xs text-slate-500">
              عرض <span className="text-gold-300 font-bold">{pageStart + 1}</span>-
              <span className="text-gold-300 font-bold">{Math.min(pageStart + pageSize, sorted.length)}</span> من{" "}
              <span className="text-white font-bold">{sorted.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="text-slate-600 px-1">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={cn(
                        "min-w-[2rem] h-8 rounded-lg text-xs font-bold transition-colors",
                        p === page
                          ? "bg-gradient-to-l from-gold-600 to-gold-300 text-ink-900"
                          : "text-slate-400 hover:text-gold-300 hover:bg-white/5"
                      )}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}