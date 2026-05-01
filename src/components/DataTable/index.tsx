"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  TableMeta,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Pagination } from "./Pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  page: number;
  setCurrentPage: (page: number) => void;
  clickHandler?: (row: Row<TData>) => void;
  pageSize: number;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  onSelectRows?: (data: TData[]) => void;
  showPagination?: boolean;
  fullBorder?: boolean;
  loadingContent?: boolean;
  border?: boolean;
  headerBg?: boolean;
  meta?: TableMeta<TData>;
  classNames?: {
    tableWrapper?: string;
    table?: string;
    tableHead?: string;
    tableBody?: string;
    tableRow?: string;
    tableHeadRow?: string;
    tableHeadCell?: string;
    tableBodyRow?: string;
    tableBodyCell?: string;
  };
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  totalCount,
  clickHandler,
  page,
  setCurrentPage,
  pageSize,
  rowSelection,
  setRowSelection,
  onSelectRows,
  showPagination = true,
  fullBorder = false,
  loadingContent,
  border = false,
  headerBg = false,
  classNames,
  meta,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection: rowSelection ?? {}, // ✅ tell the table which rows are selected
    },
    rowCount: totalCount,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    meta,
    initialState: {
      columnVisibility: {
        id: false,
      },
    },
  });

  useEffect(() => {
    if (onSelectRows) {
      const selected = table
        .getSelectedRowModel()
        .flatRows.map((r) => r.original);
      onSelectRows(selected);
    }
  }, [table, rowSelection, onSelectRows]);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "overflow-hidden rounded-md",
          classNames?.tableWrapper,
          border && "border-border-default border",
        )}
      >
        <Table className={cn("w-full", classNames?.table)}>
          <TableHeader
            className={cn(
              "border-border-default border-t",
              fullBorder && "border",
              headerBg && "bg-bg-subtle",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn(
                  "border-border-default border-b",
                  classNames?.tableHead,
                  classNames?.tableRow,
                )}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      style={{ width: header.column.getSize() }}
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "relative pr-7.5",
                        header.column.id === "attendance" && "text-center",
                        header.column.id === "totalAttendance" &&
                          "bg-bg-muted sticky right-0 z-5",
                        (header.column.id === "class_report_name" ||
                          header.column.id === "promotion_studentName") &&
                          "bg-bg-subtle sticky left-0 z-10 shadow-sm",
                        fullBorder && "border-border-default border-r",
                        classNames?.tableHeadCell,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className={cn(
              "border-border-default border-y",
              fullBorder && "border",
            )}
          >
            {loadingContent ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow
                  key={i}
                  className={cn(
                    "border-border-default border-y",
                    classNames?.tableRow,
                  )}
                >
                  {columns.map((_, j) => (
                    <TableCell
                      key={j}
                      className={cn(
                        "pr-7.5",
                        fullBorder && "border-border-default border-r",
                        classNames?.tableBodyCell,
                      )}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "border-border-default data-[state=selected]:bg-bg-basic-gray-alpha-2 hover:bg-bg-basic-gray-alpha-2 border-y text-sm",
                    classNames?.tableRow,
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      style={{ width: cell.column.getSize() }}
                      key={cell.id}
                      className={cn(
                        "relative pr-7.5",
                        cell.column.id === "actions" && "text-right",
                        cell.column.id === "s/n" && "pr-4 text-center",
                        (cell.column.id === "class_report_name" ||
                          cell.column.id === "promotion_studentName") &&
                          "data-[state=selected]:bg-bg-basic-gray-alpha-2 hover:bg-bg-default bg-bg-default sticky left-0 z-10 shadow-sm",
                        cell.column.id === "totalAttendance" &&
                          "bg-bg-default border-border-default sticky right-0 z-5 border px-5.5 text-center",
                        fullBorder && "border-border-default border-r",
                        classNames?.tableBodyCell,
                      )}
                      onClick={
                        cell.column.id === "actions" ||
                        cell.column.id === "select" ||
                        !clickHandler
                          ? undefined
                          : () => clickHandler(row)
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-text-default h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalCount / pageSize)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};
