import { HandCoins } from 'lucide-react'
import { getWordEnding } from '../../../../../../../../../utils/getWordEnding'
const Bonuses = ({ bonus }: { bonus: number }) => {
	const roundedBonus = Math.round(bonus)
	const bonusWord = `${`бонус${getWordEnding(roundedBonus)}`}`

	return (
		<div className='w-53 flex flex-row gap-x-2 items-center justify-center mx-auto mb-2'>
			<HandCoins size={24} className='text-green-600' />
			<p className='text-xs text-green-600'>
				Вы получаете{' '}
				<span className='font-bold'>
					{roundedBonus} {bonusWord}
				</span>
			</p>
		</div>
	)
}

export default Bonuses
