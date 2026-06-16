


import type { Editor } from '@tiptap/react'

export function useTiptapEditor(editor?: Editor | null) {
	return { editor: editor ?? null }
}
