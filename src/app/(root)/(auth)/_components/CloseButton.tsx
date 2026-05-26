'use client'

import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CloseButton = () => {
	const router = useRouter()

	const handleClose = () => {
		router.replace('/')
	}
	return (
		<button
			onClick={handleClose}
			aria-label='Закрыть'
			className='rounded duration-300 cursor-pointer mb-8 bg-surface hover:bg-surface-hover absolute top-0 right-0 m-3'
		>
			<X size={24} className='text-muted-foreground' />
		</button>
	)
}

export default CloseButton
