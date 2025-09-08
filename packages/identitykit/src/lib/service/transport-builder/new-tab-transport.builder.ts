import { Transport } from "@slide-computer/signer"
import { PostMessageTransport, PostMessageTransportOptions } from "@slide-computer/signer-web"

export async function getPopupTransportBuilder(
  options: PostMessageTransportOptions
): Promise<Transport> {
  return new PostMessageTransport({
    ...options,
    detectNonClickEstablishment: false,
    disconnectTimeout: isMobileUserAgent() ? 3_000_000 : 10_000,
  })
}

function isMobileUserAgent(): boolean {
  // Method 1: Check user agent for mobile/tablet indicators (most reliable)
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobileUserAgent =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/.test(userAgent)

  // Method 2: Check actual screen size (device pixels, not browser window)
  const isSmallScreen = screen.width <= 768 || screen.height <= 768

  // Method 3: Check for touch-primary devices
  const isTouchPrimary =
    navigator.maxTouchPoints > 1 && !window.matchMedia("(hover: hover) and (pointer: fine)").matches

  // Method 4: Check device pixel ratio (mobile devices typically have higher DPR)
  const hasHighDPR = window.devicePixelRatio > 1.5

  // Method 5: Check for mobile-specific APIs
  const hasMobileAPIs = "orientation" in window || "onorientationchange" in window

  // Combine methods - prioritize user agent and screen size over touch
  const notDesktop =
    isMobileUserAgent ||
    (isSmallScreen && (isTouchPrimary || hasHighDPR)) ||
    (isTouchPrimary && hasMobileAPIs)

  return notDesktop
}
