import { useTheme } from "next-themes"
import {
  IconSvgMoon,
  IconSvgSun,
  IconLogo,
  IconLogoWhite,
  IconSvgDocsLight,
  IconSvgDocsDark,
} from "../atoms/icons"
import { ConnectWalletButton } from "./connect-wallet-button"
import { useEffect } from "react"

export const Header = () => {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    if (localStorage.getItem("signerId")) {
      localStorage.clear()
      window.location.reload()
    }
  }, [])

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between h-[68px]">
        <div className="flex flex-col relative">
          <img className="dark:hidden w-[130px] sm:w-[140px] md:w-auto" src={IconLogo} alt="nfid" />
          <img
            className="hidden dark:block w-[130px] sm:w-[140px] md:w-auto"
            src={IconLogoWhite}
            alt="nfid"
          />
          <a
            target="_blank"
            href="https://www.npmjs.com/package/@nfid/identitykit"
            className="absolute text-[10px] text-primary dark:text-teal-500 text-right right-0 bottom-0 mb-[-10px] me-[-10px]"
          >
            v1.0.7
          </a>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <a
            target="_blank"
            href="https://docs.identitykit.xyz/"
            className="text-sm font-bold hidden sm:block"
          >
            Dev docs
          </a>
          <img
            className="block sm:hidden cursor-pointer"
            src={resolvedTheme === "light" ? IconSvgDocsLight : IconSvgDocsDark}
            onClick={() => window.open("https://docs.identitykit.xyz/", "_blank")}
            alt="docs"
          />
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
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  )
}
