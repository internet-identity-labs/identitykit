export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const Title: React.FC<TitleProps> = ({ children, ...props }) => (
  <h2 className="mb-5 text-xl font-normal" {...props}>
    {children}
  </h2>
)
