import { LogoutIcon } from "../../../icons"
import { Item, ItemProps } from "./item"
import { ItemInner } from "./item-inner"

export function LogoutItem({ onClick, ...props }: { onClick?: () => unknown } & ItemProps) {
  return (
    <Item {...props}>
      <ItemInner onClick={onClick}>
        <small className="ik-font-semibold ik-text-black dark:ik-text-white">Disconnect</small>
        <LogoutIcon />
      </ItemInner>
    </Item>
  )
}
