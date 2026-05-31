'use client'

import { TiptapEditorProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/types/tiptap'
import { Extension } from '@tiptap/core'
import FileHandler from '@tiptap/extension-file-handler'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { NodeSelection, Plugin, TextSelection } from '@tiptap/pm/state'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Loader2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { handleImageUpload } from '../../../utils/upload-image'
import '../css/editor.css'
import { AllowHtmlAttributes } from './AllowHtmlAttributes'
import { Counter } from './Counter'
import MainToolbar from './MainToolbar'

const InsertTextAfterSelectedImage = Extension.create({
	name: 'insertTextAfterSelectedImage',

	addProseMirrorPlugins() {
		return [
			new Plugin({
				props: {
					handleTextInput(view, _from, _to, text) {
						const { selection } = view.state

						if (
							!(selection instanceof NodeSelection) ||
							selection.node.type.name !== 'image'
						) {
							return false
						}

						let transaction = view.state.tr
						const resolvedPosition = transaction.doc.resolve(selection.to)
						const textPosition = resolvedPosition.parent.inlineContent
							? selection.to
							: selection.to + 1

						if (!resolvedPosition.parent.inlineContent) {
							const paragraph = view.state.schema.nodes.paragraph?.create()

							if (!paragraph) {
								return false
							}

							transaction = transaction.insert(selection.to, paragraph)
						}

						transaction = transaction
							.setSelection(TextSelection.create(transaction.doc, textPosition))
							.insertText(text)
							.scrollIntoView()

						view.dispatch(transaction)
						return true
					},

					handleKeyDown(view, event) {
						const { selection, schema } = view.state

						if (
							!(selection instanceof NodeSelection) ||
							selection.node.type.name !== 'image' ||
							event.key !== 'Enter'
						) {
							return false
						}

						const paragraph = schema.nodes.paragraph?.create()

						if (!paragraph) {
							return false
						}

						const transaction = view.state.tr
							.insert(selection.to, paragraph)
							.setSelection(
								TextSelection.create(
									view.state.tr.doc,
									selection.to + paragraph.nodeSize - 1
								)
							)
							.scrollIntoView()

						view.dispatch(transaction)
						return true
					},
				},
			}),
		]
	},
})

export const TiptapEditor = ({
	content,
	onContentChange,
}: TiptapEditorProps) => {
	const [stats, setStats] = useState({ characters: 0, words: 0 })
	const [showDragIcon, setShowDragIcon] = useState(false)

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				undoRedo: {
					depth: 500,
					newGroupDelay: 100,
				},
				link: {
					openOnClick: false,
				},
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			TextStyleKit.configure({
				fontSize: {
					types: ['heading', 'paragraph', 'textStyle'],
				},
			}),
			CharacterCount,
			Placeholder.configure({
				placeholder: 'Начните писать статью здесь …',
			}),
			AllowHtmlAttributes,
			InsertTextAfterSelectedImage,
			TableKit,
			Image.configure({
				resize: {
					enabled: true,
					directions: [
						'top',
						'bottom',
						'left',
						'right',
						'top-left',
						'top-right',
						'bottom-left',
						'bottom-right',
					],
					minWidth: 50,
					minHeight: 50,
					alwaysPreserveAspectRatio: false,
				},
				allowBase64: true,
				HTMLAttributes: {
					class: 'tiptap-image',
				},
			}),
			FileHandler.configure({
				allowedMimeTypes: [
					'image/jpeg',
					'image/jpg',
					'image/png',
					'image/webp',
				],

				onDrop: async (currentEditor, files) => {
					if (!currentEditor) return

					for (const file of files) {
						await handleImageUpload(file, currentEditor)
					}
				},

				onPaste: (currentEditor, files, htmlContent) => {
					if (!currentEditor) return

					if (htmlContent && htmlContent.includes('<img')) {
						return false
					}

					if (htmlContent && htmlContent.includes('<img')) {
						return false
					}

					if (files.length > 0) {
						files.forEach(async file => {
							await handleImageUpload(file, currentEditor)
						})
						return true
					}

					return false
				},
			}),
		],
		content,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			const html = editor.getHTML()
			onContentChange(html)

			const characters = editor.storage.characterCount.characters()
			const words = editor.storage.characterCount.words()

			setStats({ characters, words })
		},
	})

	useEffect(() => {
		if (!editor) return

		const nextContent = content || ''
		const currentContent = editor.isEmpty ? '' : editor.getHTML()

		if (currentContent === nextContent) return

		editor.commands.setContent(nextContent, {
			emitUpdate: false,
			parseOptions: {
				preserveWhitespace: 'full',
			},
		})

		const characters = editor.storage.characterCount.characters()
		const words = editor.storage.characterCount.words()

		setStats({ characters, words })
	}, [content, editor])

	if (!editor) {
		return (
			<div className='border border-border rounded-lg p-3'>
				<div className='min-h-50 bg-surface-subtle rounded p-3 flex flex-col items-center justify-center'>
					<Loader2 className='h-8 w-8 text-muted-foreground animate-spin mb-3' />
					<div className='text-muted-foreground text-sm'>
						Инициализация редактора...
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='border border-border rounded-lg overflow-hidden'>
			<MainToolbar
				editor={editor}
				onImageDragOverChange={setShowDragIcon}
			/>
			<div className='bg-card relative'>
				<EditorContent
					editor={editor}
					className='min-h-100 md:p-4 focus:outline-none'
				/>
				{showDragIcon && (
					<div
						key='drag-overlay'
						className='absolute inset-0 bg-brand-soft/95 border-2 border-dashed border-brand rounded-lg flex items-center justify-center z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150'
					>
						<div className='text-center p-8 bg-card/80 rounded-xl shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-200'>
							<Upload className='w-16 h-16 text-brand mx-auto mb-4 animate-bounce' />
							<p className='text-brand font-semibold text-lg mb-1'>
								Отпустите изображение
							</p>
							<p className='text-muted-foreground text-sm'>
								Файл будет загружен в редактор
							</p>
						</div>
					</div>
				)}
			</div>
			<div className='border-t border-border bg-surface-subtle px-4 py-2'>
				<Counter wordCount={stats.words} charCount={stats.characters} />
			</div>
		</div>
	)
}
