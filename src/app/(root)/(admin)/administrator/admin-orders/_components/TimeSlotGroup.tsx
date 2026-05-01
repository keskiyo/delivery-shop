import AdminOrderCard from '@/app/(root)/(admin)/administrator/admin-orders/_components/AdminOrderCard'
import CityFilterButtons from '@/app/(root)/(admin)/administrator/admin-orders/_components/CityFilterButtons'
import { getUniqueCities } from '@/app/(root)/(admin)/administrator/admin-orders/utils/getUniqueCities'
import { Order } from '@/types/order'
import { Check, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TimeSlotGroupProps {
	timeSlot: string
	slotOrders: Order[]
}

const TimeSlotGroup = ({ timeSlot, slotOrders }: TimeSlotGroupProps) => {
	const [selectedCity, setSelectedCity] = useState<string>('Все города')
	const [localOrders, setLocalOrders] = useState<Order[]>(slotOrders)

	useEffect(() => {
		setLocalOrders(slotOrders)
	}, [slotOrders])

	const cities = getUniqueCities(slotOrders)

	const filteredSlotOrders =
		selectedCity === 'Все города'
			? localOrders
			: localOrders.filter(
					order => order.deliveryAddress?.city === selectedCity,
				)

	const completedOrdersCount = filteredSlotOrders.filter(
		order => order.status === 'confirmed',
	).length

	const startTime = timeSlot.split('-')[0]

	const handleCitySelect = (city: string) => {
		setSelectedCity(city)
	}

	const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
		setLocalOrders(prev =>
			prev.map(order => {
				if (order._id === orderId) {
					const updatedOrder: Order = {
						...order,
						status: newStatus as Order['status'],
					}
					return updatedOrder
				}
				return order
			}),
		)
	}

	return (
		<div key={timeSlot}>
			<div className='flex justify-between text-xl md:text-2xl xl:text-4xl'>
				<div className='flex gap-x-4 mb-4'>
					<Clock className='w-6 h-6' />{' '}
					<span className='font-bold'>{startTime}</span>
				</div>
				<div className='flex gap-x-2.5 items-center'>
					<Check className='w-6 h-6' />
					<div>
						<span className='text-2xl'>{completedOrdersCount}</span>
						<span className='text-xl'>{' / '}</span>
						<span className='text-2xl'>
							{filteredSlotOrders.length}
						</span>
					</div>
				</div>
			</div>
			{cities.length > 1 && (
				<CityFilterButtons
					cities={cities}
					slotOrders={slotOrders}
					selectedCity={selectedCity}
					onCitySelect={handleCitySelect}
				/>
			)}
			<div className='flex flex-col gap-y-15'>
				{filteredSlotOrders.map(order => {
					return (
						<AdminOrderCard
							key={order._id}
							order={order}
							onStatusUpdate={handleOrderStatusUpdate}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default TimeSlotGroup
