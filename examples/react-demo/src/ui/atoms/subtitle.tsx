export interface SubTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const SubTitle: React.FC<SubTitleProps> = ({ children, ...props }) => (
  <h2 className="text-xl font-normal" {...props}>
    {children}
  </h2>
)
