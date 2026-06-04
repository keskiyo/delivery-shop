import { SidebarOverlayProps } from '../types/sidebar.types'

export default function SidebarOverlay({
	isOpen,
	onClose,
}: SidebarOverlayProps) {
	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 animate-fade-in bg-foreground/40 backdrop-blur-sm'
			onClick={onClose}
		/>
	)
}
