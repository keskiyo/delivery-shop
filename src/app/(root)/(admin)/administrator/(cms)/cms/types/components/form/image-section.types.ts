import { FormField } from '.'
import { CharCount } from './category-form.types'

export interface ImageSectionProps {
	charCount: CharCount
	onRemoveImage: () => void
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onInputChange: (field: FormField, value: string, maxLength: number) => void
}
