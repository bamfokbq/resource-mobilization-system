"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp, Search, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EnhancedSelectProps {
  label?: string
  description?: string
  error?: string
  success?: boolean
  variant?: "default" | "floating" | "outline"
  size?: "sm" | "default" | "lg"
  searchable?: boolean
  placeholder?: string
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
}

const EnhancedSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  EnhancedSelectProps
>(({ 
  children,
  label,
  description,
  error,
  success,
  variant = "default",
  size = "default",
  searchable = false,
  placeholder = "Select an option...",
  value,
  onValueChange,
  disabled,
  required,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const selectId = React.useId()

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    default: "h-11 px-4 text-base",
    lg: "h-12 px-4 text-lg"
  }

  const getTriggerClasses = () => {
    const baseClasses = cn(
      "flex w-full items-center justify-between rounded-lg border bg-background font-medium transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-1",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "[&>span]:line-clamp-1",
      sizeClasses[size]
    )

    if (variant === "floating") {
      return cn(
        baseClasses,
        "border-input/50 bg-transparent",
        value && "pt-6 pb-2",
        "focus:border-primary focus:ring-primary/20",
        error && "border-destructive focus:border-destructive focus:ring-destructive/20",
        success && "border-green-500 focus:border-green-500 focus:ring-green-500/20"
      )
    }

    if (variant === "outline") {
      return cn(
        baseClasses,
        "border-2 border-input/30 bg-background/50 backdrop-blur-sm",
        "hover:border-input/60 hover:bg-background/80",
        "focus:border-primary focus:ring-primary/10 focus:bg-background",
        error && "border-destructive hover:border-destructive focus:border-destructive focus:ring-destructive/10",
        success && "border-green-500 hover:border-green-500 focus:border-green-500 focus:ring-green-500/10"
      )
    }

    return cn(
      baseClasses,
      "border-input bg-background shadow-sm",
      "hover:border-input/80",
      "focus:border-primary focus:ring-primary/20",
      error && "border-destructive focus:border-destructive focus:ring-destructive/20",
      success && "border-green-500 focus:border-green-500 focus:ring-green-500/20"
    )
  }

  const FloatingLabel = () => {
    if (variant !== "floating" || !label) return null
    
    return (
      <label
        htmlFor={selectId}
        className={cn(
          "absolute left-4 text-muted-foreground transition-all duration-200 ease-in-out pointer-events-none",
          "origin-left transform z-10",
          (value || isOpen) 
            ? "top-2 text-xs font-medium scale-90 text-primary"
            : "top-1/2 -translate-y-1/2 text-base",
          error && (value || isOpen) && "text-destructive",
          success && (value || isOpen) && "text-green-600"
        )}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
    )
  }

  // Filter children based on search query if searchable
  const filteredChildren = React.useMemo(() => {
    if (!searchable || !searchQuery) return children

    return React.Children.toArray(children).filter((child) => {
      if (React.isValidElement(child)) {
        const props = child.props as any
        if (props && props.children) {
          const text = props.children.toString().toLowerCase()
          return text.includes(searchQuery.toLowerCase())
        }
      }
      return true
    })
  }, [children, searchQuery, searchable])

  return (
    <div className="space-y-2">
      {/* Static Label (for non-floating variants) */}
      {label && variant !== "floating" && (
        <label
          htmlFor={selectId}
          className={cn(
            "block text-sm font-medium leading-none",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error ? "text-destructive" : "text-foreground"
          )}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      {/* Description */}
      {description && variant !== "floating" && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Select Container */}
      <div className="relative">
        <SelectPrimitive.Root 
          value={value} 
          onValueChange={onValueChange}
          disabled={disabled}
          onOpenChange={setIsOpen}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            id={selectId}
            className={getTriggerClasses()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            <SelectPrimitive.Value 
              placeholder={variant === "floating" ? " " : placeholder}
              className="text-left"
            />
            
            <SelectPrimitive.Icon asChild>
              <div className="flex items-center gap-2">
                {/* Status Icons */}
                {success && !error && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {error && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                
                {/* Chevron */}
                <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </div>
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          {/* Floating Label */}
          <FloatingLabel />

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              )}
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                <ChevronUp className="h-4 w-4" />
              </SelectPrimitive.ScrollUpButton>

              {/* Search Input */}
              {searchable && (
                <div className="flex items-center border-b px-3 py-2">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    className="flex h-8 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              <SelectPrimitive.Viewport className="p-1">
                {React.Children.count(filteredChildren) === 0 && searchQuery ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No options found.
                  </div>
                ) : (
                  filteredChildren
                )}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                <ChevronDown className="h-4 w-4" />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>

      {/* Floating Description */}
      {description && variant === "floating" && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
})

EnhancedSelect.displayName = "EnhancedSelect"

const EnhancedSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-2 pr-8 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "transition-colors duration-150",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))

EnhancedSelectItem.displayName = "EnhancedSelectItem"

export { EnhancedSelect, EnhancedSelectItem }
