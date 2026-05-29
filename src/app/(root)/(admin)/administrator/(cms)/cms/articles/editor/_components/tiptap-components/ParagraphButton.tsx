import { EditorProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/types/tiptap'
import { Type } from 'lucide-react'
import { useEffect } from 'react' // Добавлен useEffect

export const ParagraphButton = ({ editor }: EditorProps) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.ctrlKey &&
				event.altKey &&
				(event.code === 'Digit0' || event.code === 'Numpad0') // 0 на основной клавиатуре или на цифровом блоке
			) {
				if (editor && editor.can().setParagraph()) {
					editor.chain().focus().setParagraph().run()
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [editor])

	if (!editor) {
		return null
	}

	const isActive = editor.isActive('paragraph')

	return (
		<button
			onClick={() => editor.chain().focus().setParagraph().run()}
			className={`p-2 rounded duration-300 cursor-pointer ${
				isActive
					? 'bg-brand text-white hover:bg-brand-hover'
					: 'text-foreground hover:bg-surface-hover'
			}`}
			title='Обычный текст (Ctrl+Alt+0)'
			disabled={!editor.can().setParagraph()}
		>
			<Type className='w-4 h-4' />
		</button>
	)
}
