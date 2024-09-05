import { useState } from "react"
import { CopyToClipboard } from "../../../../ui"
import { CopiedIcon, CopyIcon } from "../../../icons"
import { Item, ItemProps } from "./item"
import { ItemText } from "./item-text"

const VISIBLE_ADDRESS_CHARS_NUMBER = 5

export function AddressItem({
  value,
  ...props
}: {
  value: string
} & Omit<ItemProps, "onClick">) {
  const [connectedAddressCopied, setConnectedAddressCopied] = useState(false)
  return (
    <CopyToClipboard
      value={value}
      onCopied={() => setConnectedAddressCopied(true)}
      onCopiedTimeout={() => setConnectedAddressCopied(false)}
      component={({ onClick }: { onClick: () => unknown }) => (
        <Item onClick={onClick} {...props}>
          <ItemText>Wallet address</ItemText>
          <div className="ik-flex">
            <small className="ik-font-semibold">{`${value.substring(0, VISIBLE_ADDRESS_CHARS_NUMBER)}...${value.substring(value.length - VISIBLE_ADDRESS_CHARS_NUMBER)}`}</small>
            {connectedAddressCopied ? (
              <CopiedIcon className="ik-ml-2" />
            ) : (
              <CopyIcon className="ik-ml-2" />
            )}
          </div>
        </Item>
      )}
    />
  )
}
