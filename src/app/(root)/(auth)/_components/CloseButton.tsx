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
			className='rounded duration-300 cursor-pointer mb-8 bg-gray-100 absolute top-0 right-0 m-3'
		>
			<X size={24} className='text-gray-600' />
		</button>
	)
}

export default CloseButton
