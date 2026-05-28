import { EditorProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/types/tiptap'
import { FileCode } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HtmlEditorModal } from './HtmlEditorModal'

export const CodeEditorButton = ({ editor }: EditorProps) => {
	const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.shiftKey && event.code === 'KeyH') {
				event.preventDefault()
				setIsHtmlModalOpen(true)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	if (!editor) return null

	return (
		<>
			<button
				type='button'
				onClick={() => setIsHtmlModalOpen(true)}
				className='p-2 rounded duration-300 cursor-pointer text-gray-700 hover:bg-gray-100'
				title='Редактор HTML (Ctrl+Shift+H)'
			>
				<FileCode className='w-4 h-4' />
			</button>

			<HtmlEditorModal
				editor={editor}
				isOpen={isHtmlModalOpen}
				onCloseAction={() => setIsHtmlModalOpen(false)}
			/>
		</>
	)
}
