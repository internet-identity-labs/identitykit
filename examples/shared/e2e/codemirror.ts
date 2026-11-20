import { Locator } from "@playwright/test"

// The playground shows requests/responses in CodeMirror 6 editors. CodeMirror only renders
// the visible part of very long lines (e.g. canister signatures), so the DOM text of
// `.cm-content` can be truncated; read and write the editor state instead.
type EditorViewHandle = {
  state: { doc: { length: number; toString(): string } }
  dispatch(spec: { changes: { from: number; to: number; insert: string } }): void
}
type CodeMirrorContent = HTMLElement & { cmView?: { view?: EditorViewHandle } }

/** Full text of the editor whose `.cm-content` element is `content`. */
export async function readCodeMirror(
  content: Locator,
  options?: { timeout?: number }
): Promise<string> {
  return content.evaluate((el) => {
    const view = (el as CodeMirrorContent).cmView?.view
    return view ? view.state.doc.toString() : (el.textContent ?? "")
  }, options)
}

/** Parsed JSON of the editor, `{}` when it is empty. */
export async function readCodeMirrorJson<T = unknown>(
  content: Locator,
  options?: { timeout?: number }
): Promise<T> {
  const text = await readCodeMirror(content, options)
  return (text.trim() ? JSON.parse(text) : {}) as T
}

/** Replaces the editor content through a CodeMirror transaction, so the app sees a real edit. */
export async function writeCodeMirror(content: Locator, text: string): Promise<void> {
  await content.evaluate((el, insert) => {
    const view = (el as CodeMirrorContent).cmView?.view
    if (!view) throw new Error("CodeMirror view not found on .cm-content")
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert } })
  }, text)
}

/** Reads the editor JSON, applies `update` and writes it back (2-space indent). */
export async function updateCodeMirrorJson<T>(
  content: Locator,
  update: (json: T) => T
): Promise<void> {
  const json = await readCodeMirrorJson<T>(content)
  await writeCodeMirror(content, JSON.stringify(update(json), null, 2))
}
