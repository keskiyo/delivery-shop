'use client'

import AdminOrdersHeader from '@/app/(root)/(admin)/administrator/admin-orders/_components/AdminOrdersHeader'
import DateSelector from '@/app/(root)/(admin)/administrator/admin-orders/_components/DateSelector'
import TimeSlotSection from '@/app/(root)/(admin)/administrator/admin-orders/_components/TimeSlotSection'
import { getDaysDates } from '@/app/(root)/(admin)/administrator/delivery-times/utils/getDaysDates'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import { useGetAdminOrdersQuery } from '@/store/redux/api/ordersApi'
import { useEffect, useMemo, useState } from 'react'

const AdminOrderPage = () => {
	const [selectedDate, setSelectedDate] = useState<string>('')
	const [customDate, setCustomDate] = useState<Date | undefined>(new Date())
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	const {
		data,
		isLoading,
		error: queryError,
	} = useGetAdminOrdersQuery(undefined, {
		pollingInterval: 10000,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	})

	const orders = useMemo(() => data?.orders || [], [data?.orders])
	const stats = useMemo(() => data?.stats || null, [data?.stats])

	useEffect(() => {
		if (orders.length > 0 && !selectedDate) {
			const threeDaysDates = getDaysDates()
			const today = threeDaysDates[0]
			setSelectedDate(today)
		}
	}, [orders, selectedDate])

	const filteredOrdersIds = useMemo(() => {
		if (orders.length === 0) return []
		const targetDate = selectedDate || getDaysDates()[0]
		return orders
			.filter(order => order.deliveryDate === targetDate)
			.map(order => order._id)
	}, [orders, selectedDate])

	const handleDateSelect = (date: Date | undefined) => {
		setCustomDate(date)
		if (date) {
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const dateString = `${year}-${month}-${day}` // YYYY-MM-DD

			setSelectedDate(dateString)
		}
		setIsCalendarOpen(false)
	}

	const toggleCalendar = () => {
		setIsCalendarOpen(!isCalendarOpen)
	}

	const filterOrdersByDate = (date: string) => {
		setSelectedDate(date)
		setCustomDate(undefined)
		setIsCalendarOpen(false)
	}

	const threeDaysDates = getDaysDates()

	if (isLoading) return <Loader />

	if (queryError) {
		return (
			<ErrorComponent
				error={
					queryError instanceof Error
						? queryError
						: new Error('Неизвестная ошибка')
				}
				userMessage='Не удалось загрузить данные о заказах пользователей'
			/>
		)
	}

	return (
		<div className='px-[max(12px,calc((100%-1208px)/2))] mx-auto mb-8 py-8'>
			<AdminOrdersHeader stats={stats} />
			<DateSelector
				orders={orders}
				dates={threeDaysDates}
				selectedDate={selectedDate}
				customDate={customDate}
				isCalendarOpen={isCalendarOpen}
				toggleCalendar={toggleCalendar}
				onCalendarDateSelect={handleDateSelect}
				onDateSelect={filterOrdersByDate}
			/>
			<TimeSlotSection orderIds={filteredOrdersIds} />
		</div>
	)
}

export default AdminOrderPage
