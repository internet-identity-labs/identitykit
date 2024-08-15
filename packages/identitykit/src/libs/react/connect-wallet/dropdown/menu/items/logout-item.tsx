import { LogoutIcon } from "../../../icons"
import { Item, ItemProps } from "./item"
import { ItemInner } from "./item-inner"

export function LogoutItem({ onClick, ...props }: { onClick?: () => unknown } & ItemProps) {
  return (
    <Item {...props}>
      <ItemInner onClick={onClick}>
        <small className="font-semibold text-black dark:text-white">Disconnect</small>
        <LogoutIcon />
      </ItemInner>
    </Item>
  )
}
