import {
	MainToolbarProps,
	ToolbarComponentId,
} from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/types/tiptap'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'
import { useToolbarOrder } from '../../../hooks/useToolbarOrders'
import { CONFIG_TOOLBAR_COMPONENTS } from '../../../utils/CONFIG_TOOLBAR'

const MainToolbar = ({ editor, onImageDragOverChange }: MainToolbarProps) => {
	const { groups, moveGroup } = useToolbarOrder()
	const [draggingGroupId, setDraggingGroupId] = useState<string | null>(null)
	const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null)

	if (!editor) {
		return null
	}

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		groupId: string,
	) => {
		const target = e.target as HTMLElement | null
		const isInteractiveTarget = target?.closest(
			'button,input,textarea,select,[role="dialog"],.table-modal-overlay,.table-modal-content',
		)

		if (isInteractiveTarget) {
			e.preventDefault()
			e.stopPropagation()
			return
		}

		e.dataTransfer.setData('text/plain', groupId)
		e.dataTransfer.effectAllowed = 'move'
		setDraggingGroupId(groupId)

		const dragImage = document.createElement('div')
		dragImage.style.width = '100px'
		dragImage.style.height = '32px'
		dragImage.style.background = 'var(--surface-subtle)'
		dragImage.style.border = '1px solid var(--border)'
		dragImage.style.borderRadius = '6px'
		dragImage.style.position = 'absolute'
		dragImage.style.top = '-1000px'
		document.body.appendChild(dragImage)
		e.dataTransfer.setDragImage(dragImage, 10, 16)

		setTimeout(() => document.body.removeChild(dragImage), 0)
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}

	const handleDragEnter = (groupId: string) => {
		if (groupId !== draggingGroupId) {
			setDragOverGroupId(groupId)
		}
	}

	const handleDragLeave = () => {
		setDragOverGroupId(null)
	}

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		dropGroupId: string,
	) => {
		e.preventDefault()

		const draggedGroupId = e.dataTransfer.getData('text/plain')
		if (!draggedGroupId || draggedGroupId === dropGroupId) {
			resetDragState()
			return
		}

		const fromIndex = groups.findIndex(g => g.id === draggedGroupId)
		const toIndex = groups.findIndex(g => g.id === dropGroupId)

		if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
			moveGroup(fromIndex, toIndex)
		}

		resetDragState()
	}

	const resetDragState = () => {
		setDraggingGroupId(null)
		setDragOverGroupId(null)
	}

	const renderToolbarComponent = (itemId: string) => {
		const componentId = itemId as ToolbarComponentId
		const config = CONFIG_TOOLBAR_COMPONENTS[componentId]

		const Component = config.component

		const props = {
			editor,
			...(onImageDragOverChange && {
				onDragOverChange: onImageDragOverChange,
			}),
		}

		return (
			<div
				key={itemId}
				className='p-0.5 rounded hover:bg-surface-hover duration-300 cursor-pointer'
			>
				<Component {...props} />
			</div>
		)
	}

	return (
		<div className='bg-surface-subtle border-b border-border py-1.5 px-2'>
			<div className='flex flex-wrap items-center gap-1.5'>
				{groups.map(group => (
					<div
						key={group.id}
						onDragOver={handleDragOver}
						onDragEnter={() => handleDragEnter(group.id)}
						onDragLeave={handleDragLeave}
						onDrop={e => handleDrop(e, group.id)}
						onDragEnd={resetDragState}
						className={`
              flex items-center gap-1 px-2 py-1.5 rounded-lg border duration-300
              min-h-14 box-content
              ${
					draggingGroupId === group.id
						? 'border-brand bg-brand-soft opacity-60 cursor-grabbing scale-95'
						: 'border-border hover:border-brand'
				}
              ${
					dragOverGroupId === group.id && draggingGroupId !== group.id
						? 'border-brand bg-brand-soft ring-1 ring-brand/30'
						: ''
				}
            `}
					>
						<div
							draggable
							onDragStart={e => handleDragStart(e, group.id)}
							className='text-muted-foreground opacity-60 hover:opacity-100 transition-opacity -ml-1 mr-0.5 cursor-grab active:cursor-grabbing'
							title='Перетащить группу'
						>
							<GripVertical className='w-3.5 h-3.5' />
						</div>
						<div className='flex items-center gap-0.5'>
							{group.items.map(itemId =>
								renderToolbarComponent(itemId),
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default MainToolbar
