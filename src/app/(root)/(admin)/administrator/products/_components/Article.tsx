import { formStyles } from '@/app/(root)/(auth)/styles'
import NumberInput from '@/components/ui/NumberInput'

interface ArticleProps {
	article: string
	onChangeAction: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Article = ({ onChangeAction, article }: ArticleProps) => {
	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				Артикул <span className='text-danger'>*</span>
			</label>
			<NumberInput
				name='article'
				min='0'
				max='999999'
				required
				value={article}
				onChange={onChangeAction}
				className={`${formStyles.input} bg-card [&&]:w-full`}
			/>
		</div>
	)
}

export default Article
