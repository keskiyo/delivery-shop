'use client'

import { useAuthStore } from '@/store/authStore'
import { Edit } from 'lucide-react'
import Link from 'next/link'

const EditLink = ({ articleId }: { articleId: string }) => {
	const { user } = useAuthStore()

	if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
		return null
	}

	return (
		<div className='fixed right-4 top-4 z-50 sm:right-6 sm:top-6'>
			<Link
				href={`/administrator/cms/articles/editor?id=${articleId}`}
				className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-brand shadow-default transition hover:border-brand hover:bg-surface-hover hover:text-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/30'
				title='Редактировать'
			>
				<Edit className='h-5 w-5' />
			</Link>
		</div>
	)
}

export default EditLink
