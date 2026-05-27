import { formStyles } from '@/app/(root)/(auth)/styles'

interface BrandProps {
	brand: string
	onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Brand = ({ onChangeAction, brand }: BrandProps) => {
	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				Бренд <span className='text-danger'>*</span>
			</label>
			<input
				type='text'
				name='brand'
				required
				value={brand}
				onChange={onChangeAction}
				className={`${formStyles.input} bg-card [&&]:w-full`}
			/>
		</div>
	)
}

export default Brand
