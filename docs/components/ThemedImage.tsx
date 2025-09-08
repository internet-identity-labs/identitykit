import Image from "next/image"
import { useTheme } from "nextra-theme-docs"

interface Props {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
}

export default function ThemedImage({ lightSrc, darkSrc, alt, className }: Props) {
  const { resolvedTheme } = useTheme()

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "3/2" }} className={className}>
      <Image
        src={resolvedTheme === "dark" ? darkSrc : lightSrc}
        alt={alt}
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  )
}
