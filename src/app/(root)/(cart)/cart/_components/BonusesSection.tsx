import InStockToggle from '@/components/shared/InStockToggle'
import { useCartStore } from '@/store/cartStore'
import { CONFIG } from '../../../../../../config/config'


const BonusesSection = () => {
	const { setUseBonuses, useBonuses, pricing, isOrdered } = useCartStore()
	const { totalPrice, maxBonusUse } = pricing

	if (maxBonusUse <= 0) return null

	return (
		<div className='flex flex-col gap-y-5 text-base pb-6 border-b-2 border-border'>
			<div className='flex flex-row items-center gap-x-2'>
				<InStockToggle
					checked={useBonuses}
					handleInStockChange={isOrdered ? () => {} : setUseBonuses}
				/>
				<p>
					Списать{' '}
					{Math.min(
						maxBonusUse,
						Math.floor(
							(totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100,
						),
					)}{' '}
					₽
				</p>
			</div>
			<div className='text-muted-foreground'>
				{`На карте накоплено ${maxBonusUse} ₽ `}
			</div>
		</div>
	)
}

export default BonusesSection
