import clsx from "clsx"
import React from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

export const Input: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className, ...props }, ref) => {
    return (
      <div>
        <input
          id={props.name}
          className={clsx(
            "w-full bg-white rounded-xl h-12 px-3 py-2.5 dark:text-white dark:bg-white/5 border border-black dark:border-zinc-500 active:outline focus:!border-teal-500 !outline-teal-500",
            {
              "!border-red-500 focus:!border-red-500 focus:!outline-red-500 active:!outline-red-500":
                !!invalid,
            },
            className
          )}
          {...props}
          ref={ref}
        />
      </div>
    )
  }
)
