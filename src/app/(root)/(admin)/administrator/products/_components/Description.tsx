import { formStyles } from '@/app/(root)/(auth)/styles'

interface DescriptionProps {
	description: string
	onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Description = ({ onChangeAction, description }: DescriptionProps) => {
	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				Описание <span className='text-danger'>*</span>
			</label>
			<input
				type='text'
				name='description'
				required
				value={description}
				onChange={onChangeAction}
				className={`${formStyles.input} bg-card [&&]:w-full`}
			/>
		</div>
	)
}

export default Description
