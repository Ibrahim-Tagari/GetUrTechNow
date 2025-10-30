'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X as XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Root (no ref needed)
export const Sheet: React.FC<React.ComponentProps<typeof DialogPrimitive.Root>> = ({ children, ...props }) => {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
}

// Trigger
export const SheetTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return <DialogPrimitive.Trigger ref={ref} className={cn('', className)} {...props} />
})
SheetTrigger.displayName = 'SheetTrigger'

// Overlay
export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-sm', className)}
      {...props}
    />
  )
})
SheetOverlay.displayName = 'SheetOverlay'

// Content
export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn('fixed bottom-0 left-0 right-0 z-50 rounded-t-lg p-6', className)}
        aria-describedby="sheet-description"
        {...props}
      >
        <div className="relative">
          <div className="absolute right-4 top-4">
            <DialogPrimitive.Close aria-label="Close">
              <XIcon />
            </DialogPrimitive.Close>
          </div>
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})
SheetContent.displayName = 'SheetContent'

// Header / Footer small helpers (optional)
export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  )
}

// Title & Description with forwarded refs for a11y
export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
})
SheetTitle.displayName = 'SheetTitle'

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return <DialogPrimitive.Description ref={ref} id="sheet-description" className={cn('text-sm', className)} {...props} />
})
SheetDescription.displayName = 'SheetDescription'
