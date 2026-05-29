import type { Editor } from '@tiptap/react'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { NodeSelection } from '@tiptap/pm/state'
import { cn } from '@/lib/utils'

export { cn }

export function parseShortcutKeys({
	shortcutKeys,
}: {
	shortcutKeys?: string
}) {
	if (!shortcutKeys) return []

	return shortcutKeys
		.split('+')
		.map(key => key.trim())
		.filter(Boolean)
		.map(key => {
			const lowerKey = key.toLowerCase()
			if (lowerKey === 'mod') return 'Ctrl'
			if (lowerKey === 'ctrl') return 'Ctrl'
			if (lowerKey === 'alt') return 'Alt'
			if (lowerKey === 'shift') return 'Shift'
			return key.toUpperCase()
		})
}

export function isNodeInSchema(name: string, editor: Editor | null) {
	return Boolean(editor?.schema.nodes[name])
}

export function isNodeTypeSelected(editor: Editor | null, types: string[]) {
	const selection = editor?.state.selection
	if (!selection || !(selection instanceof NodeSelection)) return false

	return types.includes(selection.node.type.name)
}

export function isValidPosition(pos: number | null | undefined): pos is number {
	return typeof pos === 'number' && Number.isFinite(pos) && pos >= 0
}

export function findNodePosition({
	editor,
	node,
}: {
	editor: Editor
	node?: ProseMirrorNode | null
}) {
	if (!node) return null

	let foundPos: number | null = null

	editor.state.doc.descendants((currentNode, pos) => {
		if (currentNode === node) {
			foundPos = pos
			return false
		}
		return true
	})

	return foundPos === null ? null : { pos: foundPos }
}

export function getSelectedBlockNodes(editor: Editor | null) {
	if (!editor) return []

	const { from, to } = editor.state.selection
	const nodes: ProseMirrorNode[] = []

	editor.state.doc.nodesBetween(from, to, node => {
		if (node.isBlock) {
			nodes.push(node)
		}
	})

	return nodes
}

export function selectionWithinConvertibleTypes(
	editor: Editor | null,
	types: string[],
) {
	if (!editor) return false

	const { from, to } = editor.state.selection
	let isWithinAllowedTypes = true

	editor.state.doc.nodesBetween(from, to, node => {
		if (node.isBlock && !types.includes(node.type.name)) {
			isWithinAllowedTypes = false
			return false
		}
		return true
	})

	return isWithinAllowedTypes
}
