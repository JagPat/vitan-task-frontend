import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, BarChart3 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function AnalyticsHeader({ dateRange, setDateRange }) {
  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 flex items-center gap-3">
        <BarChart3 className="w-8 h-8" />
        Performance Analytics
      </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
        <p className="text-slate-600">
          Insights into your team's productivity and task lifecycle.
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}