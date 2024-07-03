import { PropsWithChildren } from "react"
import { Title } from "../atoms/title"

export const SectionContainer = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  return (
    <div>
      <Title className="text-2xl mb-3">{title}</Title>
      <div className="space-y-10">{children}</div>
    </div>
  )
}
