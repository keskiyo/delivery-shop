// Назначение: создание и настройка Tiptap-редактора.
// Как работает: Подключает расширения, передает стартовый контент и возвращает готовый editor для UI.

import type { Editor } from '@tiptap/react'

export function useTiptapEditor(editor?: Editor | null) {
	return { editor: editor ?? null }
}
