export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => (
  <a href={href} className="inline-block text-teal-600 hover:underline" {...props}>
    {children}
  </a>
)
