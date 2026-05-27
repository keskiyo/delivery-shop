'use client'

import { SidebarMenu } from '@/app/(root)/(admin)/administrator/(cms)/cms/sidebarMenu/SideBarMenu'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'

export default function CMSLayout({ children }: { children: ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const pathname = usePathname()

	const isCMSRoot = pathname === '/administrator/cms'

	return (
		<>
			{!isCMSRoot && (
				<button
					onClick={() => setIsSidebarOpen(true)}
					className='fixed top-17 right-6 z-100 p-3 bg-brand text-white rounded-full shadow-lg hover:bg-brand-hover duration-300 cursor-pointer'
					aria-label='Открыть меню'
				>
					<Menu className='w-5 h-5' />
				</button>
			)}
			<main className='min-h-screen p-6 w-full mx-auto'>{children}</main>
			<SidebarMenu
				isOpen={isSidebarOpen}
				onCloseAction={() => setIsSidebarOpen(false)}
			/>
		</>
	)
}
