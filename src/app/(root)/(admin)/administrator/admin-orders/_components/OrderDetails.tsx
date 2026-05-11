import { Order } from '@/types/order'
import { Cake } from 'lucide-react'
import { isBirthdaySoon } from '../../../../../../../utils/admin/birthdaySoon'
import { getMappedStatus } from '../utils/getMappedStatus'

interface OrderDetailsProps {
	order: Order
	totalWeight?: number
}

const OrderDetails = ({ order, totalWeight = 0 }: OrderDetailsProps) => {
	const formatDate = (isoString: string): string => {
		if (!isoString) return ''

		const date = new Date(isoString)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		return `${day}.${month}.${year}`
	}

	const formatDateTime = (isoString: string): string => {
		if (!isoString) return ''

		const date = new Date(isoString)
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		const hours = date.getHours().toString().padStart(2, '0')
		const minutes = date.getMinutes().toString().padStart(2, '0')
		return `${day}.${month}.${year}, ${hours}:${minutes}`
	}

	const formattedCreatedAt = formatDateTime(order.createdAt)
	const formattedDeliveryDate = formatDate(order.deliveryDate)
	const formattedBirthday = formatDate(order.birthday)
	const birthdaySoon = isBirthdaySoon(order.birthday)

	return (
		<div className='p-5 mt-10 space-y-6'>
			<h3 className='text-lg font-bold mb-4'>
				Детали заказа №{order.orderNumber}
			</h3>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<div className='space-y-3'>
					<h4 className='font-medium'>Информация о заказе</h4>
					<div className='space-y-2'>
						<div className='flex justify-between'>
							<span className='font-medium'>Статус:</span>
							<span className='font-medium'>
								{getMappedStatus(order)}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium'>Способ оплаты:</span>
							<span className='font-medium'>
								{order.paymentMethod === 'cash_on_delivery'
									? 'Наложенный платёж'
									: order.paymentMethod}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium'>Статус оплаты:</span>
							<span className='font-medium'>
								{getMappedStatus(order)}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium'>Создан:</span>
							<span className='font-medium'>
								{formattedCreatedAt}
							</span>
						</div>
					</div>
				</div>

				{/* Финансовая информация */}
				<div className='space-y-3'>
					<h4 className='font-medium'>Финансовая информация</h4>
					<div className='space-y-2'>
						<div className='flex justify-between'>
							<span className='font-medium'>Общая сумма:</span>
							<span className='font-medium'>
								{order.totalAmount} ₽
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium'>Скидка:</span>
							<span className='font-medium text-green-600'>
								-{order.discountAmount} ₽
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium'>
								Использовано бонусов:
							</span>
							<span className='font-medium'>
								{order.usedBonuses}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium'>
								Начислено бонусов:
							</span>
							<span className='font-medium text-green-600'>
								+{order.earnedBonuses}
							</span>
						</div>
					</div>
				</div>

				{/* Информация о доставке */}
				<div className='space-y-3'>
					<h4 className='font-medium'>Информация о доставке</h4>
					<div className='space-y-2'>
						<div className='flex justify-between'>
							<span className='font-medium'>Город:</span>
							<span className='font-medium'>
								{order.deliveryAddress?.city}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium'>Адрес:</span>
							<span className='font-medium'>
								ул. {order.deliveryAddress?.street}, д.{' '}
								{order.deliveryAddress?.house}
								{order.deliveryAddress?.apartment &&
									`, кв. ${order.deliveryAddress.apartment}`}
							</span>
						</div>
						{order.deliveryAddress?.additional && (
							<div className='flex justify-between'>
								<span className='font-medium'>
									Дополнительно:
								</span>
								<span className='font-medium'>
									{order.deliveryAddress?.additional}
								</span>
							</div>
						)}
						<div className='flex justify-between'>
							<span className='font-medium'>Дата доставки:</span>
							<span className='font-medium'>
								{formattedDeliveryDate}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium'>Время доставки:</span>
							<span className='font-medium'>
								{order.deliveryTimeSlot}
							</span>
						</div>
					</div>
				</div>

				{/* Информация о клиенте */}
				<div className='space-y-3 md:col-span-2 lg:col-span-3'>
					<h4 className='font-medium'>Информация о клиенте</h4>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<div>
							<span className='text-sm'>Имя:</span>
							<p className='font-medium'>
								{order.name} {order.surname}
							</p>
						</div>
						<div>
							<span className='text-sm'>Телефон:</span>
							<p className='font-medium'>+{order.phone}</p>
						</div>
						<div>
							<span className='text-sm'>Пол:</span>
							<p className='font-medium'>
								{order.gender === 'male'
									? 'Мужской'
									: order.gender === 'female'
										? 'Женский'
										: order.gender}
							</p>
						</div>
						<div>
							<span className='text-sm'>Дата рождения:</span>
							<div className='flex items-center'>
								<p
									className={`${birthdaySoon ? 'text-red-500' : ''} font-medium`}
								>
									{formattedBirthday}
								</p>
								{birthdaySoon && (
									<Cake
										className='ml-2 text-yellow-500'
										size={20}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='mt-6 pt-6 border-t border-gray-200'>
				<h4 className='font-medium mb-4'>
					<span className='ml-4'>
						Общая масса: {totalWeight.toFixed(2)} кг
					</span>
				</h4>
			</div>
		</div>
	)
}

export default OrderDetails
