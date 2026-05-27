import { formStyles } from '@/app/(root)/(auth)/styles'

interface TitleProps {
	title: string
	onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Title = ({ onChangeAction, title }: TitleProps) => {
	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				Название товара <span className='text-danger'>*</span>
			</label>
			<input
				type='text'
				name='title'
				required
				value={title}
				onChange={onChangeAction}
				className={`${formStyles.input} bg-card [&&]:w-full`}
			/>
		</div>
	)
}

export default Title
