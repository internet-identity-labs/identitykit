import Image from "next/image"
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"

import LogoLight from "./public/img/logo-light.svg"
import LogoDark from "./public/img/logo-dark.svg"

import { useConfig } from "nextra-theme-docs"

const REPO_BASE = "https://github.com/internet-identity-labs/identitykit"
const TWITTER_LINK = "https://twitter.com/@IdentityMaxis"

const theme = {
  useNextSeoProps() {
    return {
      titleTemplate: "NFID IdentityKit Docs | %s",
    }
  },
  logo: (
    <div>
      <div className="flex items-center dark:hidden">
        <Image src={LogoLight} alt="logo" width={159} height={30} />
      </div>
      <div className="items-center hidden dark:flex">
        <Image src={LogoDark} alt="logo" width={159} height={30} />
      </div>
    </div>
  ),
  docsRepositoryBase: `${REPO_BASE}/blob/main/docs`,
  project: {
    link: REPO_BASE,
    icon: <GitHubLogoIcon />,
  },
  chat: {
    link: TWITTER_LINK,
    icon: <TwitterLogoIcon />,
  },
  sidebar: {
    toggleButton: true,
    defaultMenuCollapseLevel: 1,
  },
  color: {
    hue: {
      dark: 173,
      light: 175,
    },
    saturation: {
      dark: 80,
      light: 69,
    },
    lightness: {
      dark: 40,
      light: 26,
    },
  },
  backgroundColor: {
    dark: "20,21,24",
    light: "255,255,255",
  },
  banner: {
    key: "1.0.17-release",
    content: (
      <a href="https://www.npmjs.com/package/@nfid/identitykit" target="_blank">
        🎉 @nfid/identitykit@1.0.17 is released.
      </a>
    ),
  },
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  head: () => {
    const { title } = useConfig()

    return (
      <>
        <title>
          {title && title !== "Index"
            ? `NFID IdentityKit | Docs | ${title}`
            : "NFID IdentityKit | Docs"}
        </title>
        <meta name="descriptiom" content="The complete guide to NFID IdentityKit" />
        <meta name="keywords" content="ICP, identity, wallet, dApp, react, blockchain, crypto" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta property="og:title" content="NFID IdentityKit | Docs" />
        <meta property="og:description" content="The complete guide to NFID IdentityKit" />
        <meta property="og:site_name" content="NFID IdentityKit | Docs" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qzjsg-qiaaa-aaaam-acupa-cai.icp0.io/docs" />
        <meta
          property="og:image"
          content="https://qzjsg-qiaaa-aaaam-acupa-cai.icp0.io/nfid-identitykit-og.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="NFID IdentityKit" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NFID IdentityKit | Docs" />
        <meta name="twitter:description" content="The complete guide to NFID IdentityKit" />
        <meta name="twitter:site" content="@NFIDIdentityKit" />
        <meta
          name="twitter:image"
          content="https://qzjsg-qiaaa-aaaam-acupa-cai.icp0.io/img/nfid-identitykit-og.png"
        />
        <meta name="twitter:image:alt" content="NFID IdentityKit" />
      </>
    )
  },
  footer: {
    content: <span>© {new Date().getFullYear()} Internet Identity Labs.</span>,
  },
}

export default theme
