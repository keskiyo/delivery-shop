import { formatOrderDate } from '@/app/(root)/(user-orders)/user-orders/utils/formatOrderDate'
import { getStatusColor } from '@/app/(root)/(user-orders)/user-orders/utils/getStatusColor'
import { getStatusText } from '@/app/(root)/(user-orders)/user-orders/utils/getStatusText'
import { OrderHeaderProps } from '@/types/order'
import { CalendarDays } from 'lucide-react'
import { formatPrice } from '../../../../../../utils/formatPrice'

const OrderHeader = ({
	order,
	showDeliveryButton,
	onOrderClick,
	onDeliveryClick,
	disabled = false,
}: OrderHeaderProps) => {
	return (
		<div className='flex flex-row justify-between items-center mb-10.5 gap-6'>
			<div className='flex flex-col md:flex-row text-sm xl:text-2xl gap-2 xl:gap-6 items-center'>
				<p className='font-bold'>
					{formatOrderDate(order.deliveryDate)}
				</p>
				<p className='font-bold hidden xl:block'>
					{order.deliveryTimeSlot}
				</p>
				<span
					className={`px-2 py-1 rounded text-xs md:text-base shrink-0 ${getStatusColor(order)}`}
				>
					{getStatusText(order)}
				</span>
			</div>
			<div className='flex flex-col md:flex-row gap-2 xl:gap-6 items-center'>
				<p className='text-xl md:text-2xl'>
					{formatPrice(order.totalAmount)} ₽
				</p>
				{!showDeliveryButton ? (
					<button
						className={`
                w-50 h-10 rounded duration-300
                ${
					disabled
						? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
						: 'bg-[#ff6633] text-white hover:shadow-button-default cursor-pointer'
				}
            `}
						onClick={onOrderClick}
						disabled={disabled}
					>
						{disabled ? 'Недоступно' : 'Заказать'}
					</button>
				) : (
					<button
						onClick={onDeliveryClick}
						className='flex justify-center items-center p-2 gap-2 rounded bg-green-600 text-white hover:shadow-button-default cursor-pointer duration-300'
					>
						<CalendarDays className='w-6 h-6' />
						<p className='flex-1'>
							Когда{' '}
							<span className='hidden md:inline'>доставить</span>
						</p>
					</button>
				)}
			</div>
		</div>
	)
}

export default OrderHeader
