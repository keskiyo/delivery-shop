import { MenuOverlayProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types/sidebar'

export const MenuOverlay = ({ isOpen, onClose }: MenuOverlayProps) => {
	return (
		<div
			className={`fixed inset-0 bg-muted/80 backdrop-blur-sm z-40  transition-custom ease-out ${
				isOpen
					? 'opacity-100 pointer-events-auto'
					: 'opacity-0 pointer-events-none'
			}`}
			onClick={onClose}
		/>
	)
}
