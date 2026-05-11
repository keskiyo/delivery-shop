import AdminOrderCard from '@/app/(root)/(admin)/administrator/admin-orders/_components/AdminOrderCard'
import CityFilterButtons from '@/app/(root)/(admin)/administrator/admin-orders/_components/CityFilterButtons'
import { getUniqueCities } from '@/app/(root)/(admin)/administrator/admin-orders/utils/getUniqueCities'
import { useGetAdminOrdersQuery } from '@/store/redux/api/ordersApi'
import { Order } from '@/types/order'
import { Check, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TimeSlotGroupProps {
	timeSlot: string
	orderIds: string[]
}

const TimeSlotGroup = ({ timeSlot, orderIds }: TimeSlotGroupProps) => {
	const { data } = useGetAdminOrdersQuery()
	const [selectedCity, setSelectedCity] = useState<string>('Все города')
	const [localOrders, setLocalOrders] = useState<Order[]>([])

	useEffect(() => {
		if (data?.orders) {
			const filteredOrders = data.orders.filter(order =>
				orderIds.includes(order._id),
			)
			setLocalOrders(filteredOrders)
		}
	}, [data?.orders, orderIds])

	const cities = getUniqueCities(localOrders)

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

	return (
		<div key={timeSlot}>
			<div className='flex justify-between text-xl md:text-2xl xl:text-4xl mb-4'>
				<div className='flex gap-x-4 items-center'>
					<Clock className='w-8 h-8' />
					<span className='font-bold'>{startTime}</span>
				</div>
				<div className='flex gap-x-2.5 items-center'>
					<Check className='w-8 h-8' />
					<div className='flex gap-x-1.5 items-center'>
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
					slotOrders={localOrders}
					selectedCity={selectedCity}
					onCitySelect={handleCitySelect}
				/>
			)}
			<div className='flex flex-col gap-y-15'>
				{filteredSlotOrders.map(order => {
					return (
						<AdminOrderCard key={order._id} orderId={order._id} />
					)
				})}
			</div>
		</div>
	)
}

export default TimeSlotGroup
