import { useTheme } from "next-themes"
import {
  IconSvgMoon,
  IconLogo,
  IconLogoWhite,
  IconSvgSun,
  IconSvgDocsLight,
  IconSvgDocsDark,
} from "../atoms/icons"
import {
  formatIcp,
  ConnectWallet,
  ConnectWalletButton,
  ConnectedWalletButton,
} from "@nfid/identitykit/react"

export const Header = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between h-[68px]">
        <div className="flex flex-col relative">
          <a href={import.meta.env.VITE_LANDING_URL} target="_blank">
            <img
              className="dark:hidden w-[130px] sm:w-[140px] md:w-auto"
              src={IconLogo}
              alt="nfid"
            />
            <img
              className="hidden dark:block w-[130px] sm:w-[140px] md:w-auto"
              src={IconLogoWhite}
              alt="nfid"
            />
          </a>
          <a
            target="_blank"
            href="https://www.npmjs.com/package/@nfid/identitykit"
            className="absolute text-[10px] text-primary dark:text-teal-500 text-right right-0 bottom-0 mb-[-10px] me-[-10px]"
          >
            v1.0.10
          </a>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <a
            target="_blank"
            href={`${import.meta.env.VITE_LANDING_URL}/docs`}
            className="text-sm font-bold hidden sm:block"
          >
            Dev docs
          </a>
          <img
            className="block sm:hidden cursor-pointer"
            src={resolvedTheme === "light" ? IconSvgDocsLight : IconSvgDocsDark}
            onClick={() => window.open(`${import.meta.env.VITE_LANDING_URL}/docs`, "_blank")}
            alt="docs"
          />
          {resolvedTheme === "light" ? (
            <img
              id={"changeTheme"}
              className="w-5 transition-opacity cursor-pointer hover:opacity-50"
              src={IconSvgSun}
              alt="light"
              onClick={() => setTheme("dark")}
            />
          ) : (
            <img
              id={"changeTheme"}
              className="w-5 transition-opacity cursor-pointer hover:opacity-50"
              src={IconSvgMoon}
              alt="dark"
              onClick={() => setTheme("light")}
            />
          )}
          <ConnectWallet
            connectButtonComponent={(props) => {
              return (
                <ConnectWalletButton {...props} className="min-w-[100px] sm:min-w-[140px]">
                  <small className="flex">
                    Connect<span className="hidden md:block">&nbsp;wallet</span>
                  </small>
                </ConnectWalletButton>
              )
            }}
            connectedButtonComponent={(props) => {
              return (
                <ConnectedWalletButton {...props} className="min-w-[100px] sm:min-w-[140px]">
                  <small className="mr-2 hidden md:block">
                    {props.connectedAccount.substring(0, 5)}...
                    {props.connectedAccount.substring(props.connectedAccount.length - 5)}
                  </small>
                  <div className="bg-white px-[5px] rounded-md">
                    <small className="text-black font-normal text-xs">
                      {props.icpBalance !== undefined && `${formatIcp(props.icpBalance)} ICP`}
                    </small>
                  </div>
                </ConnectedWalletButton>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}
