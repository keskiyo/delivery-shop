import { NotificationProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types'
import { X } from 'lucide-react'

export const Notification = ({ type, message, onClose }: NotificationProps) => {
	const baseClasses =
		'mb-4 p-4 rounded absolute top-10 flex justify-between items-center'
	const typeClasses =
		type === 'success'
			? 'bg-green-50 text-green-600 border border-green-200'
			: 'bg-red-50 text-red-600 border border-red-200'

	return (
		<div className={`${baseClasses} ${typeClasses}`}>
			<div className='flex items-center gap-2'>
				<span>{message}</span>
			</div>
			<button
				onClick={onClose}
				className='ml-4 cursor-pointer'
				aria-label='Закрыть уведомление'
			>
				<X className='w-5 h-5' />
			</button>
		</div>
	)
}
