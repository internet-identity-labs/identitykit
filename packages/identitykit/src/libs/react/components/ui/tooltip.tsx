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
            "ik-text-white ik-text-sm ik-font-light ik-bg-black ik-py-2 ik-px-6 ik-rounded",
            className,
            ["left", "right"].includes(contentProps.side || "top") ? "ik-my-2" : "ik-mx-2"
          )}
          {...contentProps}
        >
          {tip}
          <RadixTooltip.Arrow className="ik-fill-current ik-text-black" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
