import React, { useState, useCallback, useRef, useEffect } from 'react'
import { ChevronDown, Search as SearchIcon, Globe, Loader2, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useAsyncSelect } from '@/hooks/use-async-select'

interface SimpleAsyncSelectProps {
  type: 'countries' | 'languages' | 'categories'
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  icon?: React.ReactNode
  searchPlaceholder?: string
  className?: string
}

export function SimpleAsyncSelect({
  type,
  value,
  onValueChange,
  placeholder = 'Select option...',
  icon,
  searchPlaceholder = 'Search...',
  className
}: SimpleAsyncSelectProps) {
  const [open, setOpen] = useState(false)
  
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
    pageSize: type === 'categories' ? 50 : 50, // Load more categories to show hierarchy
    minSearchLength: 0
  })

  // Find selected item display name
  const selectedItem = data.find(item => 
    (item.code && item.code === value) || 
    (item.id && item.id === value) ||
    (item.countryId && item.countryId.toString() === value) ||
    (item.categoryId && item.categoryId.toString() === value)
  )

  const getDisplayValue = () => {
    if (type === 'countries') {
      if (value === '0') return 'All Countries'
      return selectedItem?.name || placeholder
    } else if (type === 'languages') {
      if (value === 'all') return 'All Languages'  
      return selectedItem?.name || placeholder
    } else if (type === 'categories') {
      if (value === 'all' || value === '0') return 'All Categories'
      return selectedItem?.name || placeholder
    }
    return placeholder
  }

  // Add default option if not present
  useEffect(() => {
    if (data.length > 0) {
      const hasDefault = data.some(item => 
        (type === 'countries' && (item.countryId?.toString() === '0' || item.name === 'All Countries')) ||
        (type === 'languages' && (item.code === 'all' || item.name === 'All Languages')) ||
        (type === 'categories' && (item.categoryId?.toString() === '0' || item.name === 'All Categories'))
      )
      
      if (!hasDefault) {
        const defaultOption = type === 'countries' 
          ? { countryId: 0, name: 'All Countries', alpha2Code: 'ALL' }
          : type === 'languages'
          ? { code: 'all', name: 'All Languages' }
          : { categoryId: 0, name: 'All Categories' }
        
        data.unshift(defaultOption as any)
      }
    }
  }, [data, type])

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue)
    setOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center flex-1 min-w-0">
              {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
              <span className="truncate text-left">
                {getDisplayValue()}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder={searchPlaceholder}
              onValueChange={(value) => search(value)}
            />
            
            <CommandList>
              {loading && data.length === 0 && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              )}

              {error && (
                <div className="p-4 text-center">
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}

              {!loading && !error && data.length === 0 && searchTerm && (
                <CommandEmpty>No results found</CommandEmpty>
              )}

              <CommandGroup>
                {data.map((item, index) => {
                  const itemValue = type === 'countries' 
                    ? (item.countryId?.toString() || '0')
                    : type === 'languages'
                    ? (item.code || 'all')
                    : (item.categoryId?.toString() || 'all')
                  
                  // Check if this is a child category (starts with indentation)
                  const isChildCategory = type === 'categories' && item.name.startsWith('  ↳')
                  const isAllCategories = type === 'categories' && item.categoryId === 0
                  
                  return (
                    <CommandItem
                      key={`${itemValue}-${index}`}
                      value={itemValue}
                      onSelect={() => handleSelect(itemValue)}
                      className={cn(
                        "cursor-pointer",
                        isChildCategory && "text-muted-foreground text-sm pl-6 border-l-2 border-l-muted ml-2",
                        isAllCategories && "font-medium border-b border-border"
                      )}
                    >
                      <span className="truncate">{item.name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>

              {loading && data.length > 0 && (
                <div className="flex items-center justify-center p-2 border-t">
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  <span className="text-xs text-muted-foreground">Loading more...</span>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Specialized components
export function SimpleAsyncCountrySelect(props: Omit<SimpleAsyncSelectProps, 'type'>) {
  return (
    <SimpleAsyncSelect
      {...props}
      type="countries"
      icon={<Globe className="w-4 h-4" />}
      placeholder="All Countries"
      searchPlaceholder="Search countries..."
    />
  )
}

export function SimpleAsyncLanguageSelect(props: Omit<SimpleAsyncSelectProps, 'type'>) {
  return (
    <SimpleAsyncSelect
      {...props}
      type="languages"
      placeholder="All Languages"
      searchPlaceholder="Search languages..."
    />
  )
}

export function SimpleAsyncCategorySelect(props: Omit<SimpleAsyncSelectProps, 'type'>) {
  return (
    <SimpleAsyncSelect
      {...props}
      type="categories"
      icon={<Grid3X3 className="w-4 h-4" />}
      placeholder="All Categories"
      searchPlaceholder="Search categories..."
    />
  )
}