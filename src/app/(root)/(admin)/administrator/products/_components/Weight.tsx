import { formStyles } from '@/app/(root)/(auth)/styles'
import NumberInput from '@/components/ui/NumberInput'

interface WeightProps {
	weight: string
	onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Weight = ({ onChangeAction, weight }: WeightProps) => {
	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				Вес (кг) <span className='text-danger'>*</span>
			</label>
			<NumberInput
				name='weight'
				step='0.01'
				value={weight}
				onChange={onChangeAction}
				wrapperClassName='w-72 max-w-full'
				className={`${formStyles.input} bg-card [&&]:w-full`}
			/>
		</div>
	)
}

export default Weight
