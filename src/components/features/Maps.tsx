'use client'

import { locations } from '@/data/locations'
import { Map, Placemark, YMaps } from '@iminside/react-yandex-maps'
import { useState } from 'react'

const Maps = () => {
	const [currentLocation, setCurrentLocation] = useState('barnaul')
	const currentLocationData = locations[currentLocation]
	const mapPinIcon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1hcC1waW4taWNvbiBsdWNpZGUtbWFwLXBpbiI+PHBhdGggZD0iTTIwIDEwYzAgNC45OTMtNS41MzkgMTAuMTkzLTcuMzk5IDExLjc5OWExIDEgMCAwIDEtMS4yMDIgMEM5LjUzOSAyMC4xOTMgNCAxNC45OTMgNCAxMGE4IDggMCAwIDEgMTYgMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiLz48L3N2Zz4=`

	return (
		<YMaps
			query={{
				lang: 'ru_RU',
				apikey: '851b4ba9-1554-4325-8250-70775f167344',
				load: 'package.full',
			}}
		>
			<section>
				<h2 className='mb-4 mb:mb-8 xl:mb-10 text-2xl xl:text-4xl text-left font-bold'>
					Наши магазины
				</h2>

				<div className='flex flex-wrap gap-x-2 gap-y-3 mb-5'>
					{Object.keys(locations).map(key => {
						const isActive = currentLocation === key
						return (
							<button
								key={key}
								onClick={() => setCurrentLocation(key)}
								className={`p-2 text-xs justify-center items-center active:shadow-(--shadow-button-active) border-none rounded cursor-pointer transition-colors duration-300 ${
									isActive
										? 'bg-green-500 text-white hover: shadow-(--shadow-button-default)'
										: 'bg-[#f3f2f1] text-gray-500 hover:shadow-(--shadow-button-secondary)'
								}`}
							>
								{locations[key].name}
							</button>
						)
					})}
				</div>

				<Map
					defaultState={{
						center: currentLocationData.center,
						zoom: 15,
					}}
					state={{
						center: currentLocationData.center,
						zoom: 15,
					}}
					width='100%'
					height='350px'
				>
					{locations[currentLocation].shops.map(shop => (
						<Placemark
							key={shop.id}
							geometry={shop.coordinates}
							properties={{
								hintContent: shop.name,
							}}
							options={{
								iconLayout: 'default#image',
								iconImageHref: mapPinIcon,
								iconImageSize: [32, 32],
								iconImageOffset: [-12, -24],
							}}
						/>
					))}
				</Map>
			</section>
		</YMaps>
	)
}

export default Maps
