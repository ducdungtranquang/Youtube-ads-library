import React, { useState, useCallback, useRef, useEffect } from 'react'
import { ChevronDown, Search as SearchIcon, Globe, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useAsyncSelect } from '@/hooks/use-async-select'

interface AsyncSelectProps {
  type: 'countries' | 'languages'
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  icon?: React.ReactNode
  searchPlaceholder?: string
  className?: string
}

export function AsyncSelect({
  type,
  value,
  onValueChange,
  placeholder = 'Select option...',
  icon,
  searchPlaceholder = 'Search...',
  className
}: AsyncSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  
  const {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    search,
    searchTerm
  } = useAsyncSelect(type, {
    searchDelay: 300,
    pageSize: 50,
    minSearchLength: 0
  })

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    search(newValue)
  }, [search])

  // Handle scroll for infinite loading
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const { scrollTop, scrollHeight, clientHeight } = target
    
    // Load more when scrolled to bottom
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !loading) {
      loadMore()
    }
  }, [hasMore, loading, loadMore])

  // Find selected item display name
  const selectedItem = data.find(item => 
    (item.code && item.code === value) || 
    (item.id && item.id === value) ||
    (item.countryId && item.countryId.toString() === value)
  )

  const getDisplayValue = () => {
    if (type === 'countries') {
      if (value === '0') return 'All Countries'
      return selectedItem?.name || placeholder
    } else {
      if (value === 'all') return 'All Languages'  
      return selectedItem?.name || placeholder
    }
  }

  // Clear search when closing
  useEffect(() => {
    if (!open && searchValue) {
      setSearchValue('')
      search('')
    }
  }, [open, searchValue, search])

  // Add default option if not present
  useEffect(() => {
    if (data.length > 0) {
      const hasDefault = data.some(item => 
        (type === 'countries' && (item.countryId?.toString() === '0' || item.name === 'All Countries')) ||
        (type === 'languages' && (item.code === 'all' || item.name === 'All Languages'))
      )
      
      if (!hasDefault) {
        const defaultOption = type === 'countries' 
          ? { countryId: 0, name: 'All Countries', alpha2Code: 'ALL' }
          : { code: 'all', name: 'All Languages' }
        
        // Add to beginning of array
        data.unshift(defaultOption as any)
        console.log(`Added default ${type} option:`, defaultOption)
      }
      
      console.log(`${type} data:`, data.slice(0, 3), `Current value: ${value}`)
    }
  }, [data, type, value])

  return (
    <div className={cn('relative', className)}>
      <Select
        value={value}
        onValueChange={onValueChange}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger className="w-full">
          {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
          <SelectValue placeholder={getDisplayValue()} />
        </SelectTrigger>
        
        <SelectContent 
          className="max-h-[300px] p-0"
          onScroll={handleScroll}
          ref={contentRef}
        >
          {/* Search input */}
          <div className="sticky top-0 z-10 bg-white border-b p-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="pl-8 h-8"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Loading state */}
          {loading && data.length === 0 && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-4 text-center">
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {/* No results */}
          {!loading && !error && data.length === 0 && searchTerm && (
            <div className="p-4 text-center">
              <span className="text-sm text-muted-foreground">No results found</span>
            </div>
          )}

          {/* Options */}
          {data.map((item, index) => {
            const itemValue = type === 'countries' 
              ? (item.countryId?.toString() || '0')
              : (item.code || 'all')
            
            return (
              <SelectItem 
                key={`${itemValue}-${index}`} 
                value={itemValue}
                className="cursor-pointer"
              >
                <span className="truncate">{item.name}</span>
              </SelectItem>
            )
          })}

          {/* Load more indicator */}
          {loading && data.length > 0 && (
            <div className="flex items-center justify-center p-2 border-t">
              <Loader2 className="h-3 w-3 animate-spin mr-2" />
              <span className="text-xs text-muted-foreground">Loading more...</span>
            </div>
          )}

          {/* End of results */}
          {!hasMore && data.length > 0 && searchTerm && (
            <div className="p-2 text-center border-t">
              <span className="text-xs text-muted-foreground">End of results</span>
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

// Specialized components
export function AsyncCountrySelect(props: Omit<AsyncSelectProps, 'type'>) {
  return (
    <AsyncSelect
      {...props}
      type="countries"
      icon={<Globe className="w-4 h-4" />}
      placeholder="All Countries"
      searchPlaceholder="Search countries..."
    />
  )
}

export function AsyncLanguageSelect(props: Omit<AsyncSelectProps, 'type'>) {
  return (
    <AsyncSelect
      {...props}
      type="languages"
      placeholder="All Languages"
      searchPlaceholder="Search languages..."
    />
  )
}