import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import '../daypicker.css'

interface CalendarProps {
	customDate: Date | undefined
	onDateSelect: (date: Date | undefined) => void
	month?: Date
	isOrderDateChange?: boolean
}

const Calendar = ({
	customDate,
	onDateSelect,
	month,
	isOrderDateChange = false,
}: CalendarProps) => {
	const [currentMoth, setCurrentMonth] = useState<Date>(
		month || customDate || new Date(),
	)

	const getMonthName = (date: Date) => {
		const monthName = date.toLocaleDateString('ru-RU', {
			month: 'long',
		})
		const capitalizedMonth =
			monthName.charAt(0).toUpperCase() + monthName.slice(1)
		const year = date.getFullYear()
		return `${capitalizedMonth} ${year}`
	}

	const handlePreviousMonth = () => {
		const newDate = new Date(currentMoth)
		newDate.setMonth(newDate.getMonth() - 1)
		setCurrentMonth(newDate)
	}

	const handleNextMonth = () => {
		const newDate = new Date(currentMoth)
		newDate.setMonth(newDate.getMonth() + 1)
		setCurrentMonth(newDate)
	}

	useEffect(() => {
		if (month) {
			setCurrentMonth(month)
		}
	}, [month])

	return (
		<div
			className={`${isOrderDateChange ? '' : 'absolute top-17 left-0 z-50 bg-card border border-border rounded-lg shadow-lg p-4 w-92 text-foreground'}`}
		>
			{/* Кастомная навигация */}
			<div className='flex justify-between items-center mb-4'>
				<span className='text-lg font-bold text-foreground'>
					{getMonthName(currentMoth)}
				</span>
				<div className='flex gap-x-4 justify-center'>
					<button
						onClick={handlePreviousMonth}
						className='p-2 bg-surface-hover hover:bg-brand hover:text-white rounded transition-custom cursor-pointer'
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					<button
						onClick={handleNextMonth}
						className='p-2 bg-surface-hover hover:bg-brand hover:text-white rounded transition-custom cursor-pointer'
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
			<div className='full-width-calendar'>
				<DayPicker
					mode='single'
					selected={customDate}
					onSelect={onDateSelect}
					locale={ru}
					month={currentMoth}
					onMonthChange={setCurrentMonth}
					showOutsideDays={true}
					className='p-0'
					classNames={{
						root: 'w-full',
						month: 'w-full',
						caption: 'hidden',
						nav: 'hidden',
						table: 'w-full border-collapse',
						head_row: 'border-b',
						head_cell: 'font-normal py-2 text-sm',
						row: 'border-b',
						cell: 'h-10 text-center',
						day: 'size-10 rounded-full text-text-soft hover:text-white hover:bg-promo transition-custom cursor-pointer mx-auto',
						day_selected: 'bg-promo !text-white',
						day_today: 'bg-promo-soft !text-promo',
						day_outside: 'text-muted-foreground opacity-50',
					}}
					modifiersStyles={{
						selected: {
							color: '#fff',
							backgroundColor: 'var(--promo)',
							border: 'none',
						},
						today: {
							color: 'var(--promo)',
							backgroundColor: 'var(--promo-soft)',
							border: 'none',
						},
					}}
				/>
			</div>
		</div>
	)
}

export default Calendar
