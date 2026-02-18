import { Locations } from '@/types/shops'

export const locations: Locations = {
	barnaul: {
		name: 'Барнаул',
		center: [53.35087, 83.656392],
		shops: [
			{
				id: 1,
				coordinates: [53.35087, 83.656392],
				name: 'Магазин на улица 280-летия',
			},
		],
	},
	severinsk: {
		name: 'Северинск',
		center: [53.354783, 83.681276],
		shops: [
			{
				id: 2,
				coordinates: [53.354783, 83.681276],
				name: 'Магазин на Энтузиастов',
			},
		],
	},
	vtornik: {
		name: 'Вторник',
		center: [53.360216, 83.660022],
		shops: [
			{
				id: 3,
				coordinates: [53.360216, 83.660022],
				name: 'Магазин на Солнечная Поляна',
			},
		],
	},
	chetverg: {
		name: 'Четверг',
		center: [53.370785, 83.689675],
		shops: [
			{
				id: 4,
				coordinates: [53.370785, 83.689675],
				name: 'Магазин на Островского',
			},
		],
	},
}
