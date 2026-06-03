import { formStyles } from '@/app/(root)/(auth)/styles'
import NumberInput from '@/components/ui/NumberInput'

interface BasePriceProps {
	basePrice: string
	onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const BasePrice = ({ onChangeAction, basePrice }: BasePriceProps) => {
	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				Базовая цена (руб.) <span className='text-danger'>*</span>
			</label>
			<NumberInput
				name='basePrice'
				step='0.01'
				required
				value={basePrice}
				onChange={onChangeAction}
				wrapperClassName='w-72 max-w-full'
				className={`${formStyles.input} bg-card [&&]:w-full`}
			/>
		</div>
	)
}

export default BasePrice
