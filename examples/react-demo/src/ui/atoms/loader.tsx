import clsx from "clsx"
import React from "react"
import { Spinner } from "./spinner"

interface LoaderProps {
  isLoading: boolean
  fullscreen?: boolean
  imageClasses?: string
  text?: string
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({
  isLoading,
  fullscreen = true,
  imageClasses,
  text = "Loading...",
  className,
}) =>
  isLoading && fullscreen ? (
    <div
      id="loader"
      className={clsx("fixed top-0 bottom-0 left-0 right-0 z-50 w-full h-full", className)}
    >
      <div
        className={clsx(
          "absolute w-full h-full top-0 right-0 bottom-0 left-0pointer-events-none select-none",
          "z-50 backdrop-blur-[2px] bg-white/50 dark:bg-[#242427] dark:bg-opacity-50"
        )}
      />
      <div className="w-full h-full flex flex-col items-center justify-center relative z-[51]">
        <div className={clsx("w-[50px] min-w-[50px]", "select-none pointer-events-none")}>
          <Spinner className="w-[50px] text-primary" />
        </div>
        <p className="mt-4 text-sm text-primary">{text}</p>
      </div>
    </div>
  ) : isLoading && !fullscreen ? (
    <Spinner id="loader" className={clsx("select-none pointer-events-none", imageClasses)} />
  ) : null
