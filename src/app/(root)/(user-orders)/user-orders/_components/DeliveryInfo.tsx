import { DeliveryData } from '@/types/cart'

interface DeliveryInfoProps {
	delivery: DeliveryData
	onEdit: () => void
}

export const DeliveryInfo: React.FC<DeliveryInfoProps> = ({
	delivery,
	onEdit,
}) => {
	return (
		<div className='mb-4 text-gray-800'>
			<p className='text-sm'>
				<strong>Время доставки:</strong>{' '}
				{new Date(delivery.time.date).toLocaleDateString()}{' '}
				{delivery.time.timeSlot}
			</p>
			<button
				className='mt-2 underline text-sm cursor-pointer text-orange-700'
				onClick={onEdit}
			>
				Изменить время доставки
			</button>
		</div>
	)
}
