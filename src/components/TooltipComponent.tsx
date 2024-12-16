import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

const TooltipProvider = TooltipPrimitive.Provider
const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`
        z-50 overflow-hidden rounded-lg bg-white px-3 py-2.5
        border-2 border-primary/20 shadow-sm
        animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
        ${className || ''}
      `}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

interface CritterTooltipProps {
  title: string
  content: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

const CritterTooltip = ({ title, content, children, side = 'top', align = 'center' }: CritterTooltipProps) => (
  <TooltipProvider>
    <TooltipRoot delayDuration={200}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <div className="space-y-1 max-w-xs">
          <div className="font-medium text-gray-800">{title}</div>
          <div className="text-sm text-gray-600 leading-relaxed">{content}</div>
        </div>
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
)

export { CritterTooltip }