'use client'

import { locations } from '@/data/locations'

interface LocationsProps {
	currentLocation: string
	onLocationChange: (key: string) => void
}

const Locations = ({ currentLocation, onLocationChange }: LocationsProps) => {
	return (
		<div className='flex flex-wrap gap-x-2 gap-y-3 mb-5'>
			{Object.keys(locations).map(key => {
				const isActive = currentLocation === key
				return (
					<button
						key={key}
						onClick={() => onLocationChange(key)}
						className={`p-2 text-xs justify-center items-center active:shadow-button-active border-none rounded cursor-pointer  transition-custom ${
							isActive
								? 'bg-primary text-white shadow-button-default'
								: 'bg-card text-foreground border border-border hover:bg-surface-hover hover:shadow-button-secondary'
						}`}
					>
						{locations[key].name}
					</button>
				)
			})}
		</div>
	)
}

export default Locations
