import clsx from "clsx"

export function FormGroup({
  className,
  error,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { error?: string }) {
  return (
    <div {...props} className={clsx("w-full mb-[10px]", className)}>
      {children}
      {error && <div className="w-full text-red-500 text-xs">{error}</div>}
    </div>
  )
}
