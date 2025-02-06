import { useState } from "react"
import clsx from "clsx"
import { useTheme } from "next-themes"
import { Button, Container, Header, Social } from "./components"
import MainImgLight from "./assets/main-light.png"
import MainImgDark from "./assets/main-dark.png"
import MainImgLightMob from "./assets/main-light-mob.png"
import MainImgDarkMob from "./assets/main-dark-mob.png"
import PurpleBlurImg from "./assets/purple-blur.png"
import PurpleBlurLightImg from "./assets/purple-blur-light.png"
import GreenBg from "./assets/green-bg.png"
import BottomImgLight from "./assets/bottom-light.png"
import BottomImgDark from "./assets/bottom-dark.png"
import {
  IconSvgCheck,
  IconSvgCopiedBlack,
  IconSvgCopiedWhite,
  IconSvgCopyDark,
  IconSvgCopyLight,
  IconSvgDiscordBlack,
  IconSvgDiscordWhite,
  IconSvgGithub,
  IconSvgGithubBlack,
  IconSvgGithubWhite,
  IconSvgHands,
  IconSvgHeart,
  IconSvgLinkedinBlack,
  IconSvgLinkedinWhite,
  IconSvgMagic,
  IconSvgX,
  IconSvgXBlack,
  IconSvgXWhite,
} from "./components/icons"

function App() {
  const { resolvedTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const isLightTheme = resolvedTheme === "light"

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${GreenBg})`,
        }}
        className="green-bg overflow-x-hidden"
      >
        <Container className="container mx-auto relative z-[2]">
          <Header className="mb-[60px] md:mb-[100px] lg:mb-[140px]" />
          <div className="flex flex-col items-center">
            <h1
              className={clsx("text-[40px] md:text-[80px] lg:text-[90px] mb-[30px] md:mb-[48px]", {
                "gradient-text-light": isLightTheme,
                "gradient-text-dark": !isLightTheme,
              })}
            >
              IdentityKit
            </h1>
            <h2 className="text-[20px] md:text-[28px] mb-[16px] text-center">
              The best way to connect an ICP wallet to your dapp.
            </h2>
            <h3 className="text-center text-sm sm:text-base">
              With IdentityKit, you can support and request payments from NFID Wallet, Internet
              Identity, and other compatible wallet providers using a single, straightforward,
              standard-conformed API.
            </h3>
            <div className="my-[32px] relative w-full sm:max-w-[448px] md:max-w-[408px] lg:max-w-[596px] ">
              <input
                className={clsx(
                  "transition-all duration-200 border border-[#0D9488] dark:border-teal-500 outline-none w-full px-[14px] h-[48px] rounded-xl bg-[#A4E9E133] dark:bg-[#63EEDE0D] cursor-pointer hover:bg-[#A4E9E166] dark:hover:bg-[#63EEDE26] shadow-inner",
                  {
                    "hover:shadow-[inset_0_0_5px_#0D9488]": isLightTheme,
                    "hover:shadow-[inset_0_0_5px_#14B8A6]": !isLightTheme,
                  }
                )}
                readOnly
                value="npm install @nfid/identitykit@latest"
                onClick={() => {
                  if (copied) return
                  setCopied(true)
                  setTimeout(() => {
                    setCopied(false)
                  }, 1000)
                  navigator.clipboard.writeText("npm install @nfid/identitykit@latest")
                }}
              />
              <img
                className="absolute top-[14px] right-[14px] cursor-pointer"
                alt="copy"
                onClick={() => {
                  if (copied) return
                  setCopied(true)
                  setTimeout(() => {
                    setCopied(false)
                  }, 1000)
                  navigator.clipboard.writeText("npm install @nfid/identitykit@latest")
                }}
                src={
                  copied
                    ? isLightTheme
                      ? IconSvgCopiedBlack
                      : IconSvgCopiedWhite
                    : isLightTheme
                      ? IconSvgCopyLight
                      : IconSvgCopyDark
                }
              />
            </div>
            <div className="flex flex-col sm:flex-row w-full justify-center">
              <Button
                onClick={() => {
                  window.open("https://qzjsg-qiaaa-aaaam-acupa-cai.icp0.io/docs", "_blank")
                }}
                className="w-full sm:w-[220px] mb-[30px] sm:mb-0 sm:mr-[20px]"
              >
                Read the docs
              </Button>
              <Button
                onClick={() => {
                  window.open("https://qzjsg-qiaaa-aaaam-acupa-cai.icp0.io/demo", "_blank")
                }}
                className="w-full sm:w-[220px]"
              >
                View the demo
              </Button>
            </div>
          </div>
        </Container>
        <Container className="max-w-full flex justify-center">
          <img
            className="hidden sm:block mt-[-100px] relative sm:max-h-[680px] md:max-h-[900px] lg:max-h-[940px] xl:max-h-[970px]"
            src={isLightTheme ? MainImgLight : MainImgDark}
            alt="Signers modal"
          />
          <img
            className="sm:hidden w-[100vw] max-w-[100vw]"
            src={isLightTheme ? MainImgLightMob : MainImgDarkMob}
          />
        </Container>
        <Container className="my-[60px] sm:my-[100px] lg:my-[140px]">
          <h2 className="font-poppins text-[32px] sm:text-[40px] lg:text-[50px] justify-center flex items-center">
            NFID
            <img
              className="mx-[10px] h-[32px] w-[32px] sm:h-[56px] sm:w-[56px] lg:h-[64px] lg:w-[64px]"
              src={IconSvgHands}
            />
            developers
          </h2>
          <h3 className="text-center text-sm sm:text-base my-[30px] sm:my-[40px]">
            IdentityKit offers a quick, easy, and highly customizable solution for developers to
            integrate an excellent wallet experience into their ICP application. We handle the
            complex tasks so developers and teams can concentrate on creating outstanding products
            and communities for their users.
          </h3>
          <div className="flex flex-col sm:flex-row sm:justify-center items-center">
            <div className="flex flex-col sm:mr-[60px] md:mr-[100px] lg:mr-[150px] w-fit">
              <div className="flex items-center mb-[6px] w-fit">
                <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                Easy installation
              </div>
              <div className="flex items-center mb-[6px] w-fit">
                <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                Light and dark mode
              </div>
              <div className="flex items-center mb-[6px] w-fit">
                <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                Featured wallet mode
              </div>
              <div className="sm:hidden w-fit">
                <div className="flex items-center mb-[6px] w-fit">
                  <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                  Custom wallets list
                </div>
                <div className="flex items-center mb-[6px] w-fit">
                  <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                  Custom connect button
                </div>
                <div className="flex items-center mb-[6px] w-fit">
                  <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                  ICRC-25 compliant
                </div>
              </div>
            </div>
            <div className="flex flex-col hidden sm:flex">
              <div className="flex items-center mb-[6px] w-fit">
                <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                Custom wallets list
              </div>
              <div className="flex items-center mb-[6px] w-fit">
                <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                Custom connect button
              </div>
              <div className="flex items-center mb-[6px] w-fit">
                <img src={IconSvgCheck} alt="check" className="mr-[16px]" />
                ICRC-25 compliant
              </div>
            </div>
          </div>
        </Container>
        <Container className="py-[60px] sm:py-[80px] px-[30px] purple-bg rounded-[24px]">
          <h2 className="font-poppins text-[32px] sm:text-[40px] lg:text-[50px] justify-center flex text-[#FFEBFD] flex flex-col md:flex-row items-center">
            <span className="flex items-center">
              Made with
              <img
                className="mx-[10px] h-[32px] w-[32px] sm:h-[56px] sm:w-[56px] lg:h-[64px] lg:w-[64px]"
                src={IconSvgHeart}
              />
            </span>
            by your frens
          </h2>
          <p className="text-center text-sm sm:text-base my-[40px] text-[#FFEBFD]">
            Developing the ICP standards and IdentityKit has been a fun and collaborative effort
            involving many people at Internet Identity Labs, our frens at DFINITY, and the
            community. We're always striving to improve Identity Kit, so please let us know how we
            can enhance it or contribute to the public repo. <br />
            <br />
            Inspired by RainbowKit. Designed for everyone. Built for developers.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center">
            <Button
              icon={IconSvgX}
              className="sm:mr-[20px] w-full sm:w-[224px] md:w-[235px] mb-[20px] sm:mb-0"
              type="secondary"
              onClick={() => {
                window.open("https://x.com/IdentityMaxis", "_blank")
              }}
            >
              Follow us
            </Button>
            <Button
              icon={IconSvgGithub}
              className="w-full sm:w-[224px] md:w-[235px]"
              type="secondary"
              onClick={() => {
                window.open(
                  "https://github.com/internet-identity-labs/identitykit/issues",
                  "_blank"
                )
              }}
            >
              Share feedback
            </Button>
          </div>
        </Container>
        <Container>
          <img
            src={isLightTheme ? PurpleBlurLightImg : PurpleBlurImg}
            alt="blur"
            className="w-[90%] mx-auto"
          />
        </Container>
        <Container className="relative z-[1] mt-[10px] sm:mt-0">
          <h2 className="font-poppins text-[32px] sm:text-[40px] lg:text-[50px] justify-center flex items-center">
            See it live
            <img
              className="ml-[10px] h-[32px] w-[32px] sm:h-[56px] sm:w-[56px] lg:h-[64px] lg:w-[64px]"
              src={IconSvgMagic}
            />
          </h2>
          <p className="text-center text-sm sm:text-base my-[30px] sm:my-[40px]">
            NFID Vaults, the only decentralized multi-chain multi-sig, has implemented IdentityKit.
            <br className="hidden md:block" />
            Sneak a peak at the UX and how it’s implemented in code.
          </p>
          <Button
            onClick={() => {
              window.open("https://x37dy-zqaaa-aaaam-ab4na-cai.icp0.io/", "_blank")
            }}
            className="w-full sm:max-w-[220px] mx-auto"
          >
            Explore NFID Vaults
          </Button>
        </Container>
        <Container className="px-0 sm:mt-[-100px] pb-[calc(9vw+70px)] sm:pb-0 sm:pb-[100px] md:pb-[140px]">
          <img
            className="bottom-img"
            src={isLightTheme ? BottomImgLight : BottomImgDark}
            alt="live"
          />
        </Container>
        <Container className="flex flex-col items-center pb-[30px]">
          <div className="flex gap-x-[30px] sm:gap-x-[60px] mb-[20px]">
            <Social
              icon={IconSvgXWhite}
              lightIcon={IconSvgXBlack}
              color={isLightTheme ? "#000000" : "#FFFFFF"}
              link="https://x.com/IdentityMaxis"
            />
            <Social
              icon={IconSvgGithubWhite}
              lightIcon={IconSvgGithubBlack}
              color="#9F5D0E"
              link="https://github.com/internet-identity-labs/identitykit"
            />
            <Social
              icon={IconSvgDiscordWhite}
              lightIcon={IconSvgDiscordBlack}
              color="#3E51FF"
              link="https://discord.gg/YYC6TUjvkH"
            />
            <Social
              icon={IconSvgLinkedinWhite}
              lightIcon={IconSvgLinkedinBlack}
              color="#0D8BE1"
              link="https://www.linkedin.com/company/nfid-labs/"
            />
          </div>
          <p className="mb-0 text-center text-sm sm:text-base text-zinc-500">
            Copyright {new Date().getFullYear()}. Internet Identity Labs,
            <br className="sm:hidden" /> Inc. All Rights Reserved.
          </p>
        </Container>
      </div>
    </>
  )
}

export default App
