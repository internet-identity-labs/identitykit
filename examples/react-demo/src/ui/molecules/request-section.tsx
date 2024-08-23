import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror"
import { langs } from "@uiw/codemirror-extensions-langs"
import { Copy } from "../atoms/copy"
import { E2ELogger } from "../atoms/e2e"
import { useTheme } from "next-themes"

export interface RequestSectionProps {
  value: string
  setValue: (value: string) => void
}

export const RequestSection: React.FC<RequestSectionProps> = ({ value, setValue }) => {
  const { resolvedTheme } = useTheme()
  return (
    <div>
      <p className="text-slate-500 dark:text-zinc-500 font-semibold mb-1">
        Request <span className="text-sm opacity-50">(editable)</span>
      </p>
      <div className="relative w-full overflow-hidden !font-mono rounded-xl">
        <div className="absolute z-40 scale-125 w-[24px] right-3 top-3">
          <Copy value={value} />
        </div>
        <E2ELogger value={value} id="request-section-e2e" />
        <CodeMirror
          height="350px"
          value={value}
          onChange={setValue}
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
