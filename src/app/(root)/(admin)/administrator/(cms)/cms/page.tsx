'use client'

import DashboardCardsGrid from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/DashboardCardsGrid'
import Header from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/Header'
import StatsSection from '@/app/(root)/(admin)/administrator/(cms)/cms/_components/StatsSection'
import { useEffect, useState } from 'react'

export default function AdminDashboardPage() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<div className='min-h-screen p-4 md:p-6'>
			<div className='max-w-6xl mx-auto'>
				<Header
					title='Административная панель'
					description='Управление контентом и SEO блога'
				/>
				<DashboardCardsGrid />
				<StatsSection />
			</div>
		</div>
	)
}
