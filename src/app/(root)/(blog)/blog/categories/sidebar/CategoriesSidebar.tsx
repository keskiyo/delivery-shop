'use client'

import { useState } from 'react'
import '../css/sidebar-animations.css'
import { CategoriesSidebarProps } from '../types/categories.types'
import FloatingMenuButton from './FloatingMenuButton'
import SidebarContent from './SidebarContent'
import SidebarOverlay from './SidebarOverlay'

export default function CategoriesSidebar({
  categories,
}: CategoriesSidebarProps) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<FloatingMenuButton
				onClick={() => setIsOpen(true)}
				categoriesCount={categories.length}
			/>
			<SidebarOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
			<SidebarContent
				isOpen={isOpen}
				onCloseAction={() => setIsOpen(false)}
				categories={categories}
			/>
		</>
	)
}
