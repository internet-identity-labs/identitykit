import { useState } from "react"
import { clsx } from "clsx"
import { useTheme } from "next-themes"

export function Social({
  className,
  icon,
  lightIcon,
  color,
  link,
}: {
  className?: string
  icon: string
  lightIcon: string
  color: string
  link: string
}) {
  const [hovered, setHovered] = useState(false)
  const { resolvedTheme } = useTheme()
  return (
    <div
      onClick={() => {
        window.open(link, "_blank")
      }}
      className={clsx(
        "flex flex-col h-[54px] w-[40px] transition-all duration-200 active:opacity-70 cursor-pointer",
        className
      )}
      onMouseOver={() => {
        setHovered(true)
      }}
      onMouseOut={() => {
        setHovered(false)
      }}
    >
      <img className="max-h-[38px]" src={resolvedTheme === "light" ? lightIcon : icon} />
      <div
        style={{
          background: color,
        }}
        className={clsx(`h-[4px] transition-all duration-200 mt-auto`, {
          "w-full": hovered,
          "w-0": !hovered,
        })}
      />
    </div>
  )
}
