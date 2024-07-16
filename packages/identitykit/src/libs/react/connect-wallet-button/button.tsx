import { useContext, useEffect, useState } from "react"
import { IdentityKitContext } from "../context"
import clsx from "clsx"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { CopiedIcon, CopyIcon, LogoutIcon } from "./icons"
import { CopyToClipboard } from "../ui"

export function Button() {
  const { selectedSigner, toggleModal, selectSigner, identityKit } = useContext(IdentityKitContext)
  const [connectedAddress, setConnectedAddress] = useState<string | undefined>(undefined)
  const [connectedAddressCopied, setConnectedAddressCopied] = useState(false)

  useEffect(() => {
    if (selectedSigner && identityKit !== null) {
      identityKit.signerClient.login({
        onSuccess: () => {
          setConnectedAddress(identityKit.signerClient.getIdentity().getPrincipal().toText())
        },
      })
    }
  }, [selectedSigner, identityKit])

  if (!connectedAddress)
    return (
      <button
        type="button"
        onClick={() => {
          toggleModal()
        }}
        className={clsx(
          "text-black bg-transparent border-gray-900",
          "hover:text-white hover:bg-gray-900 hover:border-gray-900 hover:shadow-md",
          "active:text-white active:bg-gray-900",
          "disabled:shadow-none disabled:bg-white disabled:border-gray-300 disabled:text-gray-300",
          "dark:border-white dark:text-white dark:hover:text-black dark:hover:bg-white",
          "dark:active:text-black dark:active:bg-gray-300 dark:active:border-none",
          "h-12 px-[15px] rounded-xl border"
        )}
      >
        Connect wallet
      </button>
    )

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          as={(props: any) => (
            <button
              type="button"
              className={clsx(
                "text-black bg-transparent border-gray-900",
                "hover:text-white hover:bg-gray-900 hover:border-gray-900 hover:shadow-md",
                "active:text-white active:bg-gray-900",
                "disabled:shadow-none disabled:bg-white disabled:border-gray-300 disabled:text-gray-300",
                "dark:border-white dark:text-white dark:hover:text-black dark:hover:bg-white",
                "dark:active:text-black dark:active:bg-gray-300 dark:active:border-none",
                "h-12 px-[15px] rounded-xl border"
              )}
              {...props}
            >
              Connect wallet
            </button>
          )}
        />
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 min-w-[320px] origin-top-right rounded-3xl bg-white dark:bg-zinc-900 shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in p-2.5"
      >
        <div className="py-1">
          <MenuItem>
            <CopyToClipboard
              value={connectedAddress}
              onCopied={() => setConnectedAddressCopied(true)}
              onCopiedTimeout={() => setConnectedAddressCopied(false)}
              component={({ onClick }: { onClick: () => unknown }) => (
                <div className="flex justify-between w-full p-2.5 cursor-pointer" onClick={onClick}>
                  <small className="font-semibold text-black dark:text-white">Wallet address</small>
                  <div className="flex">
                    <small className="font-semibold">{`${connectedAddress.substring(0, 5)}...${connectedAddress.substring(connectedAddress.length - 5)}`}</small>
                    {connectedAddressCopied ? (
                      <CopiedIcon className="ml-2" />
                    ) : (
                      <CopyIcon className="ml-2" />
                    )}
                  </div>
                </div>
              )}
            />
          </MenuItem>
          <MenuItem>
            <div
              className="flex justify-between w-full p-2.5 text-black dark:text-white cursor-pointer"
              onClick={() => {
                identityKit.signerClient!.logout()
                selectSigner(undefined)
                setConnectedAddress(undefined)
              }}
            >
              <small className="font-semibold text-black dark:text-white">Disconnect</small>
              <LogoutIcon />
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}
