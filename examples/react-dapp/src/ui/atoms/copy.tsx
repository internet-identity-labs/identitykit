import clsx from "clsx"
import React, { HTMLAttributes } from "react"

import { IconSvgCopied, IconSvgCopy } from "./icons"

export interface ICopy extends HTMLAttributes<HTMLDivElement> {
  value: string
  iconClassName?: string
  copyTitle?: string
}

export const Copy: React.FC<ICopy> = ({ value, className, iconClassName, copyTitle }) => {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(() => {
    setCopied(true)
    navigator.clipboard.writeText(value)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [value])

  return (
    <div
      className={clsx(
        !copied && "hover:opacity-50 cursor-pointer transition-opacity",
        "flex items-center stroke-gray-400",
        className
      )}
      onClick={copyToClipboard}
    >
      <div className="w-5 h-5">
        <img src={IconSvgCopied} className={clsx(copied ? "inline-block" : "hidden")} />

        <img
          src={IconSvgCopy}
          className={clsx(iconClassName, copied ? "hidden" : "inline-block")}
        />
      </div>

      {copyTitle && <p className="w-full ml-2 text-xs font-semibold text-gray-400">{copyTitle}</p>}
    </div>
  )
}
