import { formatDateFull, formatDateNumeric } from '../utils/dateFormatters'

interface ScheduleTableHeaderProps {
	dates: string[]
}

export default function ScheduleTableHeader({
	dates,
}: ScheduleTableHeaderProps) {
	return (
		<div className='grid grid-cols-4 border-b border-[#151515]'>
			<div className='p-2 md:p-3 font-semibold border-r border-[#f3f2f1] text-xs md:text-sm'>
				Время
			</div>
			{dates.map(date => (
				<div
					key={date}
					className='p-2 md:p-3 font-semibold text-gray-900 text-center border-r border-gray-200 last:border-r-0'
				>
					<div className='font-medium text-xs md:text-sm'></div>
					<div className='text-xs text-[#929292] mt-1'>
						{formatDateNumeric(date)}
					</div>
					<div className='text-xs text-[#929292] hidden xs:block'>
						{formatDateFull(date)}
					</div>
				</div>
			))}
		</div>
	)
}
