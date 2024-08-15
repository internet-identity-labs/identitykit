import { useState } from "react"
import { CopyToClipboard } from "../../../../ui"
import { CopiedIcon, CopyIcon } from "../../../icons"
import { Item, ItemProps } from "./item"
import { ItemInner } from "./item-inner"

const VISIBLE_ADDRESS_CHARS_NUMBER = 5

export function AddressItem({
  value,
  ...props
}: {
  value: string
} & ItemProps) {
  const [connectedAddressCopied, setConnectedAddressCopied] = useState(false)
  return (
    <Item {...props}>
      <CopyToClipboard
        value={value}
        onCopied={() => setConnectedAddressCopied(true)}
        onCopiedTimeout={() => setConnectedAddressCopied(false)}
        component={({ onClick }: { onClick: () => unknown }) => (
          <ItemInner onClick={onClick}>
            <small className="font-semibold text-black dark:text-white">Wallet address</small>
            <div className="flex">
              <small className="font-semibold">{`${value.substring(0, VISIBLE_ADDRESS_CHARS_NUMBER)}...${value.substring(value.length - VISIBLE_ADDRESS_CHARS_NUMBER)}`}</small>
              {connectedAddressCopied ? (
                <CopiedIcon className="ml-2" />
              ) : (
                <CopyIcon className="ml-2" />
              )}
            </div>
          </ItemInner>
        )}
      />
    </Item>
  )
}
