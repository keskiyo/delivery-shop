import {
	formatDateFull,
	formatDateNumeric,
} from '@/app/(root)/(admin)/administrator/delivery-times/utils/dateFormatters'
import { formatTimeSlot } from '@/app/(root)/(cart)/cart/utils/formatTimeSlot'
import { formatDisplayDate } from '@/app/(root)/(user-orders)/user-orders/utils/formatDisplayDate'
import { getAvailableDates } from '@/app/(root)/(user-orders)/user-orders/utils/getAvailableDates'
import { getAvailableTimeSlots } from '@/app/(root)/(user-orders)/user-orders/utils/getAvailableTimeSlots'
import { Loader } from '@/components/features/common/loader'
import { AvailableDate } from '@/types/availableDate'
import { Schedule } from '@/types/deliverySchedule'
import { useEffect, useState } from 'react'

interface DeliveryDatePickerProps {
	schedule: Schedule
	isCreatingOrder: boolean
	onDateSelect: (date: Date, timeSlot: string) => void
	onCancel: () => void
}

const DeliveryDatePicker: React.FC<DeliveryDatePickerProps> = ({
	schedule,
	isCreatingOrder,
	onDateSelect,
	onCancel,
}) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [availableDates, setAvailableDates] = useState<AvailableDate[]>([])

	useEffect(() => {
		const dates = getAvailableDates(schedule)
		setAvailableDates(dates)

		if (dates.length > 0 && !selectedDate) {
			setSelectedDate(dates[0].date)
		}
	}, [schedule, selectedDate])

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date)
	}

	const handleTimeSlotSelect = (timeSlot: string) => {
		if (selectedDate) {
			onDateSelect(selectedDate, timeSlot)
		}
	}

	const formatDateToString = (date: Date): string => {
		return date.toISOString().split('T')[0]
	}

	const availableTimeSlots = selectedDate
		? getAvailableTimeSlots(selectedDate, schedule)
		: []

	return (
		<div className='fixed inset-0 bg-muted/80 backdrop-blur-sm flex items-center justify-center z-50'>
			<div className='bg-card p-6 rounded max-w-md w-full mx-4'>
				<h3 className='text-lg font-bold mb-4'>
					Выберите дату и время доставки
				</h3>

				<div className='mb-4'>
					<label className='block text-sm font-medium mb-2'>
						Дата доставки:
					</label>
					<div className='grid grid-cols-3 gap-2'>
						{availableDates.map(item => {
							const isSelected =
								selectedDate?.toDateString() ===
								item.date.toDateString()
							return (
								<button
									key={item.dateString}
									onClick={() => handleDateSelect(item.date)}
									className={`py-2 px-3 rounded text-sm transition-custom cursor-pointer ${
										isSelected
											? 'bg-brand text-white'
											: 'bg-site-chrome text-white hover:bg-promo'
									}`}
								>
									<div className='text-xs mt-1 text-white'>
										{formatDateNumeric(
											formatDateToString(item.date),
										)}
									</div>
									<div className='text-xs hidden xs:block text-white'>
										{formatDateFull(
											formatDateToString(item.date),
										)}
									</div>
								</button>
							)
						})}
					</div>
				</div>

				{selectedDate && (
					<div className='mb-4'>
						<label className='block text-sm font-medium mb-2'>
							Доступное время доставки для{' '}
							{formatDisplayDate(selectedDate)}:
						</label>
						<div className='grid grid-cols-2 gap-2'>
							{availableTimeSlots.map(slot => {
								const formatted = formatTimeSlot(slot)
								return (
									<button
										key={slot}
										onClick={() =>
											handleTimeSlotSelect(slot)
										}
										disabled={isCreatingOrder}
										className='bg-site-chrome hover:bg-brand py-2 px-3 text-white rounded text-sm transition-custom cursor-pointer disabled:opacity-50'
									>
										<span className='xl:hidden'>
											{formatted.mobileLabel}
										</span>
										<span className='hidden xl:block'>
											{formatted.desktopLabel}
										</span>
									</button>
								)
							})}
							{availableTimeSlots.length === 0 && (
								<p className='col-span-2 text-center text-muted-foreground py-2'>
									Нет доступных временных интервалов
								</p>
							)}
						</div>
					</div>
				)}

				<div className='flex gap-2 mt-4'>
					<button
						onClick={onCancel}
						className='flex-1 bg-site-chrome text-white py-2 rounded hover:bg-promo transition-custom cursor-pointer'
						disabled={isCreatingOrder}
					>
						Отмена
					</button>
				</div>

				{isCreatingOrder && (
					<div className='mt-4 text-center'>
						<Loader />
						<p className='text-sm text-muted-foreground'>
							Создаем заказ...
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default DeliveryDatePicker
