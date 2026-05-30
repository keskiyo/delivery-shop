import { FormFieldProps } from '@/app/(root)/(admin)/administrator/(cms)/cms/types/site-settings'

export const FormField = ({
	label,
	value,
	onChange,
	type,
	placeholder,
	hint,
	rows = 3,
	showCommaHint = false,
	disabled = false,
}: FormFieldProps) => {
	const inputClasses = `w-full px-3 py-2 border border-border bg-card rounded focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand shadow-sm ${
		disabled
			? 'bg-surface-hover cursor-not-allowed opacity-60 text-text-soft'
			: ''
	}`

	return (
		<div>
			<label className='block text-sm font-medium mb-2'>
				{label}
				{showCommaHint && (
					<span className='text-muted-foreground text-sm font-normal ml-2'>
						(через запятую)
					</span>
				)}
			</label>
			{type === 'textarea' ? (
				<textarea
					value={value}
					onChange={e => onChange(e.target.value)}
					rows={rows}
					className={inputClasses}
					placeholder={placeholder}
					disabled={disabled}
				/>
			) : (
				<input
					type='text'
					value={value}
					onChange={e => onChange(e.target.value)}
					className={inputClasses}
					placeholder={placeholder}
					disabled={disabled}
				/>
			)}
			<p className='text-xs mt-1 text-muted-foreground'>{hint}</p>
		</div>
	)
}
