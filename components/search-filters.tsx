"use client"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, SlidersHorizontal } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

interface SearchFiltersProps {
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
}

export function SearchFilters({ dateRange, onDateRangeChange }: SearchFiltersProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Filters</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>View Count</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="Any views" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any views</SelectItem>
              <SelectItem value="1k">1K+ views</SelectItem>
              <SelectItem value="10k">10K+ views</SelectItem>
              <SelectItem value="100k">100K+ views</SelectItem>
              <SelectItem value="1m">1M+ views</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="vi">Vietnamese</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Country</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="vn">Vietnam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>CTR / Retention</Label>
          <Select>
            <SelectTrigger className="bg-transparent">
              <SelectValue placeholder="Any performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any performance</SelectItem>
              <SelectItem value="high">High &gt;5%</SelectItem>
              <SelectItem value="medium">Medium 2-5%</SelectItem>
              <SelectItem value="low">Low &lt;2%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" variant="secondary">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
