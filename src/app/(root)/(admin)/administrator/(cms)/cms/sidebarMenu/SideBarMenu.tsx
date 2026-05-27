'use client'

import { GlobalStyles } from '@/app/(root)/(admin)/administrator/(cms)/cms/sidebarMenu/GlobalStyles'
import { MenuFooter } from '@/app/(root)/(admin)/administrator/(cms)/cms/sidebarMenu/MenuFooter'
import { MenuHeader } from '@/app/(root)/(admin)/administrator/(cms)/cms/sidebarMenu/MenuHeader'
import { MenuItemsList } from '@/app/(root)/(admin)/administrator/(cms)/cms/sidebarMenu/MenuItemsList'
import { MenuOverlay } from '@/app/(root)/(admin)/administrator/(cms)/cms/sidebarMenu/MenuOverlay'
import { SidebarMenuProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types/sidebar'
import { Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { menuItems } from '../utils/menuItems'

export const SidebarMenu = ({ isOpen, onCloseAction }: SidebarMenuProps) => {
	const router = useRouter()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onCloseAction()
			}
		}

		document.addEventListener('keydown', handleEsc)

		return () => document.removeEventListener('keydown', handleEsc)
	}, [isOpen, onCloseAction])

	useEffect(() => {
		if (!mounted) return

		if (isOpen) {
			document.body.classList.add('overflow-hidden')
		} else {
			document.body.classList.remove('overflow-hidden')
		}

		return () => {
			document.body.classList.remove('overflow-hidden')
		}
	}, [isOpen, mounted])

	const handleItemClick = (path: string) => {
		router.push(path)
		onCloseAction()
	}

	if (!mounted) return null

	return (
		<>
			<GlobalStyles />
			<MenuOverlay isOpen={isOpen} onClose={onCloseAction} />

			<div
				className={`fixed right-0 top-0 h-full w-96 max-w-[calc(100vw-1rem)] z-200 shadow-2xl shadow-black/20 ${
					isOpen
						? 'translate-x-0 opacity-100'
						: 'translate-x-full opacity-0'
				}`}
				style={{
					transition:
						'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out',
				}}
			>
				<div className='relative h-full w-full'>
					<div className='absolute inset-0 border-l border-border bg-card' />
					<div className='absolute inset-0 shadow-[inset_0_0_60px_-20px_rgba(59,130,246,0.1)]' />
					<div className='relative h-full flex flex-col'>
						<div className='shrink-0 pt-5 px-5'>
							<MenuHeader
								isOpen={isOpen}
								onCloseAction={onCloseAction}
								icon={
									<Truck className='relative w-7 h-7 text-brand' />
								}
							/>
						</div>
						<div className='flex-1 overflow-y-auto overflow-x-hidden p-5'>
							<MenuItemsList
								items={menuItems}
								onItemClick={handleItemClick}
							/>
						</div>
						<MenuFooter />
					</div>
				</div>
			</div>
		</>
	)
}
