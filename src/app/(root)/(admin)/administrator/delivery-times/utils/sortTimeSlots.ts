import { convertTimeToMinutes } from '@/app/(root)/(admin)/administrator/delivery-times/utils/convertTimeToMinuts'

export const sortTimeSlots = (timeSlots: string[]): string[] => {
	return [...timeSlots].sort((a, b) => {
		const [startA] = a.split('-')
		const [startB] = b.split('-')
		return convertTimeToMinutes(startA) - convertTimeToMinutes(startB)
	})
}
