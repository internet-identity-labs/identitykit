import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror"
import { langs } from "@uiw/codemirror-extensions-langs"
import { Copy, E2ELogger } from "../atoms"
import { useTheme } from "next-themes"
import clsx from "clsx"

export interface ResponseSectionProps {
  value: string
  className?: string
  id?: string
}

export const ResponseSection: React.FC<ResponseSectionProps> = ({ value, className, id }) => {
  const { resolvedTheme } = useTheme()
  return (
    <div>
      <p className={clsx("text-slate-500 dark:text-zinc-500 font-semibold mb-1", className)}>
        Response
      </p>
      <div className="relative w-full overflow-hidden !font-mono rounded-xl">
        <div className="absolute z-40 scale-125 w-[24px] right-3 top-3">
          <Copy value={value} />
        </div>
        <E2ELogger value={value} id="response-section-e2e" />
        <CodeMirror
          id={id}
          height="350px"
          value={value}
          editable={false}
          theme={resolvedTheme as ReactCodeMirrorProps["theme"]}
          extensions={[langs.json()]}
          basicSetup={{
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
            highlightActiveLine: false,
          }}
        />
      </div>
    </div>
  )
}
