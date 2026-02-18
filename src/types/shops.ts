export interface Locations {
	[key: string]: {
		name: string
		center: [number, number]
		shops: { id: number; coordinates: [number, number]; name: string }[]
	}
}
