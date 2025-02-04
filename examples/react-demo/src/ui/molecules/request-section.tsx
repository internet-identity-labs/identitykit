import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror"
import { langs } from "@uiw/codemirror-extensions-langs"
import { E2ELogger } from "../atoms"
import { useTheme } from "next-themes"
import { Copy } from "../atoms"

export interface RequestSectionProps {
  value: string
  setValue: (value: string) => void
  id?: string
}

export const RequestSection: React.FC<RequestSectionProps> = ({ value, setValue, id }) => {
  const { resolvedTheme } = useTheme()
  return (
    <div>
      <p className="text-slate-500 dark:text-zinc-500 font-semibold mb-1">Request</p>
      <div className="relative w-full overflow-hidden !font-mono rounded-xl">
        <div className="absolute z-40 scale-125 w-[24px] right-3 top-3">
          <Copy value={value} />
        </div>
        <E2ELogger value={value} id="request-section-e2e" />
        <CodeMirror
          id={id}
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
          readOnly={true}
          editable={false}
        />
      </div>
    </div>
  )
}
