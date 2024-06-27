import Image from "next/image"
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"

import LogoLight from "./public/img/logo-light.png"
import LogoDark from "./public/img/logo-dark.png"
import { useConfig } from "nextra-theme-docs"

const REPO_BASE = "https://github.com/internet-identity-labs/nfid"
const TWITTER_LINK = "https://twitter.com/@IdentityMaxis"

const theme = {
  useNextSeoProps() {
    return {
      titleTemplate: "NFID Docs - %s",
    }
  },
  logo: (
    <div>
      <div className="flex items-center dark:hidden">
        <Image src={LogoLight} alt="logo" width={67} height={32} />
      </div>
      <div className="items-center hidden dark:flex">
        <Image src={LogoDark} alt="logo" width={67} height={32} />
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
  head: () => {
    const { frontMatter } = useConfig()

    const ogTitle = frontMatter.title || "NFID Docs"
    const ogDescription = frontMatter.description || "NFID Docs"

    const ogImage = frontMatter.image
      ? `https://docs.nfid.one${frontMatter.image}`
      : "https://3y5ko-7qaaa-aaaal-aaaaq-cai.ic0.app/assets/nfid_og.png"

    return (
      <>
        <meta name="description" content={ogDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@IdentityMaxis" />
        <meta name="twitter:image" content={ogImage} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
      </>
    )
  },
  footer: {
    text: (
      <span>
        © {new Date().getFullYear() + " "}
        Internet Identity Labs.
      </span>
    ),
  },
  // ... other theme options
}

export default theme
