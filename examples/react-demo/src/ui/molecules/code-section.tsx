import CodeMirror from "@uiw/react-codemirror"
import { langs } from "@uiw/codemirror-extensions-langs"
import { Copy } from "../atoms/copy"

export interface CodeSectionProps {
  value: string
}

export const CodeSection: React.FC<CodeSectionProps> = ({ value }) => {
  return (
    <div>
      <p>Implementation example</p>
      <div className="relative w-full overflow-hidden !font-mono rounded-xl">
        <div className="absolute z-50 scale-125 w-[24px] right-3 top-3">
          <Copy value={value} />
        </div>
        <CodeMirror
          value={value}
          editable={false}
          theme={"dark"}
          extensions={[langs.typescript()]}
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
