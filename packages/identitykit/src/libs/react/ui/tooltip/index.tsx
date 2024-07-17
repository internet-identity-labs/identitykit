import * as RadixTooltip from "@radix-ui/react-tooltip"
import clsx from "clsx"
import React from "react"

interface TooltipProps extends RadixTooltip.TooltipContentProps {
  tip: string | React.ReactNode
  children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ tip, children, className, ...contentProps }) => {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          sideOffset={5}
          className={clsx(
            "text-white text-sm font-light bg-black py-2 px-6 rounded",
            className,
            ["left", "right"].includes(contentProps.side || "top") ? "my-2" : "mx-2"
          )}
          {...contentProps}
        >
          {tip}
          <RadixTooltip.Arrow className="fill-current text-black" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
