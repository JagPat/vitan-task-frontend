"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponsiveTableProps {
  data: any[]
  columns: {
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
    mobileRender?: (value: any, row: any) => React.ReactNode
    hideOnMobile?: boolean
  }[]
  keyField: string
  className?: string
}

export function ResponsiveTable({ data, columns, keyField, className }: ResponsiveTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <>
      {/* Desktop Table */}
      <div className={cn("hidden md:block", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row[keyField]}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className={cn("md:hidden space-y-3", className)}>
        {data.map((row) => {
          const isExpanded = expandedRows.has(row[keyField])
          const visibleColumns = columns.filter((col) => !col.hideOnMobile)
          const hiddenColumns = columns.filter((col) => col.hideOnMobile)

          return (
            <Card key={row[keyField]}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {visibleColumns[0]?.render
                      ? visibleColumns[0].render(row[visibleColumns[0].key], row)
                      : row[visibleColumns[0]?.key]}
                  </CardTitle>
                  {hiddenColumns.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => toggleRow(row[keyField])}>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {visibleColumns.slice(1).map((column) => (
                  <div key={column.key} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{column.label}:</span>
                    <span className="text-sm">
                      {column.mobileRender
                        ? column.mobileRender(row[column.key], row)
                        : column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                    </span>
                  </div>
                ))}

                {isExpanded &&
                  hiddenColumns.map((column) => (
                    <div key={column.key} className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">{column.label}:</span>
                      <span className="text-sm">
                        {column.mobileRender
                          ? column.mobileRender(row[column.key], row)
                          : column.render
                            ? column.render(row[column.key], row)
                            : row[column.key]}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
