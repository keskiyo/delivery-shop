import { formStyles } from '@/app/(root)/(auth)/styles'

interface QuantityProps {
	quantity: string
	onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Quantity = ({ onChangeAction, quantity }: QuantityProps) => {
	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				Количество <span className='text-danger'>*</span>
			</label>
			<input
				type='number'
				name='quantity'
				required
				value={quantity}
				onChange={onChangeAction}
				className={`${formStyles.input} bg-card [&&]:w-full`}
			/>
		</div>
	)
}

export default Quantity
