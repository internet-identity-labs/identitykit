import clsx from "clsx"
import { LogoutIcon } from "../../../icons"
import { Item, ItemProps } from "./item"
import { ItemText } from "./item-text"

export type DisconnectItemProps = ItemProps

export function DisconnectItem(props: DisconnectItemProps) {
  return (
    <Item {...props} className={clsx("ik-component", props.className)}>
      <ItemText id={"disconnect"}>Disconnect</ItemText>
      <LogoutIcon />
    </Item>
  )
}
