import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useAsyncSelect } from '@/hooks/use-async-select';

interface MultiAsyncCountrySelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiAsyncCountrySelect({
  value,
  onValueChange,
  placeholder = 'All Countries',
  className,
}: MultiAsyncCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    search,
  } = useAsyncSelect('countries', {
    searchDelay: 300,
    pageSize: 50,
    minSearchLength: 0,
  });

  useEffect(() => {
    if (searchTerm) search(searchTerm);
  }, [searchTerm, search]);

  const getDisplayValue = () => {
    if (!value || value.length === 0) return placeholder;
    const selectedNames = value
      .map((code) => {
        const item = data.find((i) => i.alpha2Code === code);
        return item?.name || code;
      })
      .filter(Boolean);
    return selectedNames.join(', ');
  };

  const handleSelect = (currentValue: string) => {
    let newValue: string[] = Array.isArray(value) ? [...value] : [];
    if (newValue.includes(currentValue)) {
      newValue = newValue.filter((v) => v !== currentValue);
    } else {
      newValue.push(currentValue);
    }
    onValueChange(newValue);
  };

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
              <Globe className="w-4 h-4 mr-2" />
              <span className="truncate text-left">{getDisplayValue()}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search countries..."
              value={searchTerm}
              onValueChange={setSearchTerm}
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
                  const checked = value.includes(item.alpha2Code);
                  return (
                    <CommandItem
                      key={item.alpha2Code}
                      value={item.alpha2Code}
                      onSelect={() => handleSelect(item.alpha2Code)}
                      className={cn(
                        'cursor-pointer',
                        checked && 'bg-primary/10 text-primary'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        className="mr-2"
                      />
                      <span className="truncate">{item.name}</span>
                    </CommandItem>
                  );
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
  );
}
