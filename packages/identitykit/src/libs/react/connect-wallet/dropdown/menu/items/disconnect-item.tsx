import { LogoutIcon } from "../../../icons"
import { Item, ItemProps } from "./item"
import { ItemText } from "./item-text"

export function DisconnectItem(props: { onClick?: () => unknown } & ItemProps) {
  return (
    <Item {...props}>
      <ItemText>Disconnect</ItemText>
      <LogoutIcon />
    </Item>
  )
}
