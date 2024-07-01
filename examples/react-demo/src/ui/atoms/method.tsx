export interface MethodProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Method: React.FC<MethodProps> = ({ children, ...props }) => (
  <span
    className="inline-block px-1 font-mono text-white rounded-md bg-zinc-800 dark:bg-zinc-100 dark:text-black"
    {...props}
  >
    {children}
  </span>
)
