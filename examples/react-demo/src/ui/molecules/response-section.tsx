import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { Copy } from "../atoms/copy"
import { E2ELogger } from "../atoms/e2e"
import { useTheme } from "next-themes"

export interface ResponseSectionProps {
  value: string
}

export const ResponseSection: React.FC<ResponseSectionProps> = ({ value }) => {
  const { theme } = useTheme()
  return (
    <div>
      <p className="mb-1 text-slate-500 dark:text-zinc-700">Response</p>
      <div className="relative w-full overflow-hidden !font-mono rounded-xl">
        <div className="absolute z-40 scale-125 w-[24px] right-3 top-3">
          <Copy value={value} />
        </div>
        <E2ELogger value={value} id="response-section-e2e" />
        <CodeMirror
          id="response-section"
          height="350px"
          value={value}
          editable={false}
          theme={theme as ReactCodeMirrorProps["theme"]}
          extensions={[json()]}
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
