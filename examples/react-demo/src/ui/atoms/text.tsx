export interface TextProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Text: React.FC<TextProps> = ({ children, ...props }) => (
  <div className="text-sm leading-[22px]" {...props}>
    {children}
  </div>
)
