// Назначение: React-хук use-tiptap-editor.
// Как работает: Инкапсулирует состояние, эффекты и обработчики, чтобы компоненты не дублировали эту логику.

import type { Editor } from '@tiptap/react'

export function useTiptapEditor(editor?: Editor | null) {
	return { editor: editor ?? null }
}
