import { formStyles } from '@/app/(root)/(auth)/styles'
import NumberInput from '@/components/ui/NumberInput'

interface DiscountProps {
	discount: string
	onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void
	required?: boolean
}

const Discount = ({
	onChangeAction,
	discount,
	required = false,
}: DiscountProps) => {
	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				Скидка (%){' '}
				{required && <span className='text-danger'>*</span>}
			</label>
			<NumberInput
				name='discountPercent'
				required={required}
				value={discount}
				onChange={onChangeAction}
				wrapperClassName='w-72 max-w-full'
				className={`${formStyles.input} bg-card [&&]:w-full`}
				min='0'
				max='100'
			/>
		</div>
	)
}

export default Discount
