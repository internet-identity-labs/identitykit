import { useTheme } from "next-themes"
import { IconSvgMoon, IconSvgNFID, IconSvgNFIDWhite, IconSvgSun } from "../atoms/icons"
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
    <div className="flex items-center justify-between h-[68px] mb-3">
      <img className="dark:hidden" src={IconSvgNFID} alt="nfid" />
      <img className="hidden dark:block" src={IconSvgNFIDWhite} alt="nfid" />
      <div className="flex items-center gap-10">
        <a target="_blank" href="https://docs.identitykit.xyz/" className="text-sm font-bold">
          NFID IdentityKit Docs
        </a>
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
  )
}
