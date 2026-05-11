import Calendar from '@/app/(root)/(admin)/administrator/admin-orders/_components/Calendar'
import { Order } from '@/types/order'
import { CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import DateFilterButtons from './DateFilterButtons'

interface DateSelectorProps {
	customDate: Date | undefined
	selectedDate: string
	dates: string[]
	orders: Order[]
	onDateSelect: (date: string) => void
	isCalendarOpen: boolean
	toggleCalendar: () => void
	onCalendarDateSelect: (date: Date | undefined) => void
}

const DateSelector = ({
	customDate,
	selectedDate,
	dates,
	orders,
	onDateSelect,
	isCalendarOpen,
	toggleCalendar,
	onCalendarDateSelect,
}: DateSelectorProps) => {
	const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
		customDate || new Date(),
	)

	const handleDateSelect = (date: Date | undefined) => {
		onCalendarDateSelect(date)
		if (date) {
			setCalendarMonth(date)
		}
	}

	useEffect(() => {
		if (customDate) setCalendarMonth(customDate)
	}, [customDate])
	return (
		<div className='flex justify-start items-center gap-3 relative mb-15 text-gray-800'>
			<button
				type='button'
				onClick={toggleCalendar}
				className='relative hover:opacity-70 transition-opacity rounded w-15 h-15 bg-[#f3f2f1] flex justify-center items-center cursor-pointer text-gray-800'
			>
				<CalendarDays className='w-6 h-6' />
			</button>
			{customDate && (
				<span className='absolute top-0 text-xs'>
					{customDate.toLocaleDateString('ru-RU')}
				</span>
			)}
			{isCalendarOpen && (
				<Calendar
					customDate={customDate}
					onDateSelect={handleDateSelect}
					month={calendarMonth}
				/>
			)}
			<DateFilterButtons
				dates={dates}
				orders={orders}
				selectedDate={selectedDate}
				onDateSelect={onDateSelect}
			/>
		</div>
	)
}

export default DateSelector
