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
import { toast } from "react-toastify"

export const Header = ({
  onConnectWalletSuccess,
  onWalletDisconnect,
  triggerManualWalletDisconnect,
}: {
  onConnectWalletSuccess?: (response: object) => unknown
  onWalletDisconnect?: () => unknown
  triggerManualWalletDisconnect?: boolean
}) => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between h-[68px]">
        <img className="dark:hidden w-[130px] sm:w-[140px] md:w-auto" src={IconLogo} alt="nfid" />
        <img
          className="hidden dark:block w-[130px] sm:w-[140px] md:w-auto"
          src={IconLogoWhite}
          alt="nfid"
        />
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
          <ConnectWallet
            triggerManualDisconnect={triggerManualWalletDisconnect}
            onConnectFailure={(e) => {
              toast.error(e.message)
            }}
            onConnectSuccess={onConnectWalletSuccess}
            onDisconnect={onWalletDisconnect}
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
