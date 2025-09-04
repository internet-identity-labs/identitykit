import Image from "next/image"
import { useTheme } from "nextra-theme-docs"

interface Props {
  lightSrc: string
  darkSrc: string
  alt: string
  width?: number
  height?: number
}

export default function ThemedImage({ lightSrc, darkSrc, alt, width = 600, height = 400 }: Props) {
  const { theme } = useTheme()
  return (
    <Image src={theme === "dark" ? darkSrc : lightSrc} alt={alt} width={width} height={height} />
  )
}
