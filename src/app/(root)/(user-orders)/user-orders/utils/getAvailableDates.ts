import { getDaysDates } from '@/app/(root)/(admin)/administrator/delivery-times/utils/getDaysDates'
import { AvailableDate } from '@/types/availableDate'
import { Schedule } from '@/types/deliverySchedule'

export const getAvailableDates = (schedule: Schedule): AvailableDate[] => {
	const DaysDates = getDaysDates()

	return DaysDates.map(dateString => {
		const daySchedule = schedule[dateString as keyof typeof schedule]

		if (!daySchedule) {
			return null
		}

		const totalSlots = Object.values(daySchedule).filter(
			available => available,
		).length

		return {
			date: new Date(dateString),
			dateString,
			availableSlots: totalSlots,
		}
	}).filter((item): item is AvailableDate => item !== null)
}
