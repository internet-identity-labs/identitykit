import { useTheme } from "next-themes"
import { IconLogoDark, IconLogoLight, IconSvgSun, IconSvgMoon } from "./icons"
import clsx from "clsx"

export function Header({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <div className={clsx("flex justify-between h-[80px] items-center", className)}>
      <img alt="logo" src={resolvedTheme === "light" ? IconLogoDark : IconLogoLight} />
      {resolvedTheme === "light" ? (
        <img
          className="w-5 transition-opacity cursor-pointer hover:opacity-50"
          src={IconSvgSun}
          alt="light"
          onClick={() => setTheme("dark")}
        />
      ) : (
        <img
          className="w-5 transition-opacity cursor-pointer hover:opacity-50"
          src={IconSvgMoon}
          alt="dark"
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  )
}
