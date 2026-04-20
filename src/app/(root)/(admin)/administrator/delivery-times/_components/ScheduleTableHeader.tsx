import { formatDateFull, formatDateNumeric } from '../utils/dateFormatters'

interface ScheduleTableHeaderProps {
	dates: string[]
}

export default function ScheduleTableHeader({
	dates,
}: ScheduleTableHeaderProps) {
	return (
		<div className='grid grid-cols-4 border-b border-#202020'>
			<div className='p-2 md:p-3 font-semibold border-r border-#202020 text-xs md:text-sm'>
				Время
			</div>
			{dates.map(date => (
				<div
					key={date}
					className='p-2 md:p-3 font-semibold text-center border-r border-#202020 last:border-r-0'
				>
					<div className='font-medium text-xs md:text-sm'></div>
					<div className='text-xs mt-1'>
						{formatDateNumeric(date)}
					</div>
					<div className='text-xs hidden xs:block'>
						{formatDateFull(date)}
					</div>
				</div>
			))}
		</div>
	)
}
