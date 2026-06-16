import { Order } from '@/types/order'

interface CityFilterButtonsProps {
	cities: string[]
	slotOrders: Order[]
	selectedCity: string
	onCitySelect: (city: string) => void
}

const CityFilterButtons = ({
	cities,
	slotOrders,
	selectedCity,
	onCitySelect,
}: CityFilterButtonsProps) => {
	return (
		<div className='flex flex-wrap gap-2.5 mb-15'>
			{cities.map(city => {
				const ordersCount =
					city === 'Все города'
						? slotOrders.length
						: slotOrders.filter(
								order => order.deliveryAddress?.city === city,
							).length
				return (
					<button
						key={city}
						onClick={() => onCitySelect(city)}
						className={`p-2 w-auto h-10 rounded transition-custom cursor-pointer text-xs md:text-sm xl:text-base flex justify-between items-center gap-2 ${
							selectedCity === city
								? 'items-center bg-brand text-white relative gap-2 justify-between'
								: 'active:shadow-button-active bg-surface-hover hover:shadow-button-secondary text-foreground'
						}`}
					>
						{city}
						<div className='text-white w-6 h-6 text-xs bg-promo rounded flex justify-center items-center'>
							{ordersCount}
						</div>
					</button>
				)
			})}
		</div>
	)
}

export default CityFilterButtons
