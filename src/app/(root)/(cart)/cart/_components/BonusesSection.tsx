import InStockToggle from '@/components/shared/InStockToggle'
import { CONFIG } from '../../../../../../config/config'
import { getWordEnding } from '../../../../../../utils/getWordEnding'

interface BonusesSectionProps {
	bonusesCount: number
	useBonuses: boolean
	onUseBonusesChange: (value: boolean) => void
	totalPrice: number
}

const BonusesSection = ({
	bonusesCount,
	useBonuses,
	onUseBonusesChange,
	totalPrice,
}: BonusesSectionProps) => {
	if (bonusesCount <= 0) return null

	return (
		<div className='flex flex-col gap-y-5 text-base pb-6 border-b-2 border-[#f3f2f1]'>
			<div className='flex flex-row items-center gap-x-2'>
				<InStockToggle
					checked={useBonuses}
					handleInStockChange={onUseBonusesChange}
				/>
				<p>
					Списать{' '}
					{Math.min(
						bonusesCount,
						Math.floor(
							(totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100,
						),
					)}{' '}
					₽
				</p>
			</div>
			<div className='text-[#bfbfbf]'>
				{`На карте накоплено ${bonusesCount} бонус${getWordEnding(bonusesCount)}`}
			</div>
		</div>
	)
}

export default BonusesSection
