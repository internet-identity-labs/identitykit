import { HTMLProps } from "react"
import { Button } from "../ui/button"

export type ConnectButtonProps = HTMLProps<HTMLButtonElement> & { loading?: boolean }

export function ConnectButton({
  onClick,
  className,
  disabled,
  loading,
  children,
}: ConnectButtonProps) {
  return (
    <Button
      id={"connect"}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      className={className}
    >
      {children ?? <small>Connect wallet</small>}
    </Button>
  )
}
