import React from "react"

export const Stack = ({ children }: { children: JSX.Element }) => (
  <div className="flex gap-2 mt-4 mb-8">
    {children && React.Children.map(children, (child) => <div>{child}</div>)}
  </div>
)
