import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror"
import { langs } from "@uiw/codemirror-extensions-langs"
import { Copy } from "../atoms/copy"
import { useTheme } from "next-themes"

export interface CodeSectionProps {
  value: string
  className?: string
}

export const CodeSection: React.FC<CodeSectionProps> = ({ value, className }) => {
  const { resolvedTheme } = useTheme()
  return (
    <div className={className}>
      <p className="mb-1 text-slate-500 dark:text-zinc-500 font-semibold">Implementation example</p>
      <div className="relative w-full overflow-hidden !font-mono rounded-xl">
        <div className="absolute z-50 scale-125 w-[24px] right-3 top-3">
          <Copy value={value} />
        </div>
        <CodeMirror
          value={value}
          editable={false}
          theme={resolvedTheme as ReactCodeMirrorProps["theme"]}
          extensions={[langs.jsx()]}
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
