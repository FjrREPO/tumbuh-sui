"use client";

import { useState } from "react";
import { Skeleton } from "@heroui/skeleton";

import ProtocolRow from "./protocol-row";

interface ProtocolDataGridProps {
  protocols?: any;
  isLoading: boolean;
}

type SortDirection = "ascending" | "descending" | null;

interface ColumnDefinition {
  key: string;
  title: string;
  align: "start" | "center" | "end";
  sortable: boolean;
}

export default function ProtocolDataGrid({
  protocols,
  isLoading,
}: ProtocolDataGridProps) {
  const [sortColumn, setSortColumn] = useState<string>("tvl");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("descending");

  const columns: ColumnDefinition[] = [
    { key: "protocol", title: "Protocol", align: "start", sortable: true },
    { key: "tvl", title: "TVL", align: "center", sortable: true },
    { key: "category", title: "Category", align: "center", sortable: true },
    { key: "status", title: "Status", align: "end", sortable: true },
  ];

  const getJustifyClass = (align: "start" | "center" | "end") => {
    switch (align) {
      case "start":
        return "justify-start";
      case "center":
        return "justify-center";
      case "end":
        return "justify-end";
    }
  };

  const handleSort = (columnKey: string) => {
    if (columnKey === sortColumn) {
      if (sortDirection === "ascending") {
        setSortDirection("descending");
      } else if (sortDirection === "descending") {
        setSortDirection(null);
      } else {
        setSortDirection("ascending");
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("ascending");
    }
  };

  const sortedProtocols = [...(protocols || [])].sort((a, b) => {
    if (!sortDirection) return 0;

    switch (sortColumn) {
      case "tvl":
        const tvlA = a.tvl;
        const tvlB = b.tvl;

        return sortDirection === "ascending" ? tvlA - tvlB : tvlB - tvlA;

      case "status":
        const statusA = a.status ? String(a.status).toLowerCase() : "";
        const statusB = b.status ? String(b.status).toLowerCase() : "";

        return sortDirection === "ascending"
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      case "category":
        const categoryA = a.type.toLowerCase();
        const categoryB = b.type.toLowerCase();

        return sortDirection === "ascending"
          ? categoryA.localeCompare(categoryB)
          : categoryB.localeCompare(categoryA);

      case "protocol":
        return sortDirection === "ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);

      default:
        return 0;
    }
  });

  return (
    <div className="max-w-full grow overflow-auto xl:overflow-hidden">
      <div className="flex h-full min-w-full max-w-full grow items-stretch align-middle">
        <div className="w-full">
          <div
            className="w-full min-w-full border-b border-neutral-800"
            role="grid"
          >
            <div
              className="grid grid-cols-7"
              style={{
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
              }}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={`h-14 flex items-center px-4 font-mono uppercase text-base ${getJustifyClass(
                    column.align,
                  )} ${column.sortable ? "cursor-pointer hover:bg-neutral-900" : ""}`}
                  role="columnheader"
                  tabIndex={column.sortable ? 0 : undefined}
                  onClick={
                    column.sortable ? () => handleSort(column.key) : undefined
                  }
                  onKeyDown={
                    column.sortable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSort(column.key);
                          }
                        }
                      : undefined
                  }
                >
                  <div
                    className={`flex gap-2 items-center ${
                      column.align === "end" ? "flex-row-reverse" : "flex-row"
                    } ${column.align === "center" ? "justify-center" : ""}`}
                  >
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {column.title}
                    </div>
                    {column.sortable &&
                      sortColumn === column.key &&
                      sortDirection && (
                        <svg
                          className="shrink-0"
                          fill="none"
                          height="20"
                          viewBox="0 0 20 20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d={
                              sortDirection === "ascending"
                                ? "M9.49992 7.16205L5.38404 12.1011L4.61581 11.4609L9.99993 5L15.384 11.4609L14.6158 12.1011L10.4999 7.16205V15H9.49992V7.16205Z"
                                : "M10.5 12.8379L14.6158 7.89888L15.3841 8.53907L9.99995 15L4.61584 8.53907L5.38407 7.89888L9.49996 12.838V5H10.5V12.8379Z"
                            }
                            fill="currentColor"
                          />
                        </svg>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {isLoading
              ? Array(10)
                  .fill(null)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-4 h-[88px] border-t border-neutral-900"
                      style={{
                        gridTemplateColumns: "1.5fr 1fr 1fr 1fr auto",
                      }}
                    >
                      <div className="flex items-center px-4">
                        <div className="inline-flex h-[72px] items-center justify-start gap-2">
                          <div className="flex w-[48px] items-center justify-center">
                            <Skeleton className="rounded-full h-8 w-8" />
                          </div>
                          <div className="inline-flex min-w-0 shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Skeleton className="w-32 h-6 rounded-md" />
                            <Skeleton className="w-24 h-4 rounded-md" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center px-4">
                        <Skeleton className="w-16 h-6 rounded-md" />
                      </div>
                      <div className="flex items-center justify-center px-4">
                        <Skeleton className="w-16 h-6 rounded-md" />
                      </div>
                      <div className="flex items-center justify-end px-4">
                        <Skeleton className="w-20 h-9 rounded-md" />
                      </div>
                    </div>
                  ))
              : sortedProtocols.map((protocol) => (
                  <ProtocolRow key={protocol.id} protocol={protocol} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
