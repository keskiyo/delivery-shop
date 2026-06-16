import { EditorProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/types/tiptap'
import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const FONT_SIZES = [
	{ label: '10px', value: '10px' },
	{ label: '12px', value: '12px' },
	{ label: '14px', value: '14px' },
	{ label: '16px', value: '16px' },
	{ label: '18px', value: '18px' },
	{ label: '20px', value: '20px' },
	{ label: '24px', value: '24px' },
	{ label: '28px', value: '28px' },
	{ label: '32px', value: '32px' },
	{ label: 'Сбросить', value: 'unset' },
]

const DEFAULT_SIZE = '16px'

export const FontSizeMenu = ({ editor }: EditorProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [displaySize, setDisplaySize] = useState('16')

	const dropdownRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	const extractFontSizeFromStyle = useCallback(
		(style: string): string | null => {
			const match = style.match(/font-size:\s*([^;]+)/i)
			return match ? match[1].trim() : null
		},
		[],
	)

	const findFontSizeInSelection = useCallback(() => {
		if (!editor) return DEFAULT_SIZE

		const { state, view } = editor
		const { from } = state.selection

		let foundSize = null

		const textStyleAttrs = editor.getAttributes('textStyle')
		foundSize = textStyleAttrs?.fontSize

		if (!foundSize) {
			try {
				const pos = Math.min(from, state.doc.content.size - 1)
				const domPos = view.domAtPos(pos)
				const node = domPos.node as HTMLElement

				if (node) {
					let currentElement: HTMLElement | null =
						node.nodeType === 3 ? node.parentElement : node

					while (currentElement && !foundSize) {
						const style = currentElement.getAttribute('style')
						if (style) {
							const sizeFromStyle =
								extractFontSizeFromStyle(style)
							if (sizeFromStyle) {
								foundSize = sizeFromStyle
								break
							}
						}
						currentElement = currentElement.parentElement
					}
				}
			} catch (error) {
				console.error('Error extracting font size from DOM:', error)
			}
		}

		return foundSize || DEFAULT_SIZE
	}, [editor, extractFontSizeFromStyle])

	const updateSize = useCallback(() => {
		if (!editor) return

		const size = findFontSizeInSelection()

		const finalSize = !size || size === 'unset' ? DEFAULT_SIZE : size

		const normalizedSize = finalSize.includes('px')
			? finalSize
			: `${finalSize}px`

		if (finalSize === 'unset' || !finalSize) {
			setDisplaySize('16')
		} else {
			setDisplaySize(normalizedSize.replace('px', ''))
		}
	}, [editor, findFontSizeInSelection])

	useEffect(() => {
		if (!editor) return

		const handleUpdate = () => {
			updateSize()
		}

		editor.on('selectionUpdate', handleUpdate)

		editor.on('transaction', ({ transaction }) => {
			if (transaction.selectionSet || transaction.docChanged) {
				requestAnimationFrame(() => {
					handleUpdate()
				})
			}
		})

		updateSize()

		return () => {
			editor.off('selectionUpdate', handleUpdate)
			editor.off('transaction', handleUpdate)
		}
	}, [editor, updateSize])

	useEffect(() => {
		if (isOpen && editor) {
			updateSize()
		}
	}, [isOpen, editor, updateSize])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSizeChange = (size: string) => {
		if (!editor) return

		editor.chain().focus()

		if (size === 'unset') {
			editor.chain().unsetFontSize().run()
		} else {
			editor.chain().setFontSize(size).run()
		}

		setIsOpen(false)

		updateSize()
	}

	const handleButtonClick = () => {
		setIsOpen(!isOpen)
	}

	if (!editor) return null

	const checkIsActive = (sizeValue: string) => {
		const currentSize = findFontSizeInSelection()

		if (sizeValue === 'unset') {
			const normalizedCurrent = currentSize.includes('px')
				? currentSize
				: `${currentSize}px`
			return !currentSize || normalizedCurrent === DEFAULT_SIZE
		}

		const normalizedCurrent = currentSize.includes('px')
			? currentSize
			: `${currentSize}px`
		const normalizedTarget = sizeValue.includes('px')
			? sizeValue
			: `${sizeValue}px`

		return normalizedCurrent === normalizedTarget
	}

	return (
		<div className='relative inline-block'>
			<button
				ref={buttonRef}
				type='button'
				onClick={handleButtonClick}
				className={`
          flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md transition-custom cursor-pointer
          ${
				isOpen
					? 'bg-brand text-white border-brand'
					: 'text-foreground hover:bg-surface-hover border-border'
			}
        `}
				title='Размер шрифта'
			>
				<span className='text-xs font-mono'>{displaySize}</span>
				<ChevronDown
					className={`w-3 h-3 transition-transform transition-custom ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{/* Выпадающее меню */}
			{isOpen && (
				<div
					ref={dropdownRef}
					className='absolute z-50 mt-1 left-0 bg-card border border-border rounded-lg shadow-lg min-w-40'
					onClick={e => e.stopPropagation()}
				>
					<div className='py-1'>
						{/* Заголовок меню */}
						<div className='px-3 py-2 border-b border-border'>
							<span className='text-xs font-medium text-muted-foreground'>
								РАЗМЕР ШРИФТА
							</span>
						</div>

						{/* Варианты размеров */}
						{FONT_SIZES.map(size => {
							const isActive = checkIsActive(size.value)

							return (
								<button
									key={size.value}
									type='button'
									onClick={() => {
										handleSizeChange(size.value)
									}}
									className={`
                    w-full text-left px-3 py-2.5 text-sm hover:bg-surface-subtle flex justify-between items-center transition-custom cursor-pointer
                    ${
						isActive
							? 'bg-brand text-white border-r-2 border-brand'
							: 'text-foreground'
					}
                  `}
								>
									<div className='flex items-center gap-2'>
										{size.value !== 'unset' && (
											<div
												className='w-3 h-3 rounded-full border border-border'
												style={{
													backgroundColor: isActive
														? '#9674F9'
														: 'transparent',
													borderColor: isActive
														? '#9674F9'
														: '#d1d5db',
												}}
											/>
										)}
										<span
											className={
												size.value === 'unset'
													? 'italic'
													: ''
											}
											style={
												size.value !== 'unset'
													? { fontSize: size.value }
													: undefined
											}
										>
											{size.label}
										</span>
									</div>
									{isActive && <Check className='w-3 h-3' />}
								</button>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}
