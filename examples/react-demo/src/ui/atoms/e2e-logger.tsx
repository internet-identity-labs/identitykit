export const E2ELogger = ({ value, id }: { value: string; id: string }) => {
  return (
    <div id={id} className="hidden">
      {value}
    </div>
  )
}
